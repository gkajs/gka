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

function exists(path){
     return fs.existsSync(path);  
}

function isDir(path){
    return exists(path) && fs.statSync(path).isDirectory();  
}

// 删除当前目录下的所有文件及文件夹
function deleteDir(dir) {
    var files = [];
    if(exists(dir)) {
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

function writeFile(filepath, content, callback) {
    var dir = path.dirname(filepath)
    mkdirp(dir, function (err) {
        if (err) console.error(err)
        fs.writeFile(filepath, content, function(e){//会先清空原先的内容
            if(e) throw e;
            callback && callback();
        });
    });
}

function getTmpDir() {
    return path.join(os.tmpdir(), 'gka-' + crypto.randomBytes(16).toString('hex').slice(0, 32));
}

// function deleteDir(path) {
//   if (fs.existsSync(path)) {
//     fs.readdirSync(path).forEach(function(file) {
//       const curPath = path + "/" + file;
//       if (fs.lstatSync(curPath).isDirectory()) {
//         // recurse
//         deleteDir(curPath);
//       } else {
//         // delete file
//         fs.unlinkSync(curPath);
//       }
//     });
//     fs.rmdirSync(path);
//   }
// }

module.exports = {
    getTmpDir: getTmpDir,
    deleteDir: deleteDir,
    writeFile: writeFile,
};