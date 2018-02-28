/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * flatten
 */


var fs     = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp');

module.exports = function flatten(data, callback) {

    let tmpDir = path.join(global.tmpDir, 'flatten');

    let {
        frames,
        animations
    } = data;

    let j = 0,
        len = frames.length,
        src = '',
        flatteningFilepath = '',
        writeStream = null;

    mkdirp(tmpDir, function (err) {
        
        for (var key in animations) {

            animations[key].map((fIndex, i) => {

                src = frames[fIndex]['src'];

                flatteningFilepath = path.join(tmpDir, (key !== '' ? key + '_' + path.basename(src) : path.basename(src)));

                frames[fIndex]['src'] = flatteningFilepath;

                writeStream = fs.createWriteStream(flatteningFilepath).on('finish', function(){
                    ++j;
                    if (j === len) {
                        console.log(' ✔ flatten done');
                        callback && callback(data);
                    }
                });
                fs.createReadStream(src).pipe(writeStream);
            })
        }
    })
}