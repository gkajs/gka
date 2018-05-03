/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const pkg = require("../../package.json")

const defaultOptions = {
    template: 'css',
    frameduration: 0.04,
    gkaVersion: pkg.version,
}

class GkaOptionsDefaulter {
	constructor() {
    }
    process(options) {
        options = _.merge(defaultOptions, options)
        // check and reset options
        options = checkOptions(options);

        return options;
    }
}
module.exports = GkaOptionsDefaulter;

// 获得当前的模板函数
// let tpl = getTpl(options.template);

// 检查模板对参数的支持情况，必要时进行重置 options
// options = checkTplConfig(tpl, checkListOptsDefault, options);

// 针对tpl的参数支持情况，需要检查的opts
// const checkListOptsDefault = {
//     'crop': false,
//     'sprites': false,
//     'diff': false,
//     'split': false
// }

function getOutput(options) {
    let {
        cmd,
        dir,
        output,
        unique,
        crop,
        sprites,
        count,
        bgcolor,
        prefix,
        diff,
        split,
        template,
        ratio,
    } = options;

    function g(obj) {
        let res = 'gka';
        for(let key in obj) {
            if (obj[key]) {
                res += `-${key}`;
            }
        }
        return res;
    }

    function getRealDest(dest) {
        var i = 0;
        function gDest(p) {
            if (fs.existsSync(p)) {
                ++i;
                return gDest(dest + '-' + i);
            } else {
                return p;
            }
        }
        return gDest(dest);
    }

    let templateName = template;

    // if template is path
    if (fs.existsSync(template)) {
        templateName = path.basename(template);
        if(templateName.indexOf("gka-tpl") > -1) {
            templateName = templateName.substring(8);
        }
    } else if (_.isFunction(template)) {
        templateName = 'function';
    }

    return output && output !== true ? output: getRealDest(path.join(dir, "..", g({
        tool: cmd === "tool",
        [path.basename(dir)]: true,
        [templateName]: template,
        c: crop,
        u: unique,
        s: sprites,
        [count]: count,
        [prefix]: prefix,
        [bgcolor]: bgcolor,
        d: diff,
        sp: split,
        [ratio + 'x']: ratio > 1,
    })));
}

function getDir(options) {
    let {
        dir,
    } = options;

    // 检查图片目录
    if (!dir) {
        throw new Error('dir required');
    }

    let dir2 = dir[0] === "."? path.resolve(dir): dir;

    if (!fs.existsSync(dir2)) {
        throw new Error('can not find dir: ' + dir);
    }

    // support relative path
    return dir2;
}

function getPrefix(options) {
    let {
        prefix,
    } = options;

    if (prefix && !isNaN(prefix[0])) {
        throw new Error('prefix can not start with Number');
    }

        // if (prefix === true) {
        //     throw new Error('prefix value required');
        // }
        return prefix === undefined? "": (prefix === true? "prefix": prefix);
    }

    function getImgOutput(options) {
        return path.join(options.output, 'img');
    }

// 检查模板对参数的支持情况，必要时进行重置 options
/*  模板config含义：
不设置时，为gka设置的默认值
设置为 any 时，为用户设置的值
设置非 any 时，强制为config设置的值
*/
function checkTplConfig(tpl, checkListOptsDefault, options) {

    // 拿到tpl设置的config opts
    let config = tpl.config && tpl.config(checkListOptsDefault) || {},
        val;

    for(var key in checkListOptsDefault) {

        val = config[key];

        // tpl 无设置时，opt 为 checkListOptsDefault 的值
        if (val === undefined) {
            if (options[key]) {
                console.log(`[template setting] set ${key} ${checkListOptsDefault[key]}`);
            }
            options[key] = checkListOptsDefault[key];
        }
        // 设置非 any, 且config值与用户的值设置不同时，强制为config设置的值
        else if(val !== 'any' && val !== options[key]) {
            console.log(`[template setting] set ${key} ${val}`);
            options[key] = val;
        }
    }

    return options;
}

function checkOptions(options) {
    // 设置参数
    options.dir       = getDir(options);
    options.prefix    = getPrefix(options);
    options.output    = getOutput(options);
    options.imgOutput = getImgOutput(options);

    return options;
}
