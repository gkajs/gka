var program = require('commander');

var gka = require("./index");

function isTiny(val) {
    return val;
}

program
  .version('0.0.1')
  .option('-f --folder <folder>', 'img folder', /^(.*)$/i, 'test')
  .option('-r --rename <rename>', 'rename string', /^(.*)$/i, 'rename')
  .option('-i --image <imageFolder>', 'tiny img', /^(.*)$/i, false)
  // .option('-i --image <imageFolder>', 'tiny img', /^(true|false)/i, isTiny)
  .parse(process.argv);

if (program.image) {
    console.log(program.image)
    gka.tiny(program.image);
} else {
    gka({
      folder: program.folder,
      rename: program.rename,
    });
}
console.log(' folder: %j', program.folder);
console.log(' rename: %j', program.rename);



