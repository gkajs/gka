/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * output images
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

            callback && callback(r, filepath);
        });
    });
}

module.exports = function images(isSprites, obj, callback) {
    var src2dist = obj.src2dist,
        dists = obj.dists,
        srcs = obj.srcs,
        src2src = obj.src2src,
        algorithm = obj.algorithm,
        spritesFilepath = obj.spritesFilepath,
        spritesCount = obj.spritesCount;
        
    if (isSprites) {

        var count = !spritesCount? srcs.length: spritesCount,
            fileObj = path.parse(spritesFilepath),
            result = [],
            coors = {};

        for(var i = 0, len = srcs.length; i<len; i += count) {
            result.push(srcs.slice(i,i + count));
        }

        for (var j = 0, k = 0, items, newfilepath, src2 = "", _coors, rlen = result.length; j < rlen; j++) {

            items = result[j];
            newfilepath = path.join(fileObj.dir, (fileObj.name + (rlen !== 1? "-" + (j + 1): "")) + fileObj.ext);

            gsprites(items, newfilepath, algorithm, (r, filepath) => {
                ++k;
                _coors = r.coordinates;

                for(var src in src2src) {
                    src2 = src2src[src];

                    if (!_coors[src2]) {
                        continue;
                    }
                    
                    coors[path.basename(src)] = _coors[src2];
                    coors[path.basename(src)].w = r.properties.width;
                    coors[path.basename(src)].h = r.properties.height;
                    coors[path.basename(src)].file = path.basename(filepath);
                }
                
                k === rlen && callback({
                    sprites: {
                        frames: coors
                    },
                });
            })
        }
    } else {
        // normal images generated
        gimage(dists, src2dist, () => {
            callback({});
        });
    } 
};
