/*
* 生成合图
*
*
*/

var Spritesmith = require('spritesmith');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

function gsprites(srcs, filepath, algorithm, callback) {
    Spritesmith.run({
        src: srcs,
        algorithm: algorithm,
    }, function(err, r) {
        mkdirp(path.dirname(filepath), function (err) {
            fs.writeFileSync(filepath, r.image);
            console.log(' ✔ gka-sprites.png generated');

            callback && callback(r);
        });
    });
}

module.exports = gsprites;
