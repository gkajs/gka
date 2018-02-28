/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 */

let path       = require("path"),
    flatten    = require("./flatten"),
    split      = require("./split"),
    color      = require("./color"),
    diff       = require("./diff"),
    crop       = require("./crop"),
    unique     = require("./unique"),
    sprites    = require("./sprites"),
    name       = require("./name"), 
    generate   = require("./generate"), 
    mini       = require("./mini");

let {
    getFiles,
    getTmpDir,
    writeFile,
    deleteDir,
} = require("./file");

module.exports = function imagex(opt, callback) {
    var src       = opt.dir,
        dest      = opt.imgOutput || opt.output,
        prefix    = opt.prefix,
        bgColor   = opt.color || opt.bgcolor,
        isSplit   = opt.split,
        isDiff    = opt.diff,
        isCrop    = opt.crop,
        isUnique  = opt.unique,
        isSprites = opt.sprites,
        spritesCount = opt.spritesCount || opt.count,
        algorithm = opt.algorithm || 'left-right',
        isMini    = opt.mini,
        isInfo    = opt.info,
        isReplace = opt.replace;

    global.tmpDir = getTmpDir();
    // console.log('tmpDir:', tmpDir);

    if (!src) {
        console.log();
        console.log('[error]: ' + 'dir required!');
        console.log('----------------------------');
        return;
    }

    // MINI source image
    if (isReplace && isMini) {
        mini(src);
        return;
    }

    getFiles(src, (data) => {
        // console.log('getFiles', data)
        // return;
        flatten(data, (data) => {
            // console.log('flatten', data)
            // return;
            split(isSplit, data, (data) => {
                // console.log('split', data)
                // return;   
                color(bgColor, data, (data) => {
                    // console.log('color', data)
                    // return
                    diff(isDiff, data, (data) => {
                        // console.log('diff', data)
                        // return;
                        crop(isCrop, data, (data) => {
                            // console.log('crop', data)
                            // return;
                            unique(isUnique, data, (data) => {
                                // console.log('unique', data)
                                // return;

                                sprites(isSprites, data, {
                                    algorithm: algorithm,
                                    spritesCount: spritesCount,
                                }, (data) => {
                                    // console.log('sprites', data)
                                    // return;

                                    name(data, prefix, dest, (data) => {
                                        // console.log('name', data)
                                        // return;
                                        // output images
                                        generate(data, () => {
                                            isMini && mini(dest);
                                            isInfo && writeFile(path.join(dest, "__info", "data.json"), JSON.stringify(data, null, '    '), () => {
                                                console.log(` ✔ images __info data.json generated`);
                                            })
                                            // console.log(data)
                                            callback && callback(data);
                                            deleteDir(tmpDir);
                                        })
                                    })
                                })
                            }); 
                        });
                    })
                })
            })
        })
    });
}