var writeFile = require("./writeFile");
var path = require("path");

// util

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

// info 
function sprites(obj) {
var text = 
`/* 合图信息
* 
*/

var sprites = ${JSON.stringify(obj.coordinates, null, '    ')}
`;
return text;
}

function spritesIndex(obj) {
var text = 
`/* 合图没有按顺序排列，顺序播放需要找到对应的位置序列
* 
* 合图中以单张图片的宽高为基准，从左到右，从上到下排序
* 得到序列 A (如: [1,2,3,4,5])

* 根据序列A中的对应位置，得出顺序播放(文件名顺序)的序列
* (如: [1,3,2,4,5])
*/

var spritesIndex = ${JSON.stringify(getSpritesIndex(obj.coordinates, obj.src2distid))}
`

return text;
}

function srcs(obj) {
var text = 
`/* 最终处理的图片
* 
* 去除了相同的图片话，剩余需处理的图片
*/

var srcs = ${JSON.stringify(obj.srcs, null, '    ')}
`;
return text;
}

function src2src(obj) {
var text = 
`/* 原文件与指向文件的关系
* 
* 当序列帧中存在相同图片，指向将指为同一个，进行复用
*/

var src2src = ${JSON.stringify(obj.src2src, null, '    ')}
`;
return text;
}


function distsName(obj) {
var text = 
`/* 最终生成的图片名数组
* 
* 可用于图片预加载
*/

var distsName = ${JSON.stringify(obj.distsName)}
`;
return text;
}


var infoObj = {};

function setInfo(name, obj) {
    switch (name) {
        case "sprites.js" : 
            infoObj[name] = sprites(obj);
            return;
        break;
        case "spritesIndex.js" : 
            infoObj[name] = spritesIndex(obj);
            return;
        break;
        case "distsName.js" : 
            infoObj[name] = distsName(obj);
            return distsName(obj);
        break;
        case "src2src.js" : 
            infoObj[name] = src2src(obj);
            return;
        break;
        case "srcs.js" : 
            infoObj[name] = srcs(obj);
            return;
        break;
    }
}

// 信息文件输出
function outputInfo (isInfo, dest) {
    if (isInfo) {
        for(var key in infoObj) {
            ((key)=>{
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

