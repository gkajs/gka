let path   = require('path'),
    pkg    = require("../../package.json"),
    imagex = require("../imagex"),
    getTpl = require("./tpl"),
    info = require("./info"),
    adapt  = require("./adapt");

let {
    getOutput,
    getDir,
    getPrefix,
    checkTplConfig,
} = require("./optionsHelper");

let {
    simpleMerge,
} = require("./utils");

function gka(options = {}, callback) {

    let defaultOpts = {
        template: 'css',
        frameduration: 0.04,
        gkaVersion: pkg.version,
    }

    // 需要检查的opts
    let checkListOptsDefault = {
        'crop': false,
        'sprites': false,
        'diff': false,
        'split': false
    };

    options           = simpleMerge(defaultOpts, options);

    // 设置参数
    options.dir       = getDir(options);
    options.prefix    = getPrefix(options);
    options.output    = getOutput(options);
    options.imgOutput = path.join(options.output, 'img');

    // 获得当前的模板函数
    let tpl = getTpl(options.template);

    // 检查模板对参数的支持情况，必要时进行重置 options
    options = checkTplConfig(tpl, checkListOptsDefault, options);

    // 适配旧版本的使用方式
    // adaptOldVersion(options);

    // 打印参数信息
    info(options);

    imagex(options, (data) => {
        tpl(data, options, () => {
            console.log('done');
            callback && callback(data, options);
        })
    })
}

module.exports = gka;