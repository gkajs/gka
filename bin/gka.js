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
    // t
    trim: argv.t,
    // s
    sprites: argv.s, 
    // m 
    mini: argv.m,
    // r
    unique: argv.u,
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
