var path = require("path");

var tiny = require("./tiny");
var writeFile = require("./writeFile");

var getfiles = require("./getfiles");
var ridding = require("./ridding");
var x2x = require("./x2x");

var gimage = require("./gimage");
var gcss = require("./gcss");
var ghtml = require("./ghtml");
var gsprites = require("./gsprites");
var gcss_sprites = require("./gcss_sprites");

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
        type = params["type"] || "normal";

    var folder = path.basename(dir);
    var dest = path.join(dir, "..", folder + (type == "normal"? "-gka": "-gka-sprites"));

    // 获取需要操作的文件，得到对应的 src2id
    getfiles(dir, (src2id) => {
        
        // 去重
        ridding(src2id, (src2id) => {

            var xx = x2x(src2id);

            // 生成系列数据
            var src2distid = xx["src2distid"],
                distids = xx["distids"],
                src2src = xx["src2src"],
                srcs = xx["srcs"];

            var suffix = path.extname(srcs[0]);

            var dists = getdists(distids, path.join(dest, "img"), prefix, suffix);
            var src2dist = getsrc2dist(src2distid, path.join(dest, "img"), prefix, suffix);
            var src2distrelative = getsrc2dist(src2distid, "img", prefix, suffix);

            if (type == "normal") {
                // 普通模式 生成图片
                gimage(dists, src2dist, () => {
                    // images generated
                    // tiny images
                    tiny(path.join(dest, "img"));
                });

                // 生成 css
                gcss(src2distrelative, (css) => {
                    // generate gka.css
                    writeFile(path.join(dest, "gka.css"), css, () => {
                        console.log(' ✔ gka.css generated');
                    });
                });

            } else if (type == "sprites") {

                var spritesFilepath = path.join(dest, prefix + "sprites" + suffix);
                // 生成合图, 返回坐标数据
                gsprites(srcs, spritesFilepath, (r) => {

                    // tiny images
                    tiny(dest);
                    
                    // 根据坐标数据，生成css
                    gcss_sprites(r.coordinates, src2src, `./${prefix}sprites${suffix}`, (css)=>{

                        // generate gka.css
                        writeFile(path.join(dest, "gka.css"), css, () => {
                            console.log(' ✔ gka.css generated');
                        });
   
                    });

                });
            }

            // 生成 html
            ghtml(dest, (html)=>{
                writeFile(path.join(dest, "gka.html"), html, () => {
                    console.log(' ✔ gka.html generated');
                });
            });
        });
    });
}

module.exports = gka;
