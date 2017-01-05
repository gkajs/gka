var path = require("path");
var fs = require("fs");
var mkdirp = require('mkdirp');
var Rx = require('rxjs');

var bindNodeCallback = Rx.Observable.bindNodeCallback;

var generateHTMLFile = require("./utils/generateHTMLFile.js");
var src2dist = require("./utils/src2dist.js");

var mkdirpObservable = bindNodeCallback(mkdirp);
var readdirObservable = bindNodeCallback(fs.readdir);

var getFilePathObservable = require("./utils/getFilePathObservable.js");

var Sprites = require("./Sprites");
var Tiny = require("./Tiny");

var hasGenerateHTMLFile = false;

function main(config){
    var prefix = config.rename || program.rename,
    dir = config.folder || program.folder;

    var foldername = path.basename(dir);
    var dest = path.join(dir, "..", foldername + "_dist");

    var index = 1;
    readdirObservable(dir)
        .mergeMap(files => {
            global.length = files.length;
            return Rx.Observable.from(files);
        })
        .mergeMap(filepath => {
            return getFilePathObservable(dir+"\\"+filepath);
        })
        .filter(filepath => {
            return path.basename(filepath) != path.basename(__filename)? true: false;
        })
        .filter(filepath => {
            var suffix = path.extname(filepath);
            if (suffix == '.jpg' || suffix == '.png') {
                return true;
            } 
            return false;
        })
        .map(filepath => {
            var _index = index++;
            _index = _index >= _index>= 100? _index: _index >= 10? ("0" + _index): "00" + _index;
            return {
                newName: prefix + _index + path.extname(filepath),
                filepath: filepath
            };
        })
        // TODO customize filename
        .map(obj =>{
            var filepath = obj.filepath;
            var newName = obj.newName;
            // 相对于 src 的目录级 文件的目录地址   // 目标地址 + 文件夹名 + 新文件名
            var distPath = path.join(dest, 'img', path.relative(dir, path.dirname(filepath)), newName); 
            src2dist(filepath, distPath); // generate img
            return filepath;
        })
        .filter(filepath => {
            if (!hasGenerateHTMLFile) {
                hasGenerateHTMLFile = true;
                return true;
            } else {
                return false;
            }
        })
        .mergeMap(filepath =>{
            return mkdirpObservable(dest).map(v => {
                return {
                    filepath: filepath,
                    distpath: path.join(dest, "animation.html") 
                };
            });
        })
        .subscribe(
            obj => {
                // console.log(obj.filepath)
                generateHTMLFile(global.length, obj.filepath, prefix, obj.distpath);
            }
            // err => console.log('Error:', err), // dubug will miss err stack
            // () => console.log('Completed')
        );
        // setTimeout(()=>{
        //     imagemin([dest + '/img/*.{jpg,png}'], dest + '/img', {
        //             plugins: [
        //                 imageminPngquant({quality: '65-80'})
        //             ]
        //         }).then(files => {/* console.log(files);*/});
        //     }, 5000)
}

main.sprites = Sprites;
main.tiny = Tiny;

module.exports = main;
