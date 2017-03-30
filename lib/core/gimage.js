/*
* 将 图片 生成
*
*/
var mkdirp = require('mkdirp');
var fs = require("fs");
var path = require('path');

function gimage(dists, src2dist, callback) {
    mkdirp(path.dirname(dists[0]), function (err) {
        var len = dists.length;
        var j = 0;
        for (var i = 0, dist; i < len; i++) {

            dist = dists[i];
            
            for(var src in src2dist) {
                if (src2dist[src] === dist) {
                         ((src, dist) => {
                            var writeStream = fs.createWriteStream(dist).on('finish', function(){
                                ++j;
                                if (j === len) {
                                    console.log(' ✔ image generated');
                                    // console.log(dists);
                                    callback && callback(len);
                                }
                            });
                            fs.createReadStream(src).pipe(writeStream);
                        })(src, dist);
                    break; // 跳出 for in，避免重新执行生成重复图片
                }
            }
        }
    });
}

module.exports = gimage;
