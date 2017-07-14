/*
* 将 图片 生成
*
*/

var fs = require('fs'),
    PNG = require('pngjs').PNG;

var mkdirp = require('mkdirp');
var path = require('path');

/**
 * 创建一个 png 图片
 * @param  {Number} width
 * @param  {Number} height
 */
function createPng(width, height) {
    var png = new PNG({
        width: width,
        height: height
    });
    // 必须把图片的所有像素都设置为 0, 否则会出现一些随机的噪点
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;
            png.data[idx] = 0;
            png.data[idx + 1] = 0;
            png.data[idx + 2] = 0;
            png.data[idx + 3] = 0;
        }
    }
    return png;
}


function gimage(dists, src2dist, callback) {

    var dist2info = {};

    mkdirp(path.dirname(dists[0]), function (err) {

        var len = dists.length;
        var j = 0;
        for (var i = 0, dist; i < len; i++) {

            dist = dists[i];
            
            for(var src in src2dist) {
                if (src2dist[src] === dist) {
                         ((src, dist) => {
                             fs.createReadStream(src)
                                .pipe(new PNG({
                                    filterType: 4
                                }))
                                .on('parsed', function() {

                                    var xx = [],yy = [];

                                    for (var y = 0; y < this.height; y++) {
                                        for (var x = 0; x < this.width; x++) {
                                            var idx = (this.width * y + x) << 2;
                                            if(this.data[idx+3] !== 0) {
                                                xx.push(x);
                                                yy.push(y);
                                            }
                                        }
                                    }
                                  
                                    var top = Math.min(...yy),
                                        bottom = Math.max(...yy),
                                        left = Math.min(...xx),
                                        right = Math.max(...xx);

                                        top = top > 0? top - 1: top,
                                        bottom = bottom < this.height? bottom + 1: bottom,
                                        left = left > 0? left - 1: left,
                                        right = right < this.width? right + 1: right;

                                    var width = right - left,
                                        height = bottom - top;

                                    var png = createPng(width, height);
                                    this.bitblt(png, left, top, width, height, 0, 0);

                                    dist2info[dist] = {
                                        top: top,
                                        left: left,
                                        right: right,
                                        bottom: bottom,
                                        width: width,
                                        height: height,
                                        data: png.data,
                                        origin: {
                                            width: this.width,
                                            height: this.height,
                                        }
                                    };

                                    var writeStream = fs.createWriteStream(dist).on('finish', function(){
                                        ++j;
                                        if (j === len) {
                                            console.log(' ✔ image generated');
                                            // console.log(dists);
                                            callback && callback(dist2info);
                                        }
                                    });

                                    png.pack().pipe(writeStream);
                                    // png.pack().pipe(fs.createWriteStream('out.png'));

                                    // console.log(this.width);
                                    // console.log(this.height);
                                    // console.log('top', top, 'right', right, 'bottom', bottom, 'left', left, 'width', width, 'height', height)
                                    // console.log(png.data)
                                });
                        })(src, dist);
                    break; // 跳出 for in，避免重新执行生成重复图片
                }
            }
        }
    });
}

module.exports = gimage;
