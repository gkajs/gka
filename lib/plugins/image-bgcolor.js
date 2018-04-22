const fs     = require('fs'),
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

const colorFile = (src, dest, {r, g, b}) => {
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

class ImageBgColor {
	constructor(bgColor) {
        // super(...args);
        this.bgColor = bgColor;
        this.apply = this.apply.bind(this)
    }
    
	apply(data, callback) {
		const { bgColor } = this;

		let rgb;

	    try {
	        rgb = hex2rgb(bgColor)
	        rgb = breakrgb(rgb)
	    } catch(e) {
	        console.log("[error]: bgcolor is unexpected..")
	        return callback(data);
	    }

	    const tmpDir = path.join(global.tmpDir, 'color', data.ratio);

	    let { frames } = data;

	    mkdirp(tmpDir, err => {

            let pr = frames.map(frame => {

            	let src = frame['src'],
        			filepath = path.join(tmpDir, path.basename(src));
                
                // change src
                frame['src'] = filepath;
                return colorFile(src, filepath, rgb);
            });

			Promise.all(pr).then(() => {
				console.log(' ✔ color done');
				callback && callback(data);
			});
	    });
	}
}

module.exports = ImageBgColor;
