/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

var path      = require("path"),
    imagex    = require("./imagex"),
    info      = require("./info"),
    file      = require("./file"), 
    setInfo   = info.setInfo, 
    outputInfo= info.outputInfo,
    writeFile = file.writeFile;

var infoResArr = [] , tplOptArr = [], nameArr = [], _count = 0;

function gka(dir, opt) {
    
    var cmd = opt.cmd;

    if (cmd === "tool") {
        // MINI source image
        if (opt.replace && opt.mini) {
            
            if (!dir) {
                console.log();
                console.log('[error]: ' + 'gka need dir !');
                console.log('----------------------------');
                yargs.showHelp();
                return;
            }

            mini(dir);
            return;
        }
    } else {
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

        prefix    = opt.prefix === undefined? "": (opt.prefix === true? "prefix": opt.prefix),

        tpl       = opt.tpl,
        tplName   = opt.tplName,
        tplList   = opt.tplList,

        frameduration = opt.frameduration || 0.04,
        // fps    = opt.fps || 25,  // 1 / 25 = 0.04

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

    var dest  = path.join(dir, "..", "gka-" + (cmd === "tool"? 'tool-': "") + path.basename(dir) + (isCrop? '-c': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (tpl? ('-'+ tplName): "") + (prefix? ('-'+ prefix): ""));

    dest = cfg.output !== undefined? cfg.output: dest;
    
    opt.__len   = opt.__len || 1;
    opt.__index = opt.__index || 0;

    if (!dir) {
        console.log();
        console.log('[error]: ' + 'gka need dir !');
        console.log('----------------------------');
        yargs.showHelp();
        return;
    }

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
        dest: path.join(dest, "img"),
        prefix: prefix,
        isMini: isMini,
        isInfo: false,
        isUnique: isUnique,
        isCrop: isCrop,
        isSprites: isSprites,
        algorithm: algorithm,
    }, function(data, tool){

        var names = tool.getNames(data);

        if (opt.__len === 1) {
            infoResArr = data;
            tplOptArr  = opt;
            nameArr    = names;
        } else {
            // combine data & opt
            infoResArr[opt.__index] = data;
            tplOptArr[opt.__index]  = opt;
            nameArr[opt.__index]    = names;
        }

        if (++_count === opt.__len) {
            
            tpl && tpl.engine && tpl.engine(infoResArr, tplOptArr, {
                writeFile: (name, res) => {
                    writeFile(path.join(dest, name), res, () => {
                        console.log(` ✔ ${name} generated`);
                    });
                },
                getNames: () => {
                    return JSON.stringify(names);
                },
            });

            setInfo("data.json", {}, infoResArr);
            setInfo("names.json", {}, nameArr);

            outputInfo(isInfo, dest);
        }
    })
}

module.exports = gka;
