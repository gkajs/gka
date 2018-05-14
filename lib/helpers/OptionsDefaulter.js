/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const pkg = require("../../package.json");

const defaultOptions = {
    template: 'css',
    frameduration: 0.04,
    gkaVersion: pkg.version,
}

module.exports = class GkaOptionsDefaulter {
	constructor() {
    }
    process(options) {
        options = _.merge(defaultOptions, options)
        // check and reset options
        options = checkOptions(options);

        return options;
    }
}

function getOutput(options) {
    let {
        cmd,
        dir,
        output,
        unique,
        crop,
        sprites,
        spritesCount,
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
            if (obj[key]) res += `-${key}`;
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
        [spritesCount]: spritesCount,
        [prefix]: prefix,
        [bgcolor]: bgcolor,
        d: diff,
        sp: split,
        [ratio + 'x']: ratio > 1,
    })));
}

function getDir(options) {
    let {dir} = options;

    if (!dir) throw new Error('dir required');

    // support relative path
    let dir2 = dir[0] === "."? path.resolve(dir): dir;

    if (!fs.existsSync(dir2)) throw new Error('can not find dir: ' + dir);

    return dir2;
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

function getImgOutput(options) {
    return path.join(options.output, 'img');
}

function checkOptions(options) {

    // check and set options
    options.dir       = getDir(options);
    options.prefix    = getPrefix(options);
    options.output    = getOutput(options);
    options.imgOutput = getImgOutput(options);

    return options;
}