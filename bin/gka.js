#!/usr/bin/env node

var yargs = require('yargs'),
    argv = yargs.argv;

var gka = require("../lib/gka");
var pkg = require('../package.json');

// console.log(argv);

if (argv.v || argv.version) {
    console.log();
    console.log('[gka version]: ' + pkg.version);
};

var dirs = argv._;

var dir = dirs.shift() || argv.d;

if (!dir) {
    console.log();
    console.log('[error]: ' + 'gka need dir !');
    console.log();
    return;
}

gka(dir, {
    // c
    crop: argv.c || argv.crop,
    // s
    sprites: argv.s || argv.sprites,
    // m 
    mini: argv.m || argv.mini,
    // r
    unique: argv.u || argv.unique,
    // i
    info: argv.i || argv.info,
    // tpl
    tpl: argv.t || argv.tpl || argv.template,
    // p
    prefix: argv.p || argv.prefix,
    // f
    frameduration: argv.f || argv.frameduration,
    // a
    algorithm: argv.a || argv.algorithm,
});
