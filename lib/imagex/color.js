/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * image color
 */

var fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    PNG    = require('pngjs').PNG;

function hex2rgb(hex){
    var color = hex.toLowerCase();
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (color && reg.test(color)) {
        if (color.length === 4) {
            var colorNew = "#";
            for (var i=1; i<4; i+=1) {
                colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));    
            }
            color = colorNew;
        }
        var colorChange = [];
        for (var i=1; i<7; i+=2) {
            colorChange.push(parseInt("0x"+color.slice(i, i+2)));    
        }
        return "rgb(" + colorChange.join(",") + ")";
    }
    return color;
};

function breakrgb(rgb) {
    var arr = rgb.slice(4, -1).split(',');
    return {
        r: arr[0],
        g: arr[1],
        b: arr[2],
    }
}

function color(bgColor, tmpDir, src2id, callback) {
    if (!bgColor) {
        callback(src2id, {});
        return;
    }

    try {
        var _rgb = hex2rgb(bgColor),
            _obj = breakrgb(_rgb);

    } catch(e) {
        console.log("[error]: bgcolor is unexpected..")
        callback(src2id, {});
        return;
    }

    tmpDir = path.join(tmpDir, 'color');

    var len = Object.keys(src2id).length,
        j = 0,
        src2idcolor = {};

    mkdirp(tmpDir, function (err) {
        for(var src in src2id) {
            ((src, id) => {
                var filename = path.basename(src),
                    trimFilepath = path.join(tmpDir, filename);

                src2idcolor[trimFilepath] = src2id[src];

                fs.createReadStream(src)
                    .pipe(new PNG({
                        colorType: 2,
                        bgColor: {
                            red: _obj.r,
                            green: _obj.g,
                            blue: _obj.b
                        }
                    }))
                    .on('parsed', function() {
                        var writeStream = fs.createWriteStream(trimFilepath).on('finish', function(){
                            ++j;
                            if (j === len) {
                                console.log(' ✔ color done');
                                callback && callback(src2idcolor);
                            }
                        });

                        this.pack().pipe(writeStream);
                    });
            })(src, src2id[src]);
        }
    });
}

module.exports = color;
