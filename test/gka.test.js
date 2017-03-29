var gka = require("../lib/gka");
var fs = require('fs');
var path = require('path');

var expectedDir = path.join(__dirname, 'expected');
var expectedDir_normal = path.join(expectedDir, 'img4test-gka');
var expectedDir_sprites = path.join(expectedDir, 'img4test-gka-sprites');

var imgFolder = path.join(__dirname, "img4test");

// TODO 
/*
describe('gka-actual-test', function () {

    it('gka-normal：node gka.js -d dir', function (next) {
        // 生成帧动画 - 普通模式
        gka({
            dir: d,
            prefix: p,
            type: "normal"
        });

        setTimeout(()=>{

            next();
        }, 10000)
    });

    it('gka-sprites：gka -d dir -s true', function (next) {
        // 生成帧动画 - 普通模式
        gka({
            dir: d,
            prefix: p,
            type: "sprites"
        });

        setTimeout(()=>{

            next();
        }, 10000)
    });

});
*/

// var tiny = require("./core/tiny");

/*
var program = {
    tiny: false,
    sprites: true,
    dir: "E:/gka-test/img",
    prefix: "prefix22",

};

var t = program.tiny,
    s = program.sprites,
    d = program.dir,
    p = program.prefix;

if (t) {

    // 图片压缩
    tiny(t);

} else if (s) {

    // 生成帧动画 - 合图模式
    gka({
        dir: d,
        prefix: p,
        type: "sprites"
    });

} else {
    // 生成帧动画 - 普通模式
    gka({
        dir: d,
        prefix: p,
        type: "normal"
    });
}*/