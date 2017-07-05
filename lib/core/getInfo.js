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

module.exports = {
    getSpritesIndex: getSpritesIndex
};
