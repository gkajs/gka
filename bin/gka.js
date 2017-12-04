#!/usr/bin/env node

var yargs = require('yargs'),
    argv = yargs.argv,
    inquirer = require('inquirer'),
    fs = require("fs"),
    path = require("path"),
    gka = require("../lib/gka"),
    tpl = require("../lib/core/tpl"),

    pkg = require('../package.json'),
    _ = argv._;

var cmd = "";

if (_[0] === 'tool' || _[0] === 't' ) {
    cmd = "tool";

    argv = yargs
    .usage('\nUsage: gka tool <dir> <option>')
    .option('u', {
        boolean: true,
        alias : 'unique',
        describe: 'remove duplicates',
    })
    .option('c', {
        boolean: true,
        alias : 'crop',
        describe: 'crop images',
    })
    .option('m', {
        boolean: true,
        alias : 'mini',
        describe: 'minify images',
    })
    .option('s', {
        boolean: true,
        alias : 'sprites',
        describe: 'sprites images',
        type: "boolean"
    })
    .option('a', {
        default: 'left-right',
        choices: ['top-down', 'left-right', 'binary-tree', 'diagonal', 'alt-diagonal'],
        alias : 'algorithm',
        describe: 'sprites layout types',
    })
    .option('p', {
        type: "string",
        alias : 'prefix',
        describe: 'rename with prefix',
        coerce: function (arg) {
            return arg || "prefix";
        }
    })
    .option('o', {
        alias : 'output',
        describe: 'output dir path'
    })
    .option('r', {
        boolean: true,
        default: false,
        alias : 'replace',
        describe: 'replace dir'
    })
    .option('i', {
        boolean: true,
        alias : 'info',
        describe: 'get images info',
    })
    .option('count', {
        alias : 'count',
        describe: 'sprites count',
        type: "number"
    })
    .option('split', {
        boolean: true,
        alias : 'split',
        describe: 'split images',
    })
    .option('diff', {
        boolean: true,
        alias : 'diff',
        describe: 'diff images',
    })
    .option('bgcolor', {
        alias : 'bgcolor',
        describe: 'set images bgcolor',
    })
    .help('h')
    .example('gka tool E:\\img -s')
    .epilog('for more detailed instructions, visit https://github.com/joeyguo/gka')
    .version()
    .argv;

    if (argv.v || argv.version || argv.V) {
        console.log(pkg.version);
        return;
    }

    var dir = _[1] || argv.d;
    if (!dir) {
        console.log();
        console.log('[error]: ' + 'gka tool need dir !');
        console.log('----------------------------');
        yargs.showHelp();
        return;
    }

    gka(dir, {
        // c
        crop: argv.crop,
        // s
        sprites: argv.sprites,
        // m 
        mini: argv.mini,
        // r
        unique: argv.unique,
        // i
        info: argv.info,
        // tpl
        tpl: argv.t || argv.tpl || argv.template,
        // p
        prefix: argv.prefix,
        // f
        frameduration: argv.frameduration,
        // a
        algorithm: argv.algorithm,
        // r
        replace: argv.replace,
        // o
        output: argv.output,
        // count
        spritesCount: argv.count,
        // split
        split: argv.split,
        // diff
        diff: argv.diff,
        // bgcolor
        bgColor: argv.bgcolor,

        cmd: cmd,
    });

} else {
    argv = yargs
    .option('u', {
        boolean: true,
        alias : 'unique',
        default: true,
        describe: 'remove duplicates'
    })
    .option('c', {
        boolean: true,
        alias : 'crop',
        describe: 'crop images',
    })
    .option('s', {
        boolean: true,
        alias : 'sprites',
        describe: 'sprites images',
        type: "boolean"
    })
    .option('m', {
        boolean: true,
        alias : 'mini',
        describe: 'minify images',
    })
    .option('p', {
        alias : 'prefix',
        describe: 'rename with prefix',
        type: "string",
        coerce: function (arg) {
            return arg || "prefix";
        }
    })
    .option('f', {
        alias : 'frameduration',
        describe: 'frame duration',
        type: "number",
    })
    .option('t', {
        alias : 'template',
        describe: 'html/js/css template',
        type: "string",
        // demandOption: true,
        default: "n",
        coerce: function (arg) {
            return arg //|| "n";
        }
    })
    .option('count', {
        alias : 'count',
        describe: 'sprites count',
        type: "number"
    })
    .option('split', {
        boolean: true,
        alias : 'split',
        describe: 'split images',
    })
    .option('diff', {
        boolean: true,
        alias : 'diff',
        describe: 'diff images',
    })
    .option('bgcolor', {
        alias : 'bgcolor',
        describe: 'set images bgcolor',
    })
    .option('i', {
        boolean: true,
        alias : 'info',
        describe: 'get images info',
    })
    .option('a', {
        default: 'left-right',
        choices: ['top-down', 'left-right', 'binary-tree', 'diagonal', 'alt-diagonal'],
        alias : 'algorithm',
        describe: 'sprites layout types',
    })
    .option('o', {
        alias : 'output',
        describe: 'output dir path'
    })
    .help('h')
    .alias('h', 'help')
    .usage('\nUsage: \n  gka <dir> [options] \n  gka tool <dir> [options]')
    .example('gka E:\\img')
    .epilog('for more detailed instructions, visit https://github.com/joeyguo/gka')
    .version()
    // .command('tool', 'images processing tools')
    .argv;

    if (argv.v || argv.version || argv.V) {
        console.log(pkg.version);
        return;
    }

    var dir = _[0] || argv.d;

    var template = argv.template;
    
    var stats = null;
    try {
        stats = fs.statSync(template);
        console.log()
        console.log("[local template]:", template)
        console.log()
    } catch(e) {}

    if (stats && stats.isDirectory()) {

        function isArray(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        }

        function get(dir, type) {
            var file = path.join(dir, type);
            return fs.existsSync(file)? require(file): null;
        }

        var tpl = {
            config: get(template, "gka.config.js"),
            engine: get(template, "index.js"),
        };

        var tplName = path.basename(template);

        if (tplName.indexOf("gka-tpl") > -1) {
            tplName = tplName.substring(8);
        }

        tpl.config = isArray(tpl.config)? tpl.config: [tpl.config];

        for (var i = 0, __len = tpl.config.length; i < __len; i++) {
            gka(dir, {
                // c
                crop: argv.c,
                // s
                sprites: argv.s,
                // m 
                mini: argv.mini,
                // u
                unique: argv.unique,
                // i
                info: argv.info,
                // tpl
                tpl: {
                    config: tpl.config[i],
                    engine: tpl.engine
                },
                tplName: tplName,
                tplList: [],
                // p
                prefix: argv.prefix,
                // f
                frameduration: argv.frameduration,
                // a
                algorithm: argv.algorithm,
                // o
                output: argv.output,
                // count
                spritesCount: argv.count,
                // split
                split: argv.split,
                // diff
                diff: argv.diff,
                // bgcolor
                bgColor: argv.bgcolor,

                __len: __len,
                __index: i,
            });
        }
        return;
    }

    var tplMap = tpl();
    var tplList = Object.keys(tplMap).map(function(item){
            return item.substring(8);
        });
    
    if (template === "") {

        inquirer.prompt([{
            type: 'list',
            name: 'template',
            message: 'which template do you like: ',
            choices: tplList,
            filter: function (val) {
              return val.toLowerCase();
            }
          }]).then((answers) => {
            gka(dir, {
                // c
                crop: argv.c,
                // s
                sprites: argv.s,
                // m 
                mini: argv.mini,
                // u
                unique: argv.unique,
                // i
                info: argv.info,
                // tpl
                tpl: tplMap['gka-tpl-' + answers.template],
                tplName: answers.template,
                tplList: tplList,
                // p
                prefix: argv.prefix,
                // f
                frameduration: argv.frameduration,
                // a
                algorithm: argv.algorithm,
                // o
                output: argv.output,
                // count
                spritesCount: argv.count,
                // split
                split: argv.split,
                // diff
                diff: argv.diff,
                // bgcolor
                bgColor: argv.bgcolor,
            });
        })
    } else {
        // 内置别名
        template = template === 'c'? 'crop': template;
        template = template === 's'? 'sprites': template;
        template = template === 'n'? 'normal': template;
        
        var tpl = tplMap['gka-tpl-' + template];

        gka(dir, {
            // c
            crop: argv.c,
            // s
            sprites: argv.s,
            // m 
            mini: argv.mini,
            // u
            unique: argv.unique,
            // i
            info: argv.info,
            // tpl
            tpl: tpl,
            tplName: template,
            tplList: tplList,
            // p
            prefix: argv.prefix,
            // f
            frameduration: argv.frameduration,
            // a
            algorithm: argv.algorithm,
            // o
            output: argv.output,
            // count
            spritesCount: argv.count,
            // split
            split: argv.split,
            // diff
            diff: argv.diff,
            // bgcolor
            bgColor: argv.bgcolor,
        });
    }
    
}