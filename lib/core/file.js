/**
 * file utils
 */

var fs = require("fs");
var path = require("path");
var mkdirp = require('mkdirp');

// 获取需要操作的文件，得到对应的 src2id
function getFiles(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }

        // 为每个图片路径进行 id 标识
        var src2id = {};

        for (var i = 0, filepath, stats, suffix; i < files.length; i++) {
            
            filepath = path.join(dir, files[i]);
            stats = fs.statSync(filepath);

            // 只获取一级文件
            if (stats.isFile()) {
                var suffix = path.extname(filepath);
                if (suffix == '.jpg' || suffix == '.png') {
                    src2id[filepath] = i;
                } 
            }
        }

        callback && callback(src2id);
    });
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
};

function deleteDir(dir) {  
    var files = [];  
    if(fs.existsSync(dir)) {  
        files = fs.readdirSync(dir);  
        files.forEach(function(file, index) {  
            fs.unlinkSync(path.join(dir, file));  
        });  
        fs.rmdirSync(dir);  
    }  
}

module.exports = {
    getFiles: getFiles,
    deleteDir: deleteDir,
    writeFile: writeFile,
};