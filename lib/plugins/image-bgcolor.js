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

class ImageBgColor {
	constructor(bgColor) {
        // super(...args);
        this.bgColor = bgColor;
        this.apply = this.apply.bind(this)
    }
    
	apply(data, callback) {
		const { bgColor } = this;
	    try {
	        var _rgb = hex2rgb(bgColor),
	            _obj = breakrgb(_rgb);
	    } catch(e) {
	        console.log("[error]: bgcolor is unexpected..")
	        callback(data);
	        return;
	    }

	    let tmpDir = path.join(global.tmpDir, 'color', data.ratio);

	    let {
	        frames,
	        animations
	    } = data;

	    mkdirp(tmpDir, function (err) {
	        for (var i = 0, j = 0, len = frames.length; i < len; i++) {
	            ((f) => {
	                let src = f['src'],
	                    colorFilepath = path.join(tmpDir, path.basename(src));

	                f['src'] = colorFilepath;

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
	                        var writeStream = fs.createWriteStream(colorFilepath).on('finish', function(){
	                            ++j;
	                            if (j === len) {
	                                console.log(' ✔ color done');
	                                callback && callback(data);
	                            }
	                        });

	                        this.pack().pipe(writeStream);
	                    });
	            })(frames[i]);
	        }
	    });
	}
	
}

module.exports = ImageBgColor;
