#!/usr/bin/env node

var yargs = require('yargs'),
    argv = yargs.argv,
    inquirer = require('inquirer'),
    fs = require("fs"),
    path = require("path"),
    pkg = require('../package.json'),
    tpl = require("./tpl"),
    gka = require("../lib/gka"),
    _ = argv._;

require('update-notifier')({pkg: pkg}).notify({defer: true});

argv = yargs
    .option('u', {
        boolean: true,
        alias : 'unique',
        default: false,
        describe: 'remove duplicates'
    })
    .option('c', {
        boolean: true,
        alias : 'crop',
        default: false,
        describe: 'crop images',
    })
    .option('s', {
        boolean: true,
        alias : 'sprites',
        default: false,
        describe: 'sprites images',
        type: "boolean"
    })
    .option('a', {
        default: 'left-right',
        choices: ['top-down', 'left-right', 'binary-tree', 'diagonal', 'alt-diagonal'],
        alias : 'algorithm',
        describe: 'sprites layout types',
    })
    .option('count', {
        alias : 'count',
        describe: 'sprites count',
        type: "number"
    })
    .option('p', {
        alias : 'prefix',
        describe: 'rename with prefix',
        type: "string",
        coerce: function (arg) {
            return arg || "prefix";
        }
    })
    .option('m', {
        default: false,
        boolean: true,
        alias : 'mini',
        describe: 'minify images',
    })
    .option('t', {
        alias : 'template',
        describe: 'html/js/css template',
        type: "string",
        // demandOption: true,
        default: "css",
        coerce: function (arg) {
            return arg //|| "n";
        }
    })
    .option('f', {
        default: 0.04,
        alias : 'frameduration',
        describe: 'frame duration',
        type: "number",
    })
    .option('split', {
        default: false,
        boolean: true,
        alias : 'split',
        describe: 'split images',
    })
    .option('diff', {
        default: false,
        boolean: true,
        alias : 'diff',
        describe: 'diff images',
    })
    .option('bgcolor', {
        alias : 'bgcolor',
        describe: 'set images bgcolor',
    })
    .option('ratio', {
        alias : 'ratio',
        describe: 'set ratio',
        type: "number",
    })
    .option('i', {
        default: false,
        boolean: true,
        alias : 'info',
        describe: 'get images info',
    })
    .option('o', {
        alias : 'output',
        describe: 'output dir path'
    })
    .help('h')
    .alias('h', 'help')
    .usage('\nUsage: \n  gka <dir> [options] \n')
    .example('gka E:\\img')
    .epilog('for more detailed instructions, visit https://github.com/joeyguo/gka')
    .version()
    .argv;

if (argv.v || argv.version || argv.V) {
    console.log(pkg.version);
    return;
}

var dir = _[0] || argv.d;

if (!dir) {
    console.log();
    console.log('[error]: ' + 'dir required!');
    console.log('----------------------------');
    yargs.showHelp();
    return;
}

var template = argv.template;

function run(argv, dir, template) {
    gka({
        dir: dir,
        // u
        unique: argv.unique,
        // c
        crop: argv.c,
        // s
        sprites: argv.s,
        // a
        algorithm: argv.algorithm,
        // count
        spritesCount: argv.count,
        // split
        split: argv.split,
        // diff
        diff: argv.diff,
        // bgcolor
        bgcolor: argv.bgcolor,
        // m 
        mini: argv.mini,
        // p
        prefix: argv.prefix,
        // o
        output: argv.output,
        // i
        info: argv.info,
        // tpl
        template: template,
        // f
        frameduration: argv.frameduration,
        // ratio
        ratio: argv.ratio,
        env: argv.env
    });
}

const localTpls = ['css', 'canvas', 'svg'];

if (template === '') {
    let tplList = tpl();
    var tplListName = tplList.map(t => t.name);
    inquirer.prompt([{
        type: 'list',
        name: 'template',
        message: 'which template do you like: ',
        choices: tplListName,
        filter: function (val) {
          return val.toLowerCase();
        }
    }]).then((answers) => {
        let answerTplName = answers.template;
        let t = tplList.filter(t => t.name === answerTplName)[0];

        run(argv, dir, t.target)
    })
} else if (!!~localTpls.indexOf(template)) {
    run(argv, dir, template)
} else {
    let tplList = tpl();
    let t = tplList.filter(tpl => tpl.name === template)[0];
    if (t) {
        run(argv, dir, t.target)
    } else {
        if (fs.existsSync(template)) {
            run(argv, dir, template)
        } else {
            throw new Error(`can not find template: ${template}`);
        }
    }
}
    