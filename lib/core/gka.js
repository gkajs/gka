var path = require("path");
var tiny = require("./tiny");
var writeFile = require("./writeFile");
var getFiles = require("./getFiles");
var ridding = require("./ridding");
var x2x = require("./x2x");
var getInfo = require("./getInfo");
var gimage = require("./gimage");
var cut = require("./cut");
var gsprites = require("./gsprites");
var generator = require("./generator");

function getdists(ids, dest, prefix, suffix) {
    return ids.map(id => {
        return path.join(dest, prefix + id + suffix);
    });
}

function getsrc2dist(src2distid, dest, prefix, suffix) {
    var src2dist = {};
    for(var src in src2distid) {
        src2dist[src] = path.join(dest, prefix + src2distid[src] + suffix);
    }
    return src2dist;
}

function gka(params) {

    var dir = params["dir"],
        prefix = params["prefix"] || "gka-",
        type = params["generator"] || "normal",
        // type = 'sprites_percent'//params["type"] || "normal",
        frameDuration = params["frameDuration"] || 0.04,
        algorithm = params["algorithm"] || "binary-tree"; // https://github.com/twolfson/layout#algorithms

    var folder = path.basename(dir);
    var dest = path.join(dir, "..", folder + (type == "normal"? "-gka": "-gka-sprites"));

    var info = params["info"];
    var infoObj = {};

    console.log(params)
    var isShouldcut = false;

    // 获取需要操作的文件，得到对应的 src2id
    getFiles(dir, (src2id) => {
        
        // 判断是否需要裁剪图片
        cut(isShouldcut, src2id, (src2id, src2cutinfo) => {
            console.log("-----------");
            console.log(src2id);
            // console.log(src2cutinfo);
            // 去重
            ridding(src2id, (src2id) => {

                var xx = x2x(src2id);

                // 生成系列数据
                var src2distid = xx["src2distid"],
                    distids = xx["distids"],
                    src2src = xx["src2src"],
                    srcs = xx["srcs"];

                infoObj["src2src.js"] = getInfo("src2src.js", {src2src: src2src});
                infoObj["srcs.js"] = getInfo("srcs.js", {srcs: srcs});

                var suffix = path.extname(srcs[0]);

                var dists = getdists(distids, path.join(dest, "img"), prefix, suffix),
                    src2dist = getsrc2dist(src2distid, path.join(dest, "img"), prefix, suffix),
                    src2distrelative = getsrc2dist(src2distid, "img", prefix, suffix);
              
                var distsName = [];

                function gimages(type, callback) {

                    if (type === "normal") {
                        distsName = getdists(distids, "", prefix, suffix);

                        // 普通模式 生成图片
                        // images generated
                        gimage(dists, src2dist, () => {
                            // tiny images
                            // tiny(path.join(dest, "img"));
                        });

                        callback({});
                    } else if (type === "sprites") {
                        distsName = [`${prefix}sprites${suffix}`];

                        var spritesFilepath = path.join(dest, "img", prefix + "sprites" + suffix);

                        // 生成合图, 返回坐标数据
                        gsprites(srcs, spritesFilepath, algorithm, (r) => {
                            // tiny image
                            // tiny(path.join(dest, "img"));
                            
                            infoObj["sprites.js"] = getInfo("sprites.js", {coordinates: r.coordinates});
                            infoObj["spritesIndex.js"] = getInfo("spritesIndex.js", {coordinates: r.coordinates, src2distid: src2distid});

                            callback({
                                r: r
                            });
                        });
                    } 

                    // else if (type === "cut") {
                    //     distsName = getdists(distids, "", prefix, suffix);

                    //     // 普通模式 生成图片
                    //     // images generated
                    //     cut(dists, src2dist, (dist2info) => {
                    //         // tiny images
                    //         // tiny(path.join(dest, "img"));
                    //         callback({
                    //             dist2info: dist2info
                    //         });
                    //     });

                    // }

                    infoObj["distsName.js"] = getInfo("distsName.js", {distsName: distsName});
                }

                // generate image
                gimages(generator[type].config.type, (obj)=>{

                    // generate css
                    generator[type].css({
                        frameDuration: frameDuration,
                        src2dist: src2dist,
                        src2distrelative: src2distrelative,
                        prefix: prefix,
                        src2src: src2src,
                        sprites_path: `./img/${prefix}sprites${suffix}`,
                        r: obj.r,
                        dist2info: obj.dist2info,
                        src2cutinfo: src2cutinfo,
                    }, (name, css) => {
                        console.log(dest, name)
                        // generate gka.css
                        writeFile(path.join(dest, name), css, () => {
                            console.log(` ✔ ${name} generated`);
                        });
                    });

                    // generate html
                    generator[type].html({
                        prefix: prefix, 
                        distsName: JSON.stringify(distsName)
                    }, (name, html)=>{
                        writeFile(path.join(dest, name), html, () => {
                            console.log(` ✔ ${name} generated`);
                        });
                    });

                    finish();
                });

                function finish() {
                    if (info) {
                        for(var key in infoObj) {
                            ((key)=>{
                                writeFile(path.join(dest, "__info", key), infoObj[key], () => {
                                    console.log(` ✔ __info ${key} generated`);
                                })
                            })(key)
                        }
                    }
                }

            });
        });
        
    });
}

module.exports = gka;
