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

module.exports = function Sprites(config) {
    prefix = config.rename || program.rename;
    src = config.folder || program.folder;

    var foldername = path.basename(src);
    dest = path.join(src, "..", foldername + "_sprites_dist");

    readdirObservable(src)
        .mergeMap(files => {
            var filepaths = files.map((item) => {
                return src + '/' + item;
            });
            return SpritesmithRunObservable({
               src: filepaths
           });
        })
        .subscribe(result => {
                // console.log(result);
                generateHTMLFileSprites(result.coordinates, prefix, path.join(dest, "animation.html"));
                mkdirpObservable(dest)
                    .subscribe(x => {
                        fs.writeFileSync(path.join(dest, `/${prefix}.png`), result.image);
                    });

            }
            // err => console.log('Error:', err), // 调试时用这个，会错过很多错误信息
            // () => console.log('Completed')
        );
}