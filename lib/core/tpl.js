/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * tpl
 */

var path  = require("path"),
	fs    = require("fs"),
    spawn = require('cross-spawn'),
    pkg   = require('../../package.json');

const _ = require('lodash')

function getNodePath (argument) {
    var ps = spawn.sync('npm', ['root', '-g'], {}),
    npmRoot = (ps && ps.stdout) ? ps.stdout.toString().replace(/[\n\t\r]/g,"") : "";
    return npmRoot;
}

module.exports = function(template) {

    if(!template) throw new Error('template required');

    // template 是函数，直接引用
    if(_.isFunction(template)) return template;

    // 内置模板，直接引用
    if(['css', 'canvas', 'svg'].indexOf(template) > -1) return require(`../tpl/${template}`);

    // 本地模板目录，直接引用支持目录index.js
    if(fs.existsSync(template)) return require(template);
    
    // 自定义模板，补齐模板名
    template = template.indexOf('gka-tpl-') > -1? template: 'gka-tpl-' + template;

    // 查找gka自带的本地 node_module 中的模板
    try {
        return require(template);
    } catch(e) {
        // console.log(e)
    }

    // 查找全局 node_module
    var npmRoot = process.env.NODE_PATH;
    try {
        fs.readdirSync(npmRoot); // NODE_PATH 无设置或设置多个值，则使用 catch 中方案
    } catch (e) {
        npmRoot = getNodePath();
    }
    
    var file = path.join(npmRoot, template);

    try {
        if (fs.existsSync(file)) {
            return require(file);
        }
    } catch (e) {
        console.log(e);
        // console.log('[warn] Can not use global gka tpls, Please check your NODE_PATH');
    }

    throw new Error(`can not find template: ${template}`);
};