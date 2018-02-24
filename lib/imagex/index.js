/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 */

var path       = require("path"),
    flattening = require("./flattening"),
    color      = require("./color"),
    diff       = require("./diff"),
    split      = require("./split"),
    crop       = require("./crop"),
    unique     = require("./unique"),
    x2x        = require("./x2x"),
    images     = require("./images"),
    mini       = require("./mini"),
    file       = require("./file"), 
    info       = require("./info"), 
    getTmpDir  = file.getTmpDir,
    writeFile  = file.writeFile,
    getFiles   = file.getFiles,
    deleteDir  = file.deleteDir;

var getData  = info.getData,
    getNames = info.getNames;

module.exports = function imagex(opt, callback) {
    var src       = opt.dir,
        dest      = opt.imgOutput ||  opt.output,
        prefix    = opt.prefix,
        bgColor   = opt.color,
        isSplit   = opt.split,
        isDiff    = opt.diff,
        isCrop    = opt.crop,
        isUnique  = opt.unique,
        isSprites = opt.sprites,
        spritesCount = opt.spritesCount || opt.count,
        algorithm = opt.algorithm,
        isMini    = opt.mini,
        isInfo    = opt.info,
        isReplace = opt.replace;

    var tmpDir    = getTmpDir();
    
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

    getFiles(src, (src2id, keyMap) => {

        if(JSON.stringify(src2id) == "{}"){
            console.log('[error]: Can not find images');
            return;
        }

        flattening(tmpDir, src2id, keyMap, (src2id, keyMap) => {

            split(isSplit, tmpDir, src2id, (src2id, src2splitInfo) => {
                
                color(bgColor, tmpDir, src2id, (src2id) => {
    
                    diff(isDiff, tmpDir, src2id, (src2id) => {
    
                        crop(isCrop, tmpDir, src2id, (src2id, src2cutinfo) => {
    
                            unique(isUnique, src2id, (src2id) => {
    
                                var suffix = path.extname(Object.keys(src2id)[0]);
    
                                x2x(src2id, suffix, dest, prefix, isSprites, (src2distid, src2src, srcs, dists, src2dist) => {
                                    
                                    // output images
                                    images(isSprites, {
                                        src2dist: src2dist,
                                        dists: dists,
                                        srcs: srcs,
                                        src2src: src2src,
                                        algorithm: algorithm,
                                        spritesFilepath: path.join(dest, (prefix? (prefix + "-"): "") + "sprites" + suffix),
                                        spritesCount: spritesCount,
                                    }, (obj)=>{
    
                                        isMini && mini(dest);
    
                                        var data = getData({
                                            sprites: obj.sprites, 
                                            src2cutinfo: src2cutinfo, 
                                            src2dist: src2dist,
                                            src2splitInfo: src2splitInfo,
                                        });
                                        
                                        data['keyMap'] = keyMap;
    
                                        isInfo && writeFile(path.join(dest, "__info", "data.json"), JSON.stringify(data, null, '    '), () => {
                                            // console.log(` ✔ images __info data.json generated`);
                                        })
    
                                        callback && callback(data, {
                                            getNames: getNames,
                                        });
                                        
                                        deleteDir(tmpDir);
    
                                    });
                                });
                            });
                        });
                    })
                })
            })
        })
    });
}