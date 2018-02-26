/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 */

var path       = require("path"),
    flatten    = require("./flatten"),
    split      = require("./split"),
    color      = require("./color"),
    diff       = require("./diff"),
    crop       = require("./crop"),
    unique     = require("./unique"),
    sprites    = require("./sprites"),
    name       = require("./name"), 
    generate   = require("./generate"), 
    mini       = require("./mini"),
    file       = require("./file"), 

    getTmpDir  = file.getTmpDir,
    writeFile  = file.writeFile,
    getFiles   = file.getFiles,
    deleteDir  = file.deleteDir;

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
        console.log('[error]: ' + 'imagex need dir !');
        console.log('----------------------------');
        return;
    }

    // MINI source image
    if (isReplace && isMini) {
        mini(src);
        return;
    }

    getFiles(src, (data) => {
        // console.log('getFiles')
        // console.log(data)
        // return;
        flatten(data, (data) => {
            // console.log('flatten')
            // console.log(data)
            // return;
            split(isSplit, data, (data) => {
                // console.log('split')
                // console.log(data)
                // return;   
                color(bgColor, data, (data) => {
                    // console.log('color')
                    // console.log(data)
                    // return
                    diff(isDiff, data, (data) => {
                        // console.log('diff')
                        // console.log(data)
                        // return;
                        crop(isCrop, data, (data) => {
                            // console.log('crop')
                            // console.log(data)
                            // return;
                            unique(isUnique, data, (data) => {
                                // console.log('unique')
                                // console.log(data)
                                // console.log(data.animations)
                                // return;

                                sprites(isSprites, data, {
                                    algorithm: algorithm,
                                    spritesCount: spritesCount,
                                }, (data) => {
                                    // console.log('sprites')
                                    // console.log(data)
                                    // console.log(data.animations)
                                    // return;

                                    name(data, prefix, dest, (data) => {

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