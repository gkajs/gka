// var program = require('commander');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');
// function isTiny(val) {
//     console.log(val);
//     return val;
// }

// program
//   .version('0.0.1')
//   .option('-f --folder <folder>', 'img folder', /^(.*)$/i, 'test')
//   .option('-r --rename <rename>', 'rename string', /^(.*)$/i, 'rename')
//   .option('-t --tiny <tiny>', 'tiny img', /^(true|false)/i, isTiny)
//   .parse(process.argv);
  
// console.log(' folder: %j', program.folder);
// console.log(' rename: %j', program.rename);
// console.log(' tiny: %j', program.tiny);

var path = require("path");
var fs = require("fs");

var sizeOf = require('image-size');
var mkdirp = require('mkdirp');

var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;

var utils = require("./utils/utils.js");
var htmlUtil = require("./utils/htmlUtil.js");

var mkdirpObservable = bindNodeCallback(mkdirp);

var fakeAsync = function(syncFn) {
    return function(opts, callback) {
        var res = syncFn(opts);
        callback(null, res);
    };
};

var statObservable =bindNodeCallback(fakeAsync(fs.statSync));
var readdirObservable = bindNodeCallback(fs.readdir);

var mkdirSync = utils.mkdirSync; 
var generateHTML = htmlUtil.generateHTML; 
var getNewNameObservable = null;
var getNewName = null;
var prefix = "";
var imgSuffix = '.png';

var isDelSelf = false;
var src = "",
    dest = "";

function main(config) {
    getNewName = config.getNewName;
    prefix = config.rename || program.rename;// config.prefix;

    src = config.folder || program.folder; //path.join("G:\\GKAUtil\\lightning");//path.join(__dirname, srcDir),

    var foldername = path.basename(src);
    dest = path.join(src, "..", foldername + "_dist"); //path.join("G:\\GKAUtil\\lightning-dist");

    getNewNameObservable = bindNodeCallback(getNewName);

    renameFilesInDir(src);
}

var hasGenerateHTMLFile = false;

var getFilePathObservable = (filepath) => {
    return statObservable(filepath)
            .filter(stats => {
                if (stats.isDirectory()) {
                    changeFileNameObservable(filepath);
                    return false;
                } else {
                    return true;
                }
            })
            .filter(stats => stats.isFile())
            .map( v => {
                return filepath;
            });
};

function src2dist(srcPath, distPath) {
    mkdirpObservable(path.dirname(distPath))
        // mergeMap( v => {
        //     return Rx.Observable.from(srcPath);
        // })
        .subscribe(
        x => {
            if (isDelSelf) {
                fs.rename(srcPath, distPath);    
                // fs.unlinkSync(filepath);
            } else {
                var readStream = fs.createReadStream(srcPath);
                var writeStream = fs.createWriteStream(distPath);
                // console.log("going to rename from "+filepath+" to "+distPath);
                readStream.pipe(writeStream);
            }
        });
    return true;
}

function generateHTMLFile(length, filepath, prefix, distPath) {
    var dimensions = sizeOf(filepath);
    var width = dimensions.width,
        height = dimensions.height;

    var keyframesStr = generateKeyFramesStr(length, 'img', prefix);
    var fileStr = generateHTML(keyframesStr, (length * 0.04), width, height);
    fs.writeFile(distPath, fileStr, function(e){//会先清空原先的内容
        if(e) throw e;
    });
}

function generateKeyFramesStr(length, distDir, prefix) {
    var keyframesStr = '',
        // str2 = '',
        percent,
        per = 100 / length,
        _index = 0;

    var begin = 1;

    for(var i = 0; i < length; i++){
        percent = (i * (per)).toFixed(2);
        _index = begin + i;
        _index = _index >= _index>= 100? _index: _index >= 10? ("0" + _index): "00" + _index;
        keyframesStr += `
            ${percent}%{
                background-image: url("./${distDir}/${prefix}${_index}${imgSuffix}");
            }
        `;
        // str2 += `
        //     <img style={{display:'none'}} src="http://huayang.qq.com/huayang_mobile/activity/act_1207/img/${prefix}${now}.png"/>
        // `;
    }
    keyframesStr += `
            99.99999%{
                opacity: 1;
            }
            100%{
                opacity: 0;
            }
    `;
    return keyframesStr;
}

function replaceIndexToken (index, suffix) {
  return prefix + index;
}

replaceIndexTokenObserable = bindNodeCallback(fakeAsync(replaceIndexToken));

function renameFilesInDir(dir){
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
                imgSuffix = suffix;
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
        // .mergeMap(filepath => {
        //     // console.log(index++)
        //     console.log(path.basename(filepath))
        //     return replaceIndexTokenObserable(index++)
        //             .map(newName => {
        //                 return {
        //                     newName: newName,
        //                     filepath: filepath
        //                 };
        //             });

        //     // return getNewNameObservable(path.basename(filepath))
        //     //         .map(newName => {
        //     //             return {
        //     //                 newName: newName,
        //     //                 filepath: filepath
        //     //             };
        //     //         });
        // })
        .map(obj =>{
            var filepath = obj.filepath;

            // 相对于 src 的目录级 文件的目录地址   // 目标地址 + 文件夹名 + 新文件名
            var distPath = path.join(dest, 'img', path.relative(src, path.dirname(filepath)), obj.newName); 

            src2dist(filepath, distPath); // 生成 img
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
            return mkdirpObservable(dest).map( v => {
                return {
                    filepath: filepath,
                    distpath: path.join(dest, "animation.html") 
                };
            });
        })
        .subscribe(
            obj => {
                var filepath = obj.filepath,
                distpath = obj.distpath;
                // console.log('-----')
                // console.log(filepath)
                generateHTMLFile(global.length, filepath, prefix, distpath);
                // console.log(dest + '/img/*.{jpg,png}')
                
            }
            // err => console.log('Error:', err), // 调试时用这个，会错过很多错误信息
            // () => console.log('Completed')
        );

        setTimeout(()=>{
            imagemin([dest + '/img/*.{jpg,png}'], dest + '/img', {
                    plugins: [
                        imageminPngquant({quality: '65-80'})
                    ]
                }).then(files => {
                    // console.log(files);
                    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
                });
            }, 5000)
}

var Spritesmith = require('spritesmith');
var SpritesmithRunObservable = bindNodeCallback(Spritesmith.run);

function generateHTMLFileSprites(coordinates, prefix, distPath) {
    var coordinatesKeys = Object.keys(coordinates);
    var coordinatesLen = coordinatesKeys.length;

    var coordinatesOne = coordinates[coordinatesKeys[0]];
    var width = coordinatesOne.width;
    var height = coordinatesOne.height;
    var keyframesStr = generateKeyFramesStrSprites(coordinates, coordinatesLen, 'img', prefix);
    var fileStr = generateHTML(keyframesStr, (coordinatesLen * 0.04), width, height);
    
    // mkdirpObservable(path.dirname(distPath))
    // .subscribe(x => {
    //     fs.writeFile(distPath, fileStr, function(e){//会先清空原先的内容
    //         if(e) throw e;
    //     });
    // });

    fs.writeFile(distPath, fileStr, function(e){//会先清空原先的内容
        if(e) throw e;
    });
}

function generateKeyFramesStrSprites(coordinates, length, distDir, prefix) {
    var coordinatesKeys = Object.keys(coordinates);

    var keyframesStr = '',
        // str2 = '',
        percent,
        per = 100 / length,
        _index = 0;

    var begin = 1;

    // console.log(coordinates)
    var one = null;
    for (var i = 0; i < coordinatesKeys.length; i++) {
        one = coordinates[coordinatesKeys[i]];

        percent = (i * (per)).toFixed(2);
        
        keyframesStr += `
            ${percent}%{
                background: url("./${prefix}${imgSuffix}") -${one.x}px -${one.y}px;
            }
        `;

    }

    keyframesStr += `
            99.99999%{
                opacity: 1;
            }
            100%{
                opacity: 0;
            }
    `;

    return keyframesStr;
}

main.sprites = function(config) {
    prefix = config.rename || program.rename;// config.prefix;
    src = config.folder || program.folder; //path.join("G:\\GKAUtil\\lightning");//path.join(__dirname, srcDir),

    var foldername = path.basename(src);
    dest = path.join(src, "..", foldername + "_sprites_dist"); //path.join("G:\\GKAUtil\\lightning-dist");

    readdirObservable(src)
        .mergeMap(files => {
            var filepaths = files.map((item) => {
                return src + '/' + item;
            });

            // console.log(filepaths)
            return SpritesmithRunObservable({
               src: filepaths
           });
        })
        .subscribe(result => {
                // console.log(result.coordinates);
                // console.log(result.properties);
                generateHTMLFileSprites(result.coordinates, prefix, path.join(dest, "animation.html") );
                // fs.writeFileSync(path.join(dest, `${prefix}${imgSuffix}`), result.image);
                mkdirpObservable(dest)
                    .subscribe(x => {
                        fs.writeFileSync(path.join(dest, `/${prefix}${imgSuffix}`), result.image);
                    });

            }
            // err => console.log('Error:', err), // 调试时用这个，会错过很多错误信息
            // () => console.log('Completed')
        );
}

main.tiny = function(imageFolder){
    imagemin([imageFolder+ '/*.{jpg,png,JPG}'], imageFolder + '/img', {use: [imageminJpegtran({progressive: true })]}, {
        plugins: [
            imageminPngquant({quality: '65-80'}),
        ]
    }).then(files => {
        console.log(files);
        //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    });
    console.log('--', imageFolder)
};
module.exports = main;
