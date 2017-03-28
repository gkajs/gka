var fs = require("fs");
var Rx = require('rxjs');
var path = require("path");
var mkdirp = require('mkdirp');
var md5 = require('md5');

var bindNodeCallback = Rx.Observable.bindNodeCallback;
var mkdirpObservable = bindNodeCallback(mkdirp);

var fileMd5Map = {},
    md5name = 0,
    nameMap = {},
    len = 0,
    src2srcMap = {},
    _md52srcMap = {},
    srcs = [];

module.exports =  function gimage(srcPath, distPath, noWriteNewImage) {
    return mkdirpObservable(path.dirname(distPath))
        .mergeMap(x => {
            return Rx.Observable.create(function (observer) {
                fs.readFile(srcPath, function(err, data) {
                    if(err) {
                        console.error(err);
                    } else {
                        len++;
                        md5name = md5(data);
                        if(fileMd5Map[md5name]){
                            // 相同的图片不再生成新图片
                            // fs.writeFileSync(distPath, data); 
                            // 原文件跟最终生成的文件map
                            nameMap[path.basename(distPath)] = path.basename(fileMd5Map[md5name]);
                            src2srcMap[srcPath] = _md52srcMap[md5name];
                        } else {
                            fileMd5Map[md5name] = distPath;
                            if (!noWriteNewImage) {
                                fs.writeFileSync(distPath, data);
                            }
                            _md52srcMap[md5name] = srcPath;
                            src2srcMap[srcPath] = srcPath;
                            srcs.push(srcPath)
                            nameMap[path.basename(distPath)] = path.basename(distPath);
                        }
                    }
                    if (len == global.length) {
                        observer.next({filepath:srcPath,nameMap:nameMap,src2srcMap:src2srcMap, srcs: srcs});
                    }
                });

                // var writeStream = fs.createWriteStream(distPath).on('finish', function(){
                //     observer.next(srcPath);
                // });
                // fs.createReadStream(srcPath).pipe(writeStream);
                // observer.next({filepath:srcPath,nameMap:nameMap});
                return () => {
                    // console.log('disposed');
                };
            });
        });
}

// fs.rename(srcPath, distPath);  // fs.unlinkSync(filepath);
