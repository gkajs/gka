var path = require("path");
var fs = require("fs");
var mkdirp = require('mkdirp');
var Rx = require('rxjs');

var bindNodeCallback = Rx.Observable.bindNodeCallback;

// var generateHTMLFile = require("./utils/generateHTMLFile.js");
var gcss = require("./utils/gcss.js");
var src2dist = require("./utils/src2dist.js");

var mkdirpObservable = bindNodeCallback(mkdirp);
var readdirObservable = bindNodeCallback(fs.readdir);

var getFilePathObservable = require("./utils/getFilePathObservable.js");

var Sprites = require("./Sprites");
var Tiny = require("./Tiny");

function main(config){
    var prefix = config.rename || program.rename,
    dir = config.folder || program.folder;

    var foldername = path.basename(dir);
    var dest = path.join(dir, "..", foldername + "-gka");

    var index = 1;
    console.log("main")
    readdirObservable(dir)
        .mergeMap(files => {
            console.log("files", files)
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
            console.log("filepath2", filepath)
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
        .mergeMap(obj => {
            var filepath = obj.filepath;
            var newName = obj.newName;
            // 相对于 src 的目录级 文件的目录地址   // 目标地址 + 文件夹名 + 新文件名
            var distPath = path.join(dest, 'img', path.relative(dir, path.dirname(filepath)), newName); 
            return src2dist(filepath, distPath);// generate img
        })
        .mergeMap((obj) =>{
            return mkdirpObservable(dest).map(v => {
                return {
                    filepath: obj.filepath,
                    nameMap: obj.nameMap,
                    distpath: path.join(dest, "animation.html") 
                };
            });
        })
        .take(1)
        .subscribe(
            obj => {
                gcss(global.length, obj.filepath, prefix, dest, obj.nameMap);
                Tiny(dest + '/img')
            }
            // err => console.log('Error:', err), // dubug will miss err stack
            // () => console.log('Completed')
        );
}

main.sprites = Sprites;
main.tiny = Tiny;

module.exports = main;
