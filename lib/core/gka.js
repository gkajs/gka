/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

let pkg    = require("../../package.json"),
    imagex = require("../imagex"),
    getTpl = require("./tpl"),
    info = require("./info");

let {
    getDir,
    getPrefix,
    getOutput,
    getImgOutput,
    checkTplConfig,
} = require("./optionsHelper");

let {
    simpleMerge,
    writeFile,
} = require("./utils");

function gka(options = {}, callback) {

    let defaultOpts = {
        template: 'css',
        frameduration: 0.04,
        gkaVersion: pkg.version,
    }

    // 针对tpl的参数支持情况，需要检查的opts
    let checkListOptsDefault = {
        'crop': false,
        'sprites': false,
        'diff': false,
        'split': false
    };

    options           = simpleMerge(defaultOpts, options);

    // 获得当前的模板函数
    let tpl = getTpl(options.template);

    // 检查模板对参数的支持情况，必要时进行重置 options
    options = checkTplConfig(tpl, checkListOptsDefault, options);
    
    // 设置参数
    options.dir       = getDir(options);
    options.prefix    = getPrefix(options);
    options.output    = getOutput(options);
    options.imgOutput = getImgOutput(options);

    // 打印参数信息
    info(options);

    imagex(options, (data) => {
        tpl(data, options, () => {
            // console.log('gka finished!');
            callback && callback(data, options);
        })
    })
}

module.exports = gka;