var Spritesmith = require('spritesmith');
var fs = require("fs");
var mkdirp = require('mkdirp');
var path = require("path");

var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;

var mkdirpObservable = bindNodeCallback(mkdirp);
var readdirObservable = bindNodeCallback(fs.readdir);
var SpritesmithRunObservable = bindNodeCallback(Spritesmith.run);

var generateHTMLFileSprites = require('./utils/generateHTMLFileSprites');
var Tiny = require("./Tiny");
var getFilePathObservable = require("./utils/getFilePathObservable.js");
var src2dist = require("./utils/src2dist.js");

module.exports = function Sprites(config) {
    var prefix = config.rename || program.rename;
    var dir = config.folder || program.folder;

    var foldername = path.basename(dir);
    dest = path.join(dir, "..", foldername + "_sprites_dist");

    var index = 1;
    readdirObservable(dir)
        .mergeMap(files => {
            var imageLen = 0,
                imageFiles = [];;
            for (var i = 0; i < files.length; i++) {
                var suffix = path.extname(files[i]);
                if (suffix == '.jpg' || suffix == '.png') {
                    imageLen++ ;
                    imageFiles.push(files[i]);
                } 
            }
            global.length = imageLen;
            return Rx.Observable.from(imageFiles);
        })
        .mergeMap(filepath => {
            return getFilePathObservable(dir+"\\"+filepath);
        })
        .filter(filepath => {
            return path.basename(filepath) != path.basename(__filename)? true: false;
        })
        .map(filepath => {
            var _index = index++;
            _index = _index >= _index>= 100? _index: _index >= 10? ("0" + _index): "00" + _index;
            return {
                newName: prefix + _index + path.extname(filepath),
                filepath: filepath
            };
        })
        .mergeMap(obj =>{
            var filepath = obj.filepath;
            var newName = obj.newName;
            // 相对于 src 的目录级 文件的目录地址   // 目标地址 + 文件夹名 + 新文件名
            var distPath = path.join(dest, 'img', path.relative(dir, path.dirname(filepath)), newName); 
            return src2dist(filepath, distPath, true);// no generate img, 只为获取相同图片的map
        })
        .mergeMap(obj => {
            // filepath: obj.filepath,
            // nameMap: obj.nameMap,
            // srcfilepaths: obj.srcfilepaths 

            // var filepaths = files.map((item) => {
            //     return dir + '/' + item;
            // });
            global.src2srcMap = obj.src2srcMap
            var filepaths = obj.srcs;
            console.log(filepaths)
            console.log('sprites image .. ');
            return SpritesmithRunObservable({
               src: filepaths
           });
        })
        .subscribe(result => {
                console.log('sprites image ✔ ');
                generateHTMLFileSprites(result.coordinates, prefix, path.join(dest, "animation.html"), global.src2srcMap);
                mkdirpObservable(dest)
                    .subscribe(x => {
                        var filePath = path.join(dest, `/${prefix}.png`);
                        fs.writeFileSync(filePath, result.image);
                        Tiny(path.dirname(filePath));
                    });

            }
            // err => console.log('Error:', err), // 调试时用这个，会错过很多错误信息
            // () => console.log('Completed')
        );
}