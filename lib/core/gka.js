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
    tplMap = require("./tpl"),
    info = require("./info"),
    setInfo = info.setInfo, outputInfo = info.outputInfo,
    file = require("./file"), 
    getFiles = file.getFiles,writeFile = file.writeFile,deleteDir = file.deleteDir;

function gka(dir, opt) {
    
    if (!dir) {
        console.log("[error]: gka need a dir !");
        return;
    }
    var cmd = opt.cmd;

    if (cmd === "tool") {
        // 压缩源图片
        if (opt.replace && opt.mini) {
            mini(dir);
            return;
        }
    } else {
        // 兼容提示
        if (opt.crop) {
            console.log();
            console.log('[error]: please replace "-c" with "-t c" ');
            console.log();
            return;
        }
        if (opt.sprites) {
            console.log();
            console.log('[error]: please replace "-s" with "-t s" ');
            console.log();
            return;
        }
    }

    var isCrop     = opt.crop || false,
        isSprites  = opt.sprites || false,
        isMini     = opt.mini || false,
        isInfo     = opt.info || false,

        // unique 默认为 true,
        isUnique   = opt.unique || false,

        // -p 默认为 "gka-", 否则保留原名字
        prefix     = opt.prefix === undefined? "": (opt.prefix === true? "prefix-": opt.prefix),

        // 带 tpl，则默认为 n
        template   = opt.tpl && (opt.tpl),

        frameduration = opt.frameduration || 0.04,
        // fps    = opt.fps || 25,  // 1 / 25 = 0.04s 每帧时长

        algorithm  = opt.algorithm || "binary-tree";

    var tpl = tplMap['gka-tpl-' + template] ;
    var cfg = tpl && tpl.config || {};

    // template config 覆盖参数
    isCrop    = cfg.crop !== undefined? cfg.crop: isCrop;
    isSprites = cfg.sprites !== undefined? cfg.sprites: isSprites;

    // opt 优先
    algorithm = opt.algorithm !== undefined? algorithm: cfg.algorithm;
    isUnique  = opt.unique !== undefined? isUnique: cfg.unique;

    var dest = path.join(dir, "..", "gka-" + path.basename(dir) + (isCrop? '-c': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (template? ('-'+ template): "") + (prefix? ('-'+ prefix): ""));

    if (template && !tpl) {
        console.log();
        console.log('[error]: can not find template %j!', template);
        console.log();
        return;
    }

    console.log();
    console.log("GKA------------------------------------------------------------");
    console.log('           [dir]: %j', dir);
    isCrop && console.log('          [crop]: true');
    isSprites && console.log('       [sprites]: true');
    if (isSprites) {
    console.log('     [algorithm]: %j', algorithm);
    }
    isMini && console.log('          [mini]: true');
    isInfo && console.log('          [info]: true');
    isUnique && console.log('        [unique]: true');
    prefix && console.log('        [prefix]: %j', prefix);
    if (tpl) {
    console.log('      [template]: %j', template);
    console.log(' [frameDuration]: %j', frameduration);
    }
    console.log();
    console.log();
    console.log('[output dir]: %j', dest);
    console.log("---------------------------------------------------------------");
    console.log();

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

                        isSprites && setInfo("spritesIndex.json", {coordinates: obj.r.coordinates, src2distid: src2distid});
                        
                        var infoRes = setInfo("info.json", {
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

                        // names 最终生成的图片名数组
                        setInfo("names.json", {names: names});

                        // mini images
                        isMini && mini(path.join(dest, "img"));

                        // output css
                        tpl && tpl.css && tpl.css({
                            prefix: prefix,
                            frameDuration: frameduration,
                            info: infoRes,
                        }, (name, css) => {
                            writeFile(path.join(dest, name), css, () => {
                                console.log(` ✔ ${name} generated`);
                            });
                        });

                        // output html
                        tpl && tpl.html && tpl.html({
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
