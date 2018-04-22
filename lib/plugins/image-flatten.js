var fs     = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp');

const lattenFile = (src, dest, {r, g, b}) => {
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

const writeFile = (src, dest) => {
    return new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(dest).on('finish', resolve);
        fs.createReadStream(src).pipe(writeStream);
    })
}

class ImageFlatten {
    constructor(bgColor) {
        // super(...args);
        this.apply = this.apply.bind(this)
    }
    
    apply(data, callback) {

        let tmpDir = path.join(global.tmpDir, 'flatten', data.ratio);
        let {
            frames,
            animations
        } = data;

        mkdirp(tmpDir, function (err) {

            let pr = [];

            for (let key in animations) {
                let p = animations[key].map((fIndex, i) => {

                    let src = frames[fIndex]['src'],
                    	filepath = path.join(tmpDir, path.basename(src));

                    	// 将名字进行修改成 folder_filename
                    	// filepath = path.join(tmpDir, (key !== '' ? key + '_' + path.basename(src) : path.basename(src)));
                    
                    frames[fIndex]['src'] = filepath;
                    return writeFile(src, filepath)
                })
                pr = pr.concat(...p)
            }
			Promise.all(pr).then(() => {
				console.log(' ✔ flatten done');
				callback && callback(data);
			});
        })
    }
}

module.exports = ImageFlatten;
