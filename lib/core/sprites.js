var Spritesmith = require('spritesmith');
var fs = require("fs");
var mkdirp = require('mkdirp');
var path = require("path");

var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;

var mkdirpObservable = bindNodeCallback(mkdirp);
var readdirObservable = bindNodeCallback(fs.readdir);
var SpritesmithRunObservable = bindNodeCallback(Spritesmith.run);

var gsprites = require('../generate/gsprites');
var ghtml = require("../generate/ghtml.js");
var gimage = require("../generate/gimage");

var tiny = require("./tiny");
var getFilePathObservable = require("../utils/getFilePathObservable.js");

module.exports = function sprites(config) {
    var prefix = config.prefix || "prefix",
        dir = config.folder;

    var foldername = path.basename(dir);
    dest = path.join(dir, "..", foldername + "-gka-sprites");

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
            return getFilePathObservable(path.join(dir, filepath));
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
            return gimage(filepath, distPath, true); // 不生成图片，只获取相同图片的map
        })
        .mergeMap(obj => {
            // filepath: obj.filepath,
            // nameMap: obj.nameMap,
            // srcfilepaths: obj.srcfilepaths 

            global.src2srcMap = obj.src2srcMap;

            console.log('sprites image .. ');
            return SpritesmithRunObservable({
               src: obj.srcs
           });
        })
        .subscribe(result => {
                console.log('sprites image ✔ ');
                gsprites(result.coordinates, prefix, dest, global.src2srcMap);

                console.log('gka.html generating..');
                ghtml(dest);

                mkdirpObservable(dest)
                    .subscribe(x => {
                        var filePath = path.join(dest, `/${prefix}.png`);
                        fs.writeFileSync(filePath, result.image);
                        tiny(path.dirname(filePath));
                    });
            }
            // err => console.log('Error:', err), // 调试时用这个，会错过错误信息
            // () => console.log('Completed')
        );
};