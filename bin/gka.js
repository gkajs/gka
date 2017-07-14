#!/usr/bin/env node

var program = require('commander');
var gka = require("../lib/gka");
var tiny = require("../lib/core/tiny");

var pkg = require('../package.json');
console.log('gka version:' + pkg.version);
console.log();

program
.version('gka version:' + pkg.version)
.option('-d --dir <string>', 'img dir', /^(.*)$/i, 'test')
.option('-p --prefix <string>', 'prefix name', /^(.*)$/i, 'gka-')
.option('-t --tiny <string>', 'tiny img', /^(.*)$/i, false)
.option('-s --sprites <boolean>', 'sprites img', /^(.*)$/i, false)
.option('-i --info <boolean>', 'get info', /^(.*)$/i, false)
.option('-a --algorithm <string>', 'sprites algorithm', /^(.*)$/i, "binary-tree")
.option('-g --generator <string>', 'file generator', /^(.*)$/i, "normal")
.option('-f --frameduration <string>', 'frameDuration', /^(.*)$/i, false)
.parse(process.argv);

var t = program.tiny,
    s = program.sprites,
    d = program.dir,
    p = program.prefix,
    i = program.info,
    a = program.algorithm,
    g = program.generator,
    f = program.frameduration;

var gmap = {
    nor: "normal",
    s: "sprites",
    pct: "sprites_percent",
    c: "cut",
};

g = s? "s": g;

g = gmap[g];

if (t) {
    // 图片压缩
    tiny(t);
} else {
    // 抽象输出结果 generator
    gka({
        dir: d,
        prefix: p,
        frameDuration: f,
        generator: g,
        algorithm: a,
        info: i,
    });
}

// console.log(' folder: %j', program.folder);
// console.log(' rename: %j', program.rename);



