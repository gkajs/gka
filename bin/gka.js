#!/usr/bin/env node

var program = require('commander');
var gka = require("../lib/gka");

var pkg = require('../package.json');
console.log('gka version:' + pkg.version)

program
.version('1.2.0')
.option('-f --folder <folder>', 'img folder', /^(.*)$/i, 'test')
.option('-p --prefix <prefix>', 'prefix name', /^(.*)$/i, 'prefix')
.option('-t --tiny <imageFolder>', 'tiny img', /^(.*)$/i, false)
.option('-s --sprites <string>', 'sprites img', /^(.*)$/i, false)
.parse(process.argv);


var t = program.tiny,
    s = program.sprites,
    f = program.folder,
    p = program.prefix;

if (t) {

    // 图片压缩
    gka.tiny(t);

} else if (s) {

    // 生成帧动画 - 合图模式
    gka.sprites({
        folder: f,
        prefix: p,
    });

} else {

    // 生成帧动画 - 普通模式
    gka({
        folder: f,
        prefix: p,
    });
}

// console.log(' folder: %j', program.folder);
// console.log(' rename: %j', program.rename);



