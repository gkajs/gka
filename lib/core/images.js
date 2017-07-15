/*
* 将 图片 生成
*
*/
var mkdirp = require('mkdirp');
var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');
var Spritesmith = require('spritesmith');

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

// 生成合图
function gsprites(srcs, filepath, algorithm, callback) {
    Spritesmith.run({
        src: srcs,
        algorithm: algorithm,
    }, function(err, r) {
        mkdirp(path.dirname(filepath), function (err) {
            fs.writeFileSync(filepath, r.image);
            console.log(' ✔ gka-sprites.png generated');

            callback && callback(r);
        });
    });
}


module.exports = function images(isSprites, obj, callback) {
    var prefix = obj.prefix,
        suffix = obj.suffix,
        src2dist = obj.src2dist,
        dists = obj.dists,
        srcs = obj.srcs,
        algorithm = obj.algorithm,
        dest = obj.dest;

    if (isSprites) {
        var spritesFilepath = path.join(dest, "img", prefix + "gka_sprites" + suffix);
        // 生成合图, 返回坐标数据
        gsprites(srcs, spritesFilepath, algorithm, (r) => {
            callback({
                r: r,
            });
        });
    } else {
        // normal images generated
        gimage(dists, src2dist, () => {
            callback({});
        });
    } 
}
