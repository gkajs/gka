/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

var path = require("path"),
    info = require("./info"),
    setInfo = info.setInfo, outputInfo = info.outputInfo,
    file = require("./file"), 
    writeFile = file.writeFile;

var infoResArr = [] , tplOptArr = [], nameArr = [], _count = 0;

var imagex = require("./imagex");

function gka(dir, opt) {
    
    var cmd = opt.cmd;

    if (cmd === "tool") {
        // 压缩源图片
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
        // 兼容提示
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

    var isCrop     = opt.crop || false,
        isSprites  = opt.sprites || false,
        isMini     = opt.mini || false,
        isInfo     = opt.info || false,

        // unique 默认为 true,
        isUnique   = opt.unique || false,

        // -p 默认为 "gka-", 否则保留原名字
        prefix     = opt.prefix === undefined? "": (opt.prefix === true? "prefix": opt.prefix),

        // 带 tpl，则默认为 n
        tpl   = opt.tpl,
        tplName   = opt.tplName,
        tplList   = opt.tplList,

        frameduration = opt.frameduration || 0.04,
        // fps    = opt.fps || 25,  // 1 / 25 = 0.04s 每帧时长

        algorithm  = opt.algorithm || "binary-tree";

    opt.__len = opt.__len || 1;
    opt.__index = opt.__index || 0;

    var cfg = tpl && tpl.config || {};

    // template config 覆盖参数
    isCrop    = cfg.crop    !== undefined? cfg.crop: isCrop;
    isSprites = cfg.sprites !== undefined? cfg.sprites: isSprites;
    dir       = cfg.dir     !== undefined? cfg.dir: dir;

    prefix = cfg.prefix !== undefined? cfg.prefix: prefix;

    if (!dir) {
        console.log();
        console.log('[error]: ' + 'gka need dir !');
        console.log('----------------------------');
        yargs.showHelp();
        return;
    }

    // opt 优先
    algorithm = opt.algorithm !== undefined? algorithm: (cfg.algorithm || algorithm);
    isUnique  = opt.unique !== undefined? isUnique: cfg.unique;

    var dest = path.join(dir, "..", "gka-" + (cmd === "tool"? 'tool-': "") + path.basename(dir) + (isCrop? '-c': "") + (isUnique? '-u': "") + (isSprites? '-s': "") + (tpl? ('-'+ tplName): "") + (prefix? ('-'+ prefix): ""));

    dest = cfg.output !== undefined? cfg.output: dest;
   
    if (tplName && !tpl) {
        console.log();
        console.log('[error]: can not find template %j!', tplName);
        console.log();
        console.log('template list: ');
        console.log(tplList);
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

        var tplOpt = opt;
            tplOpt.prefix = opt.prefix === undefined? "": (opt.prefix === true? "prefix": opt.prefix);
            tplOpt.frameduration = opt.frameduration || 0.04;

        var names = tool.getNames(data);

        if (opt.__len === 1) {
            infoResArr = data;
            tplOptArr = tplOpt;
            nameArr = names;
        } else {
            // combine data & opt
            infoResArr[opt.__index] = data;
            tplOptArr[opt.__index] = tplOpt;
            nameArr[opt.__index] = names;
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
