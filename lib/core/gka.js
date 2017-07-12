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
var gcss_sprites_percent = require("./gcss_sprites_percent");

var getInfo = require("./getInfo");

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
        type = params["type"] || "normal",
        frameDuration = params["frameDuration"] || 0.04;

    // 合图布局，见https://github.com/twolfson/layout#algorithms
    var algorithm = params["algorithm"] || "binary-tree";

    var info = params["info"];
    var infoObj = {};

    var htmlDom = "";

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

            infoObj["src2src.js"] = `/* 原文件与指向文件的关系
* 
* 当序列帧中存在相同图片，指向将指为同一个，进行复用
*/

`
            infoObj["src2src.js"] += "var src2src = " + JSON.stringify(src2src, null, '    ');


            infoObj["srcs.js"] = `/* 最终处理的图片
* 
* 去除了相同的图片话，剩余需处理的图片
*/

`
            infoObj["srcs.js"] += "var srcs = " + JSON.stringify(srcs, null, '    ');

            var suffix = path.extname(srcs[0]);

            var dists = getdists(distids, path.join(dest, "img"), prefix, suffix);
            var src2dist = getsrc2dist(src2distid, path.join(dest, "img"), prefix, suffix);
            var src2distrelative = getsrc2dist(src2distid, "img", prefix, suffix);


            infoObj["distsName.js"] = `/* 最终生成的图片名数组
* 
* 可用于图片预加载
*/

`            
            
            var distsName = [];
            if (type == "normal") {

                distsName = getdists(distids, "", prefix, suffix);

                // 普通模式 生成图片
                gimage(dists, src2dist, () => {
                    // images generated
                    // tiny images
                    tiny(path.join(dest, "img"));
                });

                // 生成 css
                gcss(frameDuration, src2distrelative, prefix, css => {
                    // generate gka.css
                    writeFile(path.join(dest, `${prefix}gka.css`), css, () => {
                        console.log(' ✔ gka.css generated');
                    });
                });

                finish();
            } else if (type == "sprites") {

                distsName = [`${prefix}sprites${suffix}`];

                var spritesFilepath = path.join(dest, "img", prefix + "sprites" + suffix);
                // 生成合图, 返回坐标数据
                gsprites(srcs, spritesFilepath, algorithm, (r) => {
                    
                    // tiny images
                    tiny(path.join(dest, "img"));
                    // 根据坐标数据，生成css
                    gcss_sprites(frameDuration, r.coordinates, src2src, `./img/${prefix}sprites${suffix}`, prefix, (css)=>{

                        // generate gka.css
                        writeFile(path.join(dest, `${prefix}gka.css`), css, () => {
                            console.log(' ✔ gka.css generated');
                        });
   
                    });


                    htmlDom =  `<div style="width:300px; display:inline-block;"><div id="gka" class="gka-base"></div></div>`;

                    // 根据坐标数据，生成css
                    gcss_sprites_percent(frameDuration, r.coordinates, r.properties, src2src, `./img/${prefix}sprites${suffix}`, prefix, (css)=>{

                        // generate gka.css
                        writeFile(path.join(dest, `${prefix}gka_percent.css`), css, () => {
                            console.log(' ✔ gka_percent.css generated');
                        });
   
                    });

                    infoObj["sprites.js"] = `/* 合图信息
* 
*/

`
                    infoObj["sprites.js"] += "var sprites = " + JSON.stringify(r.coordinates, null, '    ');

                    infoObj["spritesIndex.js"] = `/* 合图没有按顺序排列，顺序播放需要找到对应的位置序列
* 
* 合图中以单张图片的宽高为基准，从左到右，从上到下排序
* 得到序列 A (如: [1,2,3,4,5])

* 根据序列A中的对应位置，得出顺序播放(文件名顺序)的序列
* (如: [1,3,2,4,5])
*/

`
                    infoObj["spritesIndex.js"] += "var spritesIndex = " + JSON.stringify(getInfo.getSpritesIndex(r.coordinates, src2distid));
                    
                    finish();
                });
            }

           

            function finish() {
                infoObj["distsName.js"] += "var distsName = " + JSON.stringify(distsName);
                
                // 生成 html
                ghtml(dest, prefix, JSON.stringify(distsName), (html)=>{
                    writeFile(path.join(dest, "gka.html"), html, () => {
                        console.log(' ✔ gka.html generated');
                    });
                });

                // gka_percent
                if (htmlDom) {
                    ghtml(dest, prefix, JSON.stringify(distsName), (html)=>{
                        writeFile(path.join(dest, "gka_percent.html"), html, () => {
                            console.log(' ✔ gka_percent.html generated');
                        });
                    }, htmlDom, "_percent");
                }

                if (info) {
                    for(var key in infoObj) {
                        ((key)=>{
                            writeFile(path.join(dest, "__info", key), infoObj[key], () => {
                                console.log(` ✔ __info ${key} generated`);
                            })
                        })(key)
                        ;
                    }
                }
            }

        });
    });
}

module.exports = gka;
