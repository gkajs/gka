/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * sprites
 */

var fs          = require("fs"),
    path        = require('path'),
    mkdirp      = require('mkdirp'),
    Spritesmith = require('spritesmith');

// sprites
// 生成合图, 返回坐标数据
function gsprites(srcs, filepath, algorithm, callback) {
    Spritesmith.run({
        src: srcs,
        algorithm: algorithm,
    }, function(err, r) {
        mkdirp(path.dirname(filepath), function (err) {
            fs.writeFileSync(filepath, r.image);
            console.log(' ✔ sprites done');
            console.log(' ✔ ' + path.basename(filepath) +' generated');

            callback && callback(r, filepath);
        });
    });
}

// 获取所有输出的文件路径，并去重
function getFiles(data) {
    var srcs = data.frames.map(item => {
        return item['src'];
    });
    return srcs.filter((item, index, self) => {
          return self.indexOf(item) == index;     
    });
}

module.exports = function sprites(isSprites, data, obj, callback) {
    if (!isSprites) {
        callback(data);
        return;
    }

    let tmpDir = path.join(global.tmpDir, 'sprites');

    var algorithm = obj.algorithm,
        spritesCount = obj.spritesCount;

    var files = getFiles(data);
    var count = !spritesCount? files.length: spritesCount,
        result = [];

    for(var i = 0, len = files.length; i<len; i += count) {
        result.push(files.slice(i,i + count));
    }

    for (var j = 0, k = 0, items, newfilepath, rlen = result.length; j < rlen; j++) {
        items = result[j];
        newfilepath = path.join(tmpDir, `sprites${(rlen !== 1? "-" + (j + 1): "")}${path.extname(result[j][0])}`);
        gsprites(items, newfilepath, algorithm, (r, filepath) => {
            for (var i = 0, coors; i < data.frames.length; i++) {
                coors = r.coordinates[data.frames[i]['src']];
                data.frames[i]['w'] = r.properties.width;
                data.frames[i]['h'] = r.properties.height;
                data.frames[i]['width'] = coors.width;
                data.frames[i]['height'] = coors.height;
                data.frames[i]['x'] = coors.x;
                data.frames[i]['y'] = coors.y;
                data.frames[i]['src'] = filepath;
            }
            ++k === rlen && callback(data);
        })
    }
};
