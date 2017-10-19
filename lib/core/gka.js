/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

var path      = require("path"),
    imagex    = require("../imagex"),
    util      = require("./util"), 
    writeFile = util.writeFile;

var dataArr = [], optArr = [], nameArr = [], _count = 0;

function gka(dir, opt) {
    
    var cmd = opt.cmd;

    if (cmd !== "tool") {
        if (opt.crop) {
            console.log();
            console.log('[error]: please replace "-c" with "-t c" ');
            console.log();
            return;
        }
        if (opt.sprites) {
            console.log();
            console.log('[error]: please replace "-s" with "-t s" ');
            console.log();
            return;
        }
    }

    var isCrop    = opt.crop    || false,
        isSprites = opt.sprites || false,
        isMini    = opt.mini    || false,
        isInfo    = opt.info    || false,
        isUnique  = opt.unique  || false,

        isReplace = opt.replace  || false,

        prefix    = opt.prefix === undefined? "": (opt.prefix === true? "prefix": opt.prefix),

        tpl       = opt.tpl,
        tplName   = opt.tplName,
        tplList   = opt.tplList,

        frameduration = opt.frameduration || 0.04,
        // fps    = opt.fps || 25,  // 1 / 25 = 0.04

        spritesCount = opt.spritesCount || 0,
        algorithm = opt.algorithm || "binary-tree";

    opt.prefix = prefix;
    opt.frameduration = frameduration;
    opt.algorithm = algorithm;

    // template config 
    var cfg   = tpl && tpl.config || {};

    isCrop    = cfg.crop    !== undefined? cfg.crop   : isCrop;
    isSprites = cfg.sprites !== undefined? cfg.sprites: isSprites;
    dir       = cfg.dir     !== undefined? cfg.dir    : dir;
    prefix    = cfg.prefix  !== undefined? cfg.prefix : prefix;

    // opt
    algorithm = opt.algorithm !== undefined? algorithm: (cfg.algorithm || algorithm);
    isUnique  = opt.unique    !== undefined? isUnique : cfg.unique;

    if (!dir) {
        console.log();
        console.log('[error]: ' + 'gka need dir !');
        console.log('----------------------------');
        return;
    }

    // relative path
    dir = dir && dir[0] === "."? path.resolve(dir): dir;

    var dest = (opt.output && opt.output !== true)? opt.output: path.join(dir, "..", "gka-" + (cmd === "tool"? 'tool-': "") + path.basename(dir) + (isCrop? '-c': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (spritesCount? ('-'+ spritesCount): "") + (tpl? ('-'+ tplName): "") + (prefix? ('-'+ prefix): ""));

    dest = cfg.output !== undefined? cfg.output: dest;
    
    opt.__len   = opt.__len || 1;
    opt.__index = opt.__index || 0;

    if (tplName && !tpl) {
        console.log();
        console.log('[error]: can not find template %j!', tplName);
        console.log();
        console.log('template list: ');
        console.log(tplList);
        console.log();
        return;
    }

    if (prefix && !isNaN(prefix[0])) {
        console.log();
        console.log('[error]: prefix can not start with Number!');
        console.log();
        return;
    }

    console.log();
    console.log("GKA------------------------------------------------------------");
    console.log('           [dir]: %j', dir);
    isCrop && console.log('          [crop]: true');
    isSprites && console.log('       [sprites]: true');
    if (isSprites) {
    console.log('     [algorithm]: %j', algorithm);
    }
    if (spritesCount) {
    console.log('     [spritesCount]: %j', spritesCount);
    }
    isMini && console.log('          [mini]: true');
    isInfo && console.log('          [info]: true');
    isUnique && console.log('        [unique]: true');
    prefix && console.log('        [prefix]: %j', prefix);
    if (tpl) {
    console.log('      [template]: %j', tplName);
    console.log(' [frameDuration]: %j', frameduration);
    }
    console.log();
    console.log();
    console.log('[output dir]: %j', dest);
    console.log("---------------------------------------------------------------");
    console.log();

    imagex({
        src: dir,
        dest: cmd === "tool"? dest: path.join(dest, "img"),
        prefix: prefix,
        isMini: isMini,
        isUnique: isUnique,
        isCrop: isCrop,
        isSprites: isSprites,
        spritesCount: spritesCount,
        isReplace: isReplace,
        algorithm: algorithm,
    }, function(data, tool){
        var names = tool.getNames(data);

        if (opt.__len === 1) {
            dataArr = data;
            optArr  = opt;
            nameArr = names;
        } else {
            // combine data & opt
            dataArr[opt.__index] = data;
            optArr[opt.__index]  = opt;
            nameArr[opt.__index] = names;
        }

        if (++_count >= opt.__len) {
            
            tpl && tpl.engine && tpl.engine(dataArr, optArr, {
                writeFile: (name, res) => {
                    writeFile(path.join(dest, name), res, () => {
                        console.log(` ✔ ${name} generated`);
                    });
                },
                getNames: () => {
                    return JSON.stringify(nameArr);
                },
            });

            if (isInfo) {
                writeFile(path.join(dest, "__info", "data.json"), JSON.stringify(dataArr, null, '    '), () => {
                    console.log(` ✔ __info data.json generated`);
                })

                writeFile(path.join(dest, "__info", "names.json"), JSON.stringify(nameArr, null, '    '), () => {
                    console.log(` ✔ __info names.json generated`);
                })
            }
        }
    })
}

module.exports = gka;
