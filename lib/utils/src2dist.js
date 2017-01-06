var fs = require("fs");
var Rx = require('rxjs');

var path = require("path");
var mkdirp = require('mkdirp');
var bindNodeCallback = Rx.Observable.bindNodeCallback;
var mkdirpObservable = bindNodeCallback(mkdirp);

module.exports =  function src2dist(srcPath, distPath) {
    return mkdirpObservable(path.dirname(distPath))
        .mergeMap(x => {
            return Rx.Observable.create(function (observer) {
                var writeStream = fs.createWriteStream(distPath).on('finish', function(){
                    observer.next(srcPath);
                });

                fs.createReadStream(srcPath).pipe(writeStream);

                return () => {
                    // console.log('disposed');
                };
            });
        });
}

//     fs.rename(srcPath, distPath);  // fs.unlinkSync(filepath);
