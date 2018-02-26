const path   = require('path'),
      fs     = require('fs');

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

    return output && output !== true ? output: getRealDest(path.join(dir, "..", g({
        tool: cmd === "tool",
        [path.basename(dir)]: true,
        [(fs.existsSync(template)? path.basename(template): template)]: template, // TODO 为函数时，处理？
        c: crop,
        u: unique,
        s: sprites,
        [count]: count,
        [prefix]: prefix,
        [bgcolor]: bgcolor,
        d: diff,
        sp: split,
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
   
    // support relative path
    return dir[0] === "."? path.resolve(dir): dir;
}

function getPrefix(options) {
    let {
        prefix,
    } = options;

    if (prefix && !isNaN(prefix[0])) {
        throw new Error('prefix can not start with Number');
    }

    return prefix === undefined? "": (prefix === true? "prefix": prefix);
}

// 检查模板对参数的支持情况，必要时进行重置 options
function checkTplConfig(tpl, checkListOptsDefault, options) {

    // 拿到tpl设置的config opts
    let config = tpl.config && tpl.config(checkListOptsDefault) || {},
        val;

    for(var key in checkListOptsDefault) {

        val = config[key];

        // tpl 无设置时，opt 为 checkListOptsDefault 的值
        if (val === undefined) {
            options[key] = checkListOptsDefault[key];
        }
        // 设置非 any, 且config值与用户的值设置不同时，强制为config设置的值
        else if(val !== 'any' && val !== options[key]) {
            console.log('warn...', key, options[key], val);
            options[key] = val;
        }
    }

    return options;
}

module.exports = {
    getOutput,
    getDir,
    getPrefix,
    checkTplConfig,
};
