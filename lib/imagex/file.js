/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * file utils
 */

const fs   = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp'),
    os     = require('os'),
    crypto = require('crypto');

const isDir = path => {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();  
}

// 删除当前目录下的所有文件及文件夹
const deleteDir = dir => {
    var files = [];
    if(fs.existsSync(dir)) {
        if (isDir(dir)) {
            files = fs.readdirSync(dir);  

            files.forEach(function(file, index) {
                deleteDir(path.join(dir, file))
                if (index === files.length - 1) {
                    fs.rmdirSync(dir);
                }
            });  
        } else {
            fs.unlinkSync(dir);
        }
    }
}

const writeFile = (filepath, content, callback) => {
    var dir = path.dirname(filepath)
    mkdirp(dir, function (err) {
        if (err) console.error(err)
        fs.writeFile(filepath, content, function(e){//会先清空原先的内容
            if(e) throw e;
            callback && callback();
        });
    });
}

const getTmpDir = () => {
    return path.join(os.tmpdir(), 'gka-' + crypto.randomBytes(16).toString('hex').slice(0, 32));
}

module.exports = {
    getTmpDir: getTmpDir,
    deleteDir: deleteDir,
    writeFile: writeFile,
};