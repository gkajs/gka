/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * output images
 * 
 */

var fs          = require("fs"),
    path        = require('path'),
    mkdirp      = require('mkdirp'),
    Spritesmith = require('spritesmith');

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
                                console.log(' ✔ ' + path.basename(dist) +' generated');
                                if (j === len) {
                                    // console.log(' ✔ image generated');
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

// sprites
// 生成合图, 返回坐标数据
function gsprites(srcs, filepath, algorithm, callback) {
    Spritesmith.run({
        src: srcs,
        algorithm: algorithm,
    }, function(err, r) {
        mkdirp(path.dirname(filepath), function (err) {
            fs.writeFileSync(filepath, r.image);
            console.log(' ✔ ' + path.basename(filepath) +' generated');

            callback && callback(r);
        });
    });
}

module.exports = function images(isSprites, obj, callback) {
    var src2dist = obj.src2dist,
        dists = obj.dists,
        srcs = obj.srcs,
        src2src = obj.src2src,
        algorithm = obj.algorithm,
        spritesFilepath = obj.spritesFilepath;

    if (isSprites) {
        gsprites(srcs, spritesFilepath, algorithm, (r) => {
            var sprites = {};
            var src2 = "", _coors = r.coordinates, coors = {};
            for(var src in src2src) {
                src2 = src2src[src];
                coors[path.basename(src)] = _coors[src2];
            }

            // 原每个 src 按顺序对应在 sprites 中的位置
            sprites["file"] = path.basename(spritesFilepath);
            sprites["w"] = r.properties.width;
            sprites["h"] = r.properties.height;
            sprites["frames"] = coors;

            callback({
                r: r,
                sprites: sprites,
            });
        });
    } else {
        // normal images generated
        gimage(dists, src2dist, () => {
            callback({});
        });
    } 
};
