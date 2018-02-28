/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * utils
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

function simpleMerge(defaultObj, obj) {
    let res = {};
    for(var key in defaultObj) {
        res[key] = defaultObj[key];
    }
    for(var key in obj) {
        res[key] = obj[key] !== undefined? obj[key]: defaultObj[key]
    }
    return res;
}

function isFunction(value) {
    if(typeof value === "function") {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    simpleMerge,
    isFunction,
    writeFile,
};
