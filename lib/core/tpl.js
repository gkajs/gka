/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

/**
 * tpl
 */

var path = require("path"),
	fs = require("fs"),
    spawn = require('cross-spawn'),
    pkg = require('../../package.json');

var gkaNodeModulesDir = path.join(__dirname, '..', '..', 'node_modules');

function getNodePath (argument) {
    var ps = spawn.sync('npm', ['root', '-g'], {}),
    npmRoot = (ps && ps.stdout) ? ps.stdout.toString().replace(/[\n\t\r]/g,"") : "";
    return npmRoot;
}

function getGlobalTpls() {
    var npmRoot = process.env.NODE_PATH || getNodePath() || ''

    var tpls = fs.readdirSync(npmRoot) || [];
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

// function getGkaTpls() {
//     var gkaTplsDir = path.join(__dirname, '..', 'tpl');
//     var tpls = fs.readdirSync(gkaTplsDir) || [];
//     tpls.filter(function(item) {
//         return item.indexOf("gka-tpl") > -1;
//     }).map(function(item){
//         setTplMap(item, gkaTplsDir);
//     });
// }

// 获取 gka 自带的tpl
// getGkaTpls();

module.exports = function() {

    getPkgTpls();
    
    // 全局的 tpl 将覆盖 gka 自带的
    getGlobalTpls(); 

    // var tpls = Object.keys(result);

    // console.log(tpls)
    // console.log(result)

    return result;
};