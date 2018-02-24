/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka utils
 */

var fs     = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp');

function writeFile(filepath, content, callback) {
    var dir = path.dirname(filepath)
    mkdirp(dir, function (err) {
        if (err) console.error(err)
        fs.writeFile(filepath, content, function(e){//会先清空原先的内容
            if(e) throw e;
            callback && callback();
        });
    });
};

function getRealDest(dest) {
    var i = 0;
    function gDest(p) {
        if (fs.existsSync(p)) {
            ++i;
            return gDest(dest + '-' + i);
        } else {
            return p;
        }
    }
    return gDest(dest);
}

module.exports = {
    writeFile: writeFile,
    getRealDest: getRealDest,
};