/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

var path = require("path"),
    crop = require("./crop"),
    unique = require("./unique"),
    x2x = require("./x2x"),
    images = require("./images"),
    mini = require("./mini"),
    tpl = require("./tpl"),
    info = require("./info"),
    setInfo = info.setInfo, outputInfo = info.outputInfo,
    file = require("./file"), 
    getFiles = file.getFiles,writeFile = file.writeFile,deleteDir = file.deleteDir;

function gka(dir, opt) {
    if (!dir) {
        console.log("[error]: gka need a dir !");
        return;
    }

    var isCrop     = opt.crop || false,
        isSprites  = opt.sprites || false,
        isMini     = opt.mini || false,
        isInfo     = opt.info || false,

        // unique 默认为 true,
        isUnique   = opt.unique === "false"? false: true,

        // -p 默认为 "gka-", 否则保留原名字
        prefix     = opt.prefix === undefined? "": (opt.prefix === true? "prefix-": opt.prefix),

        // tpl 默认为 px
        tplOpt     = opt.tpl === "false"? "" :(typeof opt.tpl === "string"? opt.tpl: "px"),

        frameduration = opt.frameduration || 0.04,
        // fps    = opt.fps || 25,  // 1 / 25 = 0.04s 每帧时长

        algorithm  = opt.algorithm || "binary-tree";

    var t1 = tplOpt + (isSprites? '_s': "") + (isCrop? '_c': ""),
        t2 = tplOpt + (isCrop? '_c': "") + (isSprites? '_s': ""),
        t  = tpl[t1]? t1: (tpl[t2]? t2: ""),
        template  = tpl[t] || {};
  
    var dest = path.join(dir, "..", path.basename(dir) + (isCrop? '-c': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (t? ('-'+ t): "") + (prefix? ('-'+ prefix): "") + "-gka");

    console.log();
    console.log("---------------------------------------------------------------");
    console.log('           [dir]: %j', (dir? dir: ""));
    console.log('          [crop]: %j', (isCrop? isCrop: ""));
    console.log('       [sprites]: %j', (isSprites? isSprites: ""));
    if (isSprites) {
    console.log('     [algorithm]: %j', algorithm);
    }
    console.log('          [mini]: %j', (isMini? isMini: ""));
    console.log('          [info]: %j', (isInfo? isInfo: ""));
    console.log('        [unique]: %j', (isUnique? isUnique: ""));
    console.log('        [prefix]: %j', (prefix? prefix: ""));
    console.log('        [tplOpt]: %j', (tplOpt? tplOpt: ""));
    if (tplOpt) {
    console.log('      [template]: %j', t);
    console.log(' [frameDuration]: %j', frameduration);
    }
    console.log("---------------------------------------------------------------");
    console.log();

    if (tplOpt && !t) {
        console.log('[error]: can not find template %j!', t1===t2? t1: t1 + "|" + t2);
        console.log();
        return;
    }

    var tmpDir = path.join(dir, "..", ".tmpGKAdir");
    
    getFiles(dir, (src2id) => {
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
                        spritesFilepath: path.join(dest, "img", prefix + "gka_sprites" + suffix),
                    }, (obj)=>{

                        deleteDir(tmpDir);

                        isSprites && setInfo("spritesIndex.js", {coordinates: obj.r.coordinates, src2distid: src2distid});
                        
                        var infoRes = setInfo("info.js", {
                                            sprites: obj.sprites, 
                                            src2cutinfo: src2cutinfo, 
                                            src2dist: src2dist
                                        });

                        var names = [];

                        if (infoRes.file) {
                            names.push(infoRes.file);
                        } else {
                            for(var f in infoRes.frames) {
                                names.push(infoRes.frames[f].file);
                            }
                            names = names.filter(function(element,index,self){
                                return self.indexOf(element) == index;     
                            });
                        }

                        setInfo("names.js", {names: names});

                        // mini images
                        isMini && mini(path.join(dest, "img"));

                        // output css
                        template.css && template.css({
                            prefix: prefix,
                            frameDuration: frameduration,
                            info: infoRes,
                        }, (name, css) => {
                            writeFile(path.join(dest, name), css, () => {
                                console.log(` ✔ ${name} generated`);
                            });
                        });

                        // output html
                        template.html && template.html({
                            prefix: prefix, 
                            names: JSON.stringify(names),
                        }, (name, html)=>{
                            writeFile(path.join(dest, name), html, () => {
                                console.log(` ✔ ${name} generated`);
                            });
                        });

                        // output info
                        outputInfo(isInfo, dest);
                    });
                });
            });
        });
    });
}

module.exports = gka;
