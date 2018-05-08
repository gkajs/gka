/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const fs   = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp');

const writeFile = (src, dest) => {
    return new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(dest).on('finish', resolve);
        fs.createReadStream(src).pipe(writeStream);
    })
}

module.exports = class ImageFlattenPlugin {
    constructor() {}
    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                options,
                data,
                fileSystem,
            } = context;

            let tmpDir = path.join(fileSystem.tmpdir, 'flatten', data.ratio);
            
            let {
                frames,
                animations
            } = data;

            // pass by
            if (Object.keys(animations).length === 1) return next(context);

            mkdirp(tmpDir, function (err) {

                let pr = [];
                for (let key in animations) {
                    let p = animations[key].map((fIndex, i) => {

                        let src = frames[fIndex]['src'];
                        // let filepath = path.join(tmpDir, path.basename(src));

                        //  rename the file to "folder_filename"
                        let filepath = fileSystem.join(tmpDir, (key !== '' ? key + '_' + fileSystem.basename(src) : fileSystem.basename(src)));
                    
                        frames[fIndex]['src'] = filepath;
                        return writeFile(src, filepath)
                    })
                    pr = pr.concat(...p)
                }
                Promise.all(pr).then(() => {
                    console.log('[+] flatten');
                    next(context);
                });
            })
        })
    }
}