/*
* 获取需要操作的文件，得到对应的 src2id
*
*
*/
var fs = require("fs");
var path = require("path");

function getfiles(dir, callback) {
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

module.exports = getfiles;