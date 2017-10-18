/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * output info file
 */

var path      = require("path"),
    sizeOf    = require('image-size');

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

function getData(obj) {
    var src2cutinfo = obj.src2cutinfo || {},
        sprites = obj.sprites || {},
        src2dist = obj.src2dist || {},
        res = {},
        frames = [];

    for(var src in src2dist) {
        var cutInfo = src2cutinfo[src] || {};
        var spritesInfo = sprites.frames && sprites.frames[path.basename(src)] || {};

        frames.push({
            "name": path.basename(src),
            "file": spritesInfo.file || sprites.file || path.basename(src2dist[src]), // 当前图片名
            "x": spritesInfo.x,        // 当前图片坐标
            "y": spritesInfo.y,
            "offX": cutInfo.offX,    // 当前图片相对于原图片的偏移，不 cut 时为 0，0 则省略
            "offY": cutInfo.offY,
            "width": cutInfo.w || sizeOf(src).width,  // 当前图片宽度
            "height": cutInfo.h || sizeOf(src).height,
            "sourceW": cutInfo.sourceW, // 原图片宽高，不 cut 时等于当前图片宽高 则省略
            "sourceH": cutInfo.sourceH,
            "w": spritesInfo.w,
            "h": spritesInfo.h,
        });
    }

    res["frames"] = frames;

    return res;
}

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
    return getSpritesIndex(obj.coordinates, obj.src2distid);
}

module.exports = {
    getData: getData,
    getNames: getNames,
};