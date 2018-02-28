/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * crop
 */

var fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    PNG    = require('pngjs').PNG;

function createPng(width, height) {
    var png = new PNG({ width: width, height: height });

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

function crop(isCrop, data, callback) {
    if (!isCrop) {
        callback(data);
        return;
    }

    let tmpDir = path.join(global.tmpDir, 'crop');

    let {
        frames,
        animations
    } = data;

    mkdirp(tmpDir, function (err) {
        for (var i = 0, j = 0, len = frames.length; i < len; i++) {
            ((f, fIndex) => {
                let src = f['src'],
                    newSrc = path.join(tmpDir, path.basename(src));

                fs.createReadStream(src)
                    .pipe(new PNG({
                        filterType: 4
                    }))
                    .on('parsed', function() {

                        var max_y = Number.MIN_VALUE,
                            min_y = Number.MAX_VALUE,
                            max_x = Number.MIN_VALUE,
                            min_x = Number.MAX_VALUE;

                        for (var y = 0; y < this.height; y++) {
                            for (var x = 0; x < this.width; x++) {
                                var idx = (this.width * y + x) << 2;
                                if(this.data[idx+3] !== 0) {

                                    // bugfix: Math.min(...yy)  Maximum call stack size exceeded
                                    if (max_y < y) {
                                        max_y = y;
                                    }
                                    if (min_y > y) {
                                        min_y = y;
                                    }
                                    if (max_x < x) {
                                        max_x = x;
                                    }
                                    if (min_x > x) {
                                        min_x = x;
                                    }
                                }
                            }
                        }
                        
                        var top = min_y === Number.MAX_VALUE?0 : min_y,
                            bottom = max_y,
                            left = min_x === Number.MAX_VALUE?0 : min_x,
                            right = max_x;

                            top = top > 0? top - 1: top,
                            bottom = bottom < this.height? bottom + 1: bottom,
                            left = left > 0? left - 1: left,
                            right = right < this.width? right + 1: right;

                        var width = right - left,
                            height = bottom - top;

                        // console.log(top, bottom, left, right)
                        
                        var png = createPng(width, height);
                        this.bitblt(png, left, top, width, height, 0, 0);

                        f['src'] = newSrc;
                        f['offX'] = f['offX']? f['offX']: 0;
                        f['offY'] = f['offY']? f['offY']: 0;
                        f['offX'] += left;
                        f['offY'] += top;
                        f['width'] = width;
                        f['height'] = height;
                        f['sourceW'] = f['sourceW'] || this.width;
                        f['sourceH'] = f['sourceH'] || this.height;

                        var writeStream = fs.createWriteStream(newSrc).on('finish', function(){
                            ++j;
                            if (j === len) {
                                console.log(' ✔ crop done');
                                callback && callback(data);
                            }
                        });

                        png.pack().pipe(writeStream);
                    });
            })(frames[i], i);
        }
    });
}

module.exports = crop;
