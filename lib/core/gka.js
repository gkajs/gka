var path = require("path"),
    trim = require("./trim"),
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

    var isTrim       = opt.trim === undefined? false: opt.trim,
        isSprites   = opt.sprites === undefined? false: opt.sprites,
        isMini      = opt.mini === undefined? false: opt.mini,
        isInfo      = opt.info === undefined? true: (opt.info === "false"? false: true),

        // 带 -g unique 默认为 true,
        isUnique   = opt.unique === undefined? (opt.gen === undefined? false: true): opt.unique,

        // 带 -g 时，prefix 默认为 "gka-", 否则保留原名字
        prefix      = opt.prefix === undefined? "": (opt.prefix === true? "prefix-": opt.prefix),
        // prefix      = opt.prefix === undefined? (opt.gen === undefined && !isSprites? false: "gka-"): opt.prefix,

        // 带 -g 时，gen 默认为 px
        gen         = opt.gen === undefined? false: (typeof opt.gen === "string"? opt.gen: "px"),

        duration    = opt.duration || 0.04,
        algorithm   = opt.algorithm || "binary-tree";

    var t1 = gen + (isSprites? '_s': "") + (isTrim? '_t': ""),
        t2 = gen + (isTrim? '_t': "") + (isSprites? '_s': ""),
        t  = tpl[t1]? t1: (tpl[t2]? t2: ""),
        template  = tpl[t] || {};
  
    var dest    = path.join(dir, "..", path.basename(dir) + (isTrim? '-t': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (t? ('-'+ t): "") + (prefix? ('-'+ prefix): "") + "-gka");

    console.log()
    console.log("--------------------------")
    console.log('     [dir]: %j', (dir? dir: ""));
    console.log('     [trim]: %j', (isTrim? isTrim: ""));
    console.log(' [sprites]: %j', (isSprites? isSprites: ""));
    if (isSprites) {
        console.log('[algorithm]: %j', algorithm);
    }
    console.log('    [mini]: %j', (isMini? isMini: ""));
    console.log('    [info]: %j', (isInfo? isInfo: ""));
    console.log(' [unique]: %j', (isUnique? isUnique: ""));
    console.log('  [prefix]: %j', (prefix? prefix: ""));
    console.log('     [gen]: %j', (gen? gen: ""));
    if (gen) {
        console.log('  [template]: %j', t);
        console.log('[duration]: %j', duration);
    }

    console.log("--------------------------")
    console.log()

    if (gen && !t) {
        console.log('[error]: can not find template %j!', t1===t2? t1: t1 + "|" + t2);
        console.log()
        return;
    }

    var tmpDir = path.join(dir, "..", ".tmpGKAdir");
    
    // 获取需要操作的文件，得到对应的 src2id
    getFiles(dir, (src2id) => {
        // 去空
        trim(isTrim, tmpDir, src2id, (src2id, src2cutinfo) => {
            // 去重
            unique(isUnique, src2id, (src2id) => {
                var suffix = path.extname(Object.keys(src2id)[0]);

                // 生成系列数据
                x2x(src2id, suffix, dest, prefix, isSprites, (src2distid, src2src, srcs, dists, src2dist) => {
                    // 图片生成
                    images(isSprites, {
                        prefix: prefix,
                        src2dist: src2dist,
                        dists: dists,
                        srcs: srcs,
                        src2src: src2src,
                        algorithm: algorithm,
                        spritesFilepath: path.join(dest, "img", prefix + "gka_sprites" + suffix),
                        dest: dest,
                    }, (obj)=>{

                        deleteDir(tmpDir);

                        // setInfo("src2src.js", {src2src: src2src});
                        // setInfo("srcs.js", {srcs: srcs});
                        // isCut && setInfo("cut.js", {src2cutinfo: src2cutinfo, src2dist:src2dist})
                        // isSprites && setInfo("sprites.js", {sprites: obj.sprites});
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
                                names.push(infoRes.frames[f].file)
                            }
                            names = names.filter(function(element,index,self){
                                //indexOf只返回元素在数组中第一次出现的位置，如果与元素位置不一致，说明该元素在前面已经出现过，是重复元素
                                return self.indexOf(element) == index;     
                            })
                        }

                        setInfo("names.js", {names: names});

                        // mini images
                        isMini && mini(path.join(dest, "img"));

                        // generate css
                        template.css && template.css({
                            prefix: prefix,
                            frameDuration: duration,
                            info: infoRes,
                        }, (name, css) => {
                            writeFile(path.join(dest, name), css, () => {
                                console.log(` ✔ ${name} generated`);
                            });
                        });

                        // generate html
                        template.html && template.html({
                            prefix: prefix, 
                            names: JSON.stringify(names),
                        }, (name, html)=>{
                            writeFile(path.join(dest, name), html, () => {
                                console.log(` ✔ ${name} generated`);
                            });
                        });

                        // generate info
                        outputInfo(isInfo, dest);
                    });
                })
            });
        });
    });
}

module.exports = gka;
