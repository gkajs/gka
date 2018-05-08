var path  = require("path"),
	fs    = require("fs"),
    spawn = require('cross-spawn'),
    pkg   = require('../package.json');

var gkaNodeModulesDir = path.join(__dirname, '..', 'node_modules');

gkaNodeModulesDir = fs.existsSync(gkaNodeModulesDir)? gkaNodeModulesDir: path.join(__dirname, '..', '..');

// function getNodePath (argument) {
//     var ps = spawn.sync('npm', ['root', '-g'], {}),
//     npmRoot = (ps && ps.stdout) ? ps.stdout.toString().replace(/[\n\t\r]/g,"") : "";
//     return npmRoot;
// }

function getGlobalTpls() {
    var npmRoot = process.env.NODE_PATH,
        tpls = [];

    try {
        tpls = fs.readdirSync(npmRoot); // NODE_PATH 无设置或设置多个值，则使用 catch 中方案
    } catch (e) {
        // npmRoot = getNodePath();
        npmRoot = require('global-modules');
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

let result = [];

function setTplMap(name, dir){
    let target = (dir? path.join(dir, name): name);
    if(name.indexOf("gka-tpl") > -1) {
        name = name.substring(8);
    }
    if (result.indexOf(name) === -1) {
        result.push({
            name,
            target: target
        });
    }
}

function getAllTpls() {
    const localTpls = ['css', 'canvas', 'svg'];

    localTpls.map(name => {
        setTplMap(name);
    })
    
    getPkgTpls();
    getGlobalTpls();
    
    return result;
}

module.exports = getAllTpls;