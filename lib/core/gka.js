/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

var path      = require("path"),
    fs        = require("fs"),
    pkg       = require("../../package.json");
    imagex    = require("../imagex"),
    util      = require("./util"), 
    tplUtil = require("./tpl"),
    writeFile = util.writeFile;

var dataArr = [], optArr = [], nameArr = [], _count = 0;

function gka(opt) {
    var dir = opt.src;
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

    // 兼容使用gka模块tpl传入字符串模板名
    if (Object.prototype.toString.call(opt.tpl) === "[object String]") {
        var tplMap = tplUtil();
        opt.tplName = opt.tpl;
        opt.tpl = tplMap['gka-tpl-' + opt.tpl];
        opt.tplList = Object.keys(tplMap).map(t => t.substring(8));
    }

    var isCrop    = opt.crop    || false,
        bgColor   = opt.bgColor || '',
        isSplit   = opt.split   || false,
        isDiff    = opt.diff    || false,
        isSprites = opt.sprites || false,
        isMini    = opt.mini    || false,
        isInfo    = opt.info    || false,
        isUnique  = opt.unique  || false,

        isReplace = opt.replace || false,

        prefix    = opt.prefix === undefined? "": (opt.prefix === true? "prefix": opt.prefix),

        tpl       = opt.tpl,
        tplName   = opt.tplName,
        tplList   = opt.tplList,

        frameduration = opt.frameduration || 0.04,
        // fps    = opt.fps || 25,  // 1 / 25 = 0.04

        spritesCount = opt.spritesCount || 0,
        algorithm = opt.algorithm || "left-right";

    opt.prefix = prefix;
    opt.frameduration = frameduration;
    opt.algorithm = algorithm;

    // template config 
    var cfg   = tpl && tpl.config || {};

    isDiff    = cfg.diff    !== undefined? cfg.diff   : isDiff;
    isCrop    = cfg.crop    !== undefined? cfg.crop   : isCrop;
    isSprites = cfg.sprites !== undefined? cfg.sprites: isSprites;
    dir       = cfg.dir     !== undefined? cfg.dir    : dir;
    prefix    = cfg.prefix  !== undefined? cfg.prefix : prefix;

    // opt
    algorithm = opt.algorithm !== undefined? algorithm: (cfg.algorithm || algorithm);
    isUnique  = opt.unique    !== undefined? isUnique : cfg.unique;

    if (!dir) {
        console.log('\n[error]: ' + 'gka need dir !');
        console.log('----------------------------');
        return;
    }

    // relative path
    dir = dir && dir[0] === "."? path.resolve(dir): dir;

    var dest = (opt.output && opt.output !== true)? opt.output: path.join(dir, "..", "gka-" + (cmd === "tool"? 'tool-': "") + path.basename(dir) + (isDiff? '-d': "") + (bgColor? ('-' + bgColor): "") + (isSplit? '-sp': "") + (isCrop? '-c': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (spritesCount? ('-'+ spritesCount): "") + (tpl? ('-'+ tplName): "") + (prefix? ('-'+ prefix): ""));

    dest = opt.output !== undefined? opt.output: util.getRealDest(dest);

    opt.__len   = opt.__len || 1;
    opt.__index = opt.__index || 0;

    if (tplName && !tpl) {
        console.log('\n[error]: can not find template %j!', tplName);
        console.log('\ntemplate list: ');
        console.log(tplList + '\n');
        return;
    }

    if (prefix && !isNaN(prefix[0])) {
        console.log('\n[error]: prefix can not start with Number!\n');
        return;
    }

    console.log("\nGKA------------------------------------------------------------");
    console.log('           [dir]: %j', dir);
    bgColor && console.log('       [bgColor]: %j', bgColor);
    isDiff && console.log('          [diff]: true');
    isSplit && console.log('         [split]: true');
    isCrop && console.log('          [crop]: true');
    isSprites && console.log('       [sprites]: true');
    isSprites && console.log('     [algorithm]: %j', algorithm);
    spritesCount && console.log('     [spritesCount]: %j', spritesCount);
    isMini && console.log('          [mini]: true');
    isInfo && console.log('          [info]: true');
    isUnique && console.log('        [unique]: true');
    prefix && console.log('        [prefix]: %j', prefix);
    tpl && console.log('      [template]: %j', tplName);
    tpl && console.log(' [frameDuration]: %j', frameduration);
    console.log('\n[output dir]: %j', dest);
    console.log("---------------------------------------------------------------");
    
    var imagexOpts = {
        src: dir,
        dest: cmd === "tool"? dest: path.join(dest, "img"),
        prefix: prefix,
        bgColor: bgColor,
        isSplit: isSplit,
        isMini: isMini,
        isDiff: isDiff,
        isUnique: isUnique,
        isCrop: isCrop,
        isSprites: isSprites,
        spritesCount: spritesCount,
        isReplace: isReplace,
        algorithm: algorithm,
    };

    imagex(imagexOpts, function(data, tool){
        var names = tool.getNames(data);

        opt.imageDir = imagexOpts.dest;
        opt.gkaVersion = pkg.version;
        
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

            if (isInfo) {
                writeFile(path.join(dest, "__info", "data.json"), JSON.stringify(dataArr, null, '    '), () => {
                    console.log(` ✔ __info data.json generated`);
                })
                writeFile(path.join(dest, "__info", "names.json"), JSON.stringify(nameArr, null, '    '), () => {
                    console.log(` ✔ __info names.json generated`);
                })
            }
            
            tpl && tpl.engine && tpl.engine(dataArr, optArr, (tplData) => {
                console.log(` ✔ callback trigger`)
                opt.callback && opt.callback(dest, tplData);
            });
        }
    })
}

module.exports = gka;