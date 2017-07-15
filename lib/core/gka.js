var path = require("path"),
    getFiles = require("./getFiles"),
    writeFile = require("./writeFile"),
    cut = require("./cut"),
    ridding = require("./ridding"),
    x2x = require("./x2x"),
    images = require("./images"),
    tiny = require("./tiny"),
    generator = require("./generator"),
    info = require("./info"),
    setInfo = info.setInfo, outputInfo = info.outputInfo;

function gka(dir, opt) {

    if (!dir) {
        console.log("[error]: gka need a dir !");
        return;
    }

    var isCut       = opt.cut === undefined? false: (opt.cut === "false"? false: true),
        isSprites   = opt.sprites === undefined? false: (opt.sprites === "false"? false: true),
        isTiny      = opt.tiny === undefined? false: (opt.tiny === "false"? false: true),
        isInfo      = opt.info === undefined? true: (opt.info === "false"? false: true),

        // 带 -g 时，ridding 默认为 true,
        isRidding   = opt.ridding === undefined? (opt.gen === undefined? false: true): opt.ridding,

        // 带 -g 时，prefix 默认为 "gka-", 否则保留原名字
        prefix      = opt.prefix === undefined? "": (opt.prefix === true? "prefix-": opt.prefix),
        // prefix      = opt.prefix === undefined? (opt.gen === undefined && !isSprites? false: "gka-"): opt.prefix,

        // 带 -g 时，gen 默认为 px
        gen         = opt.gen === undefined? false: (typeof opt.gen === "string"? opt.gen: "px"),

        duration    = opt.duration || 0.04,
        algorithm   = opt.algorithm || "binary-tree";

    // var dest = path.join(dir, "..", path.basename(dir) + (type == "normal"? "-gka": "-gka-sprites"));
    var dest    = path.join(dir, "..", path.basename(dir) + "-gka");

    var t1 = gen + (isSprites? '_s': "") + (isCut? '_c': ""),
        t2 = gen + (isCut? '_c': "") + (isSprites? '_s': ""),
        t  = generator[t1]? t1: (generator[t2]? t2: ""),
        engine  = generator[t] || {};

    console.log()
    console.log("--------------------------")
    console.log('     [dir]: %j', (dir? dir: ""));
    console.log('     [cut]: %j', (isCut? isCut: ""));
    console.log(' [sprites]: %j', (isSprites? isSprites: ""));
    if (isSprites) {
        console.log('[algorithm]: %j', algorithm);
    }
    console.log('    [tiny]: %j', (isTiny? isTiny: ""));
    console.log('    [info]: %j', (isInfo? isInfo: ""));
    console.log(' [ridding]: %j', (isRidding? isRidding: ""));
    console.log('  [prefix]: %j', (prefix? prefix: ""));
    console.log('     [gen]: %j', (gen? gen: ""));
    if (gen) {
        console.log('  [engine]: %j', t);
        console.log('[duration]: %j', duration);
    }

    console.log("--------------------------")
    console.log()

    if (gen && !t) {
        console.log('[error]: gen %j can not find engine!', t1===t2? t1: t1 + "|" + t2);
        console.log()
        return;
    }

    // 获取需要操作的文件，得到对应的 src2id
    getFiles(dir, (src2id) => {
        // 去空
        cut(isCut, src2id, (src2id, src2cutinfo) => {
            // console.log("---cut---", src2id, src2cutinfo);
            // 去重
            ridding(isRidding, src2id, (src2id) => {
                // console.log("---ridding---", src2id);
                var suffix = path.extname(Object.keys(src2id)[0]);

                // 生成系列数据
                x2x(src2id, suffix, dest, prefix, isSprites, (src2distid, distids, src2src, srcs, dists, src2dist, src2distrelative, distsName) => {
                    setInfo("src2src.js", {src2src: src2src});
                    setInfo("srcs.js", {srcs: srcs});
                    setInfo("distsName.js", {distsName: distsName});
                  
                    // 图片生成
                    images(isSprites, {
                        prefix: prefix,
                        suffix: suffix,
                        src2dist: src2dist,
                        dists: dists,
                        srcs: srcs,
                        algorithm: algorithm,
                        dest: dest,
                    }, (obj)=>{
                        obj.r && setInfo("sprites.js", {coordinates: obj.r.coordinates});
                        obj.r && setInfo("spritesIndex.js", {coordinates: obj.r.coordinates, src2distid: src2distid});

                        // tiny images
                        isTiny && tiny(path.join(dest, "img"));

                        // generate css
                        engine.css && engine.css({
                            frameDuration: duration,
                            src2dist: src2dist,
                            src2distrelative: src2distrelative,
                            prefix: prefix,
                            src2src: src2src,
                            sprites_path: `./img/${prefix}gka_sprites${suffix}`,
                            r: obj.r,
                            src2cutinfo: src2cutinfo,
                        }, (name, css) => {
                            writeFile(path.join(dest, name), css, () => {
                                console.log(` ✔ ${name} generated`);
                            });
                        });

                        // generate html
                        engine.html && engine.html({
                            prefix: prefix, 
                            distsName: JSON.stringify(distsName)
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
