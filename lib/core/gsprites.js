/*
* 生成合图
*
*
*/

var Spritesmith = require('spritesmith');
var path = require('path');
var fs = require('fs');

function gsprites(srcs, filepath, callback) {
    Spritesmith.run({src: srcs}, function(err, r) {
        fs.writeFileSync(filepath, r.image);

        console.log(' ✔ gka-sprites.png generated');

        callback && callback(r);
    });
}

module.exports = gsprites;
