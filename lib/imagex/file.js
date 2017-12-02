/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * file utils
 */

var fs     = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp');

// 获取需要操作的文件，得到对应的 src2id
function getFiles(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }
        
        // 根据文件名最后的数字进行排序
        var reg = /[0-9]+/g;

        files.sort(function(a, b) {
            var na = (a.match(reg) || []).slice(-1),
                nb = (b.match(reg) || []).slice(-1);
            return na - nb;
        });

        // 为每个图片路径进行 id 标识
        var src2id = {};

        for (var i = 0, j = 0, filepath, stats, suffix; i < files.length; i++) {
            
            filepath = path.join(dir, files[i]);
            stats = fs.statSync(filepath);

            // 只获取一级文件
            if (stats.isFile()) {
                var suffix = path.extname(filepath);
                if (suffix == '.jpg' || suffix == '.png' || suffix == '.jpeg') {
                    src2id[filepath] = j++;
                } else {
                    console.log();
                    console.log("[warn]: not support", suffix);
                    console.log(filepath);
                    console.log();
                }
            }
        }

        callback && callback(src2id);
    });
}

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

module.exports = {
    getFiles: getFiles,
    deleteDir: deleteDir,
    writeFile: writeFile,
};