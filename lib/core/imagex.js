/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

var path       = require("path"),
    crop       = require("./crop"),
    unique     = require("./unique"),
    x2x        = require("./x2x"),
    images     = require("./images"),
    mini       = require("./mini"),
    info       = require("./info"),
    file       = require("./file"), 
    setInfo    = info.setInfo,
    outputInfo = info.outputInfo,
    getFiles   = file.getFiles,
    writeFile  = file.writeFile,
    deleteDir  = file.deleteDir;

function getNames(data) {
	var names = [];
    if (data.file) {
        names.push(data.file);
    } else {
        for(var f in data.frames) {
            names.push(data.frames[f].file);
        }
        names = names.filter(function(element,index,self){
            return self.indexOf(element) == index;     
        });
    }
    return names;
}

module.exports = function imagex(opt, callback) {

	var src       = opt.src,
		dest      = opt.dest,
		prefix    = opt.prefix,
		isCrop    = opt.isCrop,
		isUnique  = opt.isUnique,
		isSprites = opt.isSprites,
		algorithm = opt.algorithm,
        isInfo    = opt.isInfo,
		isInfo    = opt.isInfo,
		isMini    = opt.isMini;

	var tmpDir    = path.join(src, "..", ".tmpGKAdir");
    
    getFiles(src, (src2id) => {

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
                    }, (obj)=>{

                        deleteDir(tmpDir);

                        // mini images
                        isMini && mini(dest);

                        var data = setInfo("data.json", {
                                        sprites: obj.sprites, 
                                        src2cutinfo: src2cutinfo, 
                                        src2dist: src2dist
                                    });

                        // names 最终生成的图片名数组
                        setInfo("names.json", getNames(data));

                        outputInfo(isInfo, dest);

                        callback && callback(data, {
                        	getNames: getNames,
                        });
                        
                    });
                });
            });
        });
    });
}