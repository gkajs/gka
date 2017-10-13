/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * unique
 */

var fs  = require("fs"),
    md5 = require('md5');

function unique(isUnique, src2id, callback) {
    if (!isUnique) {
        callback(src2id);
        return;
    }
    
    var md5name = null,
        md52src = {};

    var i = 0;
    var len = Object.keys(src2id).length;

    for(var src in src2id) {
        ((src) => {
            ++i;
            var data = fs.readFileSync(src);
            md5name = md5(data);

            if (md52src[md5name] !== undefined) {
                
                // 已存在相同图片，指向相同src
                src2id[src] = md52src[md5name];
            } else {

                // 不存在相同图片，保留指向原src
                md52src[md5name] = src2id[src];
            }

            if (i === len) {
                callback && callback(src2id);
            }
                
        })(src);
    }
}

module.exports = unique;