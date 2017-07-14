/*
* 将 图片 生成
*
*/

var fs = require('fs'),
    PNG = require('pngjs').PNG;

var mkdirp = require('mkdirp');
var path = require('path');

// 创建一个 png 图片
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

function cut(isShouldcut, src2id, callback) {
    if (!isShouldcut) {
        callback(src2id, {});
        return;
    }

    var tmpDir = path.join(__dirname, "..", "..", `.cut-${+new Date}`);

    var len = Object.keys(src2id).length;
    var j = 0;
    var src2idcut = {};
    var src2info = {};

    mkdirp(tmpDir, function (err) {
        for(var src in src2id) {
            ((src, id) => {

                var filename = path.basename(src);
                var cutFilepath = path.join(tmpDir, filename);

                src2idcut[cutFilepath] = src2id[src];

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

                        // src2info[cutFilepath] = {
                        //     top: top,
                        //     left: left,
                        //     right: right,
                        //     bottom: bottom,
                        //     width: width,
                        //     height: height,
                        //     data: png.data,
                        //     origin: {
                        //         width: this.width,
                        //         height: this.height,
                        //     }
                        // };

                        src2info[cutFilepath] = {
                            offX: top,
                            offY: left,
                            w: width,
                            h: height,
                            sourceW: this.width,
                            sourceH: this.height,
                            // data: png.data,
                        };

                        var writeStream = fs.createWriteStream(cutFilepath).on('finish', function(){
                            ++j;
                            if (j === len) {
                                console.log(' ✔ image generated');
                                callback && callback(src2idcut, src2info);
                            }
                        });

                        png.pack().pipe(writeStream);
                        // png.pack().pipe(fs.createWriteStream('out.png'));

                        // console.log(this.width);
                        // console.log(this.height);
                        // console.log('top', top, 'right', right, 'bottom', bottom, 'left', left, 'width', width, 'height', height)
                        // console.log(png.data)
                    });

            })(src, src2id[src]);
        }

    });
}



module.exports = cut;
