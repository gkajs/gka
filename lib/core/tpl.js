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

var gkaNodeModulesDir = path.join(__dirname, '..', '..', 'node_modules');

gkaNodeModulesDir = fs.existsSync(gkaNodeModulesDir)? gkaNodeModulesDir: path.join(__dirname, '..', '..', '..');

function getNodePath (argument) {
    var ps = spawn.sync('npm', ['root', '-g'], {}),
    npmRoot = (ps && ps.stdout) ? ps.stdout.toString().replace(/[\n\t\r]/g,"") : "";
    return npmRoot;
}

function getGlobalTpls() {
    var npmRoot = process.env.NODE_PATH,
        tpls = [];

    try {
        tpls = fs.readdirSync(npmRoot); // NODE_PATH 无设置或设置多个值，则使用 catch 中方案
    } catch (e) {
        npmRoot = getNodePath();
        try {
            tpls = fs.readdirSync(npmRoot);
        } catch (e) {
            console.log('');
            console.log('[warn] Can not use global gka tpls, Please check your NODE_PATH')
        }
    }
    
    tpls.filter(function(item) {
        return item.indexOf("gka-tpl") > -1;
    }).map(function(item){
        setTplMap(item, npmRoot);
    });
}

function getPkgTpls() {
    var dependencies = Object.keys(pkg.dependencies);
    dependencies.filter(function(item) {
        return item.indexOf("gka-tpl") > -1;
    }).map(function(item){
        setTplMap(item, gkaNodeModulesDir);
    });
}

function get(dir, name, type) {
    var file = path.join(dir, name, type);
    return fs.existsSync(file)? require(file): null;
}

var result = {};

function setTplMap(name, dir){
    result[name] = {
        config: get(dir, name, "gka.config.js"),
        engine: get(dir, name, "index.js"),
    };
}

function isFunction(value) {
    return false;
}

function getGlobalNodeModule(name) {

}

module.exports = function(template) {

    if(!template) throw new Error('template required');

    // template 是函数，直接引用
    if(isFunction(template)) return template;

    // 内置模板，直接引用
    if(['css', 'canvas', 'svg'].indexOf(template) > -1) return require(`../tpl/${template}`);

    // 本地目录，直接引用支持单文件和目录index.js
    if(fs.existsSync(template)) return require(template);
    
    template = template.indexOf('gka-tpl-') > -1? template: 'gka-tpl-' + template;

    // 查找本地 node_module
    try {
        return require(template);
    } catch(e) {
    }

    // 查找全局 node_module
    try {
        return getGlobalNodeModule(template);
    } catch(e) {
        
    }

    throw new Error('can not find template', template);
};