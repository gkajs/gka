#!/usr/bin/env node

var yargs = require('yargs'),
    argv = yargs.argv;

var gka = require("../lib/gka");
var pkg = require('../package.json');

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


// console.log(dir);
// console.log(argv);

gka(dir, {
    // c
    cut: argv.c,
    // s
    sprites: argv.s, 
    // t 
    tiny: argv.t,
    // r
    ridding: argv.r,
    // i
    info: argv.i,
    // g
    gen: argv.g || argv.gen,
    // p
    prefix: argv.p || argv.prefix,
    // f
    duration: argv.f || argv.frameduration,
    // a
    algorithm: argv.a || argv.algorithm,
})
