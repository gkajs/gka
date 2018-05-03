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

const hex2rgb = hex => {
    let color = hex.toLowerCase();
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (color && reg.test(color)) {
        if (color.length === 4) {
            let colorNew = "#";
            for (let i=1; i<4; i+=1) {
                colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));    
            }
            color = colorNew;
        }
        let colorChange = [];
        for (let i=1; i<7; i+=2) {
            colorChange.push(parseInt("0x"+color.slice(i, i+2)));    
        }
        return "rgb(" + colorChange.join(",") + ")";
    }
    return color;
};

const breakrgb = rgb => {
    let arr = rgb.slice(4, -1).split(',');
    return {
        r: arr[0],
        g: arr[1],
        b: arr[2],
    }
}

const colorFile = (bgcolor) => {
    
    let rgb;
    try {
        rgb = hex2rgb(bgcolor)
        rgb = breakrgb(rgb)
    } catch(e) {
        throw new Error("Invalid argument: bgcolor.");
    }

    const {r, g, b} = rgb;

    return (src, dest) => {
        return new Promise((resolve, reject) => {
            fs.createReadStream(src)
            .pipe(new PNG({
                colorType: 2,
                bgColor: {
                    red: r,
                    green: g,
                    blue: b
                }
            }))
            .on('parsed', function() {
                var writeStream = fs.createWriteStream(dest).on('finish', resolve);
                this.pack().pipe(writeStream);
            });
        })
    }
}

module.exports = class ImageBgColorPlugin {
    constructor(bgColor) {
        this.bgColor = bgColor;
        this.apply = this.apply.bind(this)
    }

    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                options,
                data,
                fileSystem,
            } = context;

            const { bgColor } = this;
            const colorFileTool = colorFile(bgColor);
            const tmpDir = path.join(fileSystem.tmpdir, 'color', data.ratio);

            let { frames } = data;

            mkdirp(tmpDir, err => {

                let pr = frames.map(frame => {

                    let src = frame['src'],
                        filepath = path.join(tmpDir, path.basename(src));
                    
                    // change src
                    frame['src'] = filepath;
                    return colorFileTool(src, filepath);
                });

                Promise.all(pr).then(() => {
                    console.log('[+] color');
                    next(context);
                });
            });
        })
    }
}