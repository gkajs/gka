/**
 * output info file
 */

var writeFile = require("./file").writeFile;
var path = require("path");
var sizeOf = require('image-size');

// 合图没有按顺序排列，顺序播放需要找到对应的位置序列
function getSpritesIndex(coordinates, src2distid) {

    // 合图信息按原图片顺序排列
    var res = [], id, i;
    for(var key in coordinates){
        id = src2distid[key],
        i = id - 1;
        res[i] = coordinates[key];
    }

    var xy = [],x = [],y = [],item = {};
    for (var i = 0; i < res.length; i++) {
        item = res[i];
        var xsize = item.x / item.width,
            ysize = item.y / item.height

        x.push(xsize);
        y.push(ysize);

        xy.push({
            x: xsize,
            y: ysize,
        })
    }

    var xm = Math.max(...x),
        ym = Math.max(...y);

    // 原图片顺序排列时，对应合图的位置队列
    var res2 = xy.map((item)=>{
        return item.x + item.y * (xm + 1);
    })

    var res3 = [], id3, index3;

    // id：[1,2,3,4,5] -> 合图位置列表：[20,30,70,90,100]
    // index：[0,1,2,3,4] -> 合图位置列表：[20,30,70,90,100]
    // 当有图片复用,返回对于列表
    for(var key2 in src2distid) {
        id3 = src2distid[key2],
        index3 = id3 - 1;
        res3.push(res2[index3]);
    }

    return res3;
}

/* 合图没有按顺序排列，顺序播放需要找到对应的位置序列
* 
* 合图中以单张图片的宽高为基准，从左到右，从上到下排序
* 得到序列 A (如: [1,2,3,4,5])

* 根据序列A中的对应位置，得出顺序播放(文件名顺序)的序列
* (如: [1,3,2,4,5])
*/
function spritesIndex(obj) {
    return JSON.stringify({
        spritesIndex: getSpritesIndex(obj.coordinates, obj.src2distid)
    });
}

function all(obj) {
    var src2cutinfo = obj.src2cutinfo,
        sprites = obj.sprites,
        src2dist = obj.src2dist;

    var res = {};
    // var frames = {};
    // 对象无序，数组有序
    var frames = [];

    for(var src in src2dist) {
        var cutInfo = src2cutinfo && src2cutinfo[src] || {};
        var spritesInfo = sprites && sprites.frames[path.basename(src)] || {};

        frames.push({
            "name": path.basename(src),
            "file": path.basename(src2dist[src]), // 当前图片名
            "x": spritesInfo.x,        // 当前图片坐标
            "y": spritesInfo.y,
            "offX": cutInfo.offX,    // 当前图片相对于原图片的偏移，不 cut 时为 0，0 则省略
            "offY": cutInfo.offY,
            "width": cutInfo.w || sizeOf(src).width,  // 当前图片宽度
            "height": cutInfo.h || sizeOf(src).height,
            "sourceW": cutInfo.sourceW, // 原图片宽高，不 cut 时等于当前图片宽高 则省略
            "sourceH": cutInfo.sourceH
        });
        // frames[path.basename(src)] = {
        //     "file": path.basename(src2dist[src]), // 当前图片名
        //     "x": spritesInfo.x,        // 当前图片坐标
        //     "y": spritesInfo.y,
        //     "offX": cutInfo.offX,    // 当前图片相对于原图片的偏移，不 cut 时为 0，0 则省略
        //     "offY": cutInfo.offY,
        //     "width": cutInfo.w || sizeOf(src).width,  // 当前图片宽度
        //     "height": cutInfo.h || sizeOf(src).height,
        //     "sourceW": cutInfo.sourceW, // 原图片宽高，不 cut 时等于当前图片宽高 则省略
        //     "sourceH": cutInfo.sourceH
        // }
    }

    res["file"] = sprites && sprites.file;
    res["w"] = sprites && sprites.w;
    res["h"] = sprites && sprites.h;
    res["frames"] = frames;

    return res;
}


var infoObj = {};

function setInfo(name, obj) {
    switch (name) {
        case "spritesIndex.json" : 
            infoObj[name] = spritesIndex(obj);
            return;
        break;
        case "names.json" : 
            infoObj[name] = JSON.stringify({
                names: obj.names
            });
            return;
        break;
        case "info.json" : 
            var res = all(obj);
            infoObj[name] = JSON.stringify(res, null, '    ');
            return res;
        break;
        default:
            infoObj[name] = obj;
    }
}

// 信息文件输出
function outputInfo (isInfo, dest) {
    if (isInfo) {
        for(var key in infoObj) {
            ((key)=>{
                if (key === "sprites.js" || key === "cut.js") {};
                writeFile(path.join(dest, "__info", key), infoObj[key], () => {
                    console.log(` ✔ __info ${key} generated`);
                })
            })(key)
        }
    }
}

module.exports = {
    setInfo: setInfo,
    outputInfo: outputInfo,
};

