#!/usr/bin/env node

var program = require('commander');

var gka = require("../gka");

function isTiny(val) {
    console.log(val);
    return val;
}

program
  .version('0.0.1')
  .option('-f --folder <folder>', 'img folder', /^(.*)$/i, 'test')
  .option('-r --rename <rename>', 'rename string', /^(.*)$/i, 'rename')
  .option('-t --tiny <tiny>', 'tiny img', /^(true|false)/i, isTiny)
  .parse(process.argv);
  
console.log(' folder: %j', program.folder);
console.log(' rename: %j', program.rename);

gka({
  folder: program.folder,
  rename: program.rename,
});