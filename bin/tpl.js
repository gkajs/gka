var path  = require("path"),
	fs    = require("fs"),
    spawn = require('cross-spawn'),
    pkg   = require('../package.json');

var gkaNodeModulesDir = path.join(__dirname, '..', 'node_modules');

gkaNodeModulesDir = fs.existsSync(gkaNodeModulesDir)? gkaNodeModulesDir: path.join(__dirname, '..', '..');

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

// var result = {};

// function setTplMap(name, dir){
//     result[name] = get(dir, name, "index.js");
// }

var result = [];

function setTplMap(name){
    if (result.indexOf(name) === -1) {
        result.push(name);
    }
}

function getAllTpls() {

    var localTpls = ['css', 'canvas', 'svg'];
    result.concat(localTpls);

    getPkgTpls();
    getGlobalTpls();
    
    return result;
}

module.exports = getAllTpls;