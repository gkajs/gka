/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const fs   = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    PNG    = require('pngjs').PNG;

const createPng = (width, height) => {
    let png = new PNG({ width: width, height: height });

    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            let idx = (png.width * y + x) << 2;
            png.data[idx] = 0;
            png.data[idx + 1] = 0;
            png.data[idx + 2] = 0;
            png.data[idx + 3] = 0;
        }
    }
    return png;
}

const cropFile = (src, dest) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(src)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function() {

            let max_y = Number.MIN_VALUE,
                min_y = Number.MAX_VALUE,
                max_x = Number.MIN_VALUE,
                min_x = Number.MAX_VALUE;

            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    let idx = (this.width * y + x) << 2;
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

            let top    = min_y === Number.MAX_VALUE? 0 : min_y,
                bottom = max_y,
                left   = min_x === Number.MAX_VALUE? 0 : min_x,
                right  = max_x;

            top    = top > 0? top - 1: top,
            bottom = bottom < this.height? bottom + 1: bottom,
            left   = left > 0? left - 1: left,
            right  = right < this.width? right + 1: right;

            let width = right - left,
                height = bottom - top;

            // console.log(top, bottom, left, right)

            let png = createPng(width, height);
            this.bitblt(png, left, top, width, height, 0, 0);

            let writeStream = fs.createWriteStream(dest).on('finish', () => {
                resolve({left, top, width, height, sourceW: this.width, sourceH: this.height})
            });
            png.pack().pipe(writeStream);
        });
    })
}

module.exports = class ImageCropPlugin {
    constructor() {}
    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                data,
                fileSystem,
            } = context;
            
            let tmpDir = path.join(fileSystem.tmpdir, 'crop', data.ratio);

            let { frames } = data;
    
            mkdirp(tmpDir, function (err) {
                let pr = frames.map(frame => {
    
                    let src = frame['src'],
                        filepath = path.join(tmpDir, path.basename(src));
    
                    return cropFile(src, filepath).then(({left, top, width, height, sourceW, sourceH}) => {
                        frame['src']  = filepath;
                        frame['offX'] = frame['offX'] || 0;
                        frame['offY'] = frame['offY'] || 0;
                        frame['offX'] += left;
                        frame['offY'] += top;
                        frame['width']   = width;
                        frame['height']  = height;
                        frame['sourceW'] = frame['sourceW'] || sourceW;
                        frame['sourceH'] = frame['sourceH'] || sourceH;
                    });
                });
    
                Promise.all(pr).then(() => {
                    console.log('[+] crop');
                    next(context);
                });
            });
        })
    }
}