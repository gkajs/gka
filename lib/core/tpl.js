/**
 * tpl entry
 */

var path = require("path"),
	fs = require("fs"),
    spawn = require('cross-spawn');

var gkaTplsDir = path.join(__dirname, '..', 'tpl');

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

function getGkaTpls() {
    var tpls = fs.readdirSync(gkaTplsDir) || [];
    tpls.filter(function(item) {
        return item.indexOf("gka-tpl") > -1;
    }).map(function(item){
        setTplMap(item, gkaTplsDir);
    });
}

function get(dir, name, type) {
    var file = path.join(dir, name, type);
    return fs.existsSync(file)? require(file): null;
}

var result = {};

function setTplMap(name, dir){
    result[name] = {
        html: get(dir, name, "html.js"),
        css: get(dir, name, "css.js"),
        js: get(dir, name, "js.js"),
        config: get(dir, name, "config.js"),
        // config: get(dir, name, "gka.json"),
        engine: get(dir, name, "index.js"),
    };
}

// 获取 gka 自带的tpl
getGkaTpls();
// 全局的 tpl 将覆盖 gka 自带的
// getGlobalTpls(); 

var tpls = Object.keys(result);

// console.log(tpls)
// console.log(result)

module.exports = result;