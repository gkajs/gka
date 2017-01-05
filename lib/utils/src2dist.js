var path = require("path");
var fs = require("fs");

var mkdirp = require('mkdirp');

var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;
var mkdirpObservable = bindNodeCallback(mkdirp);

var isDelSelf = false;
module.exports =  function src2dist(srcPath, distPath) {
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