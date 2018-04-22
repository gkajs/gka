var gka = require("../lib/gka");
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var assert = require('assert');
var execSync = require('child_process').execSync;
var expectedDir = path.join(__dirname, 'expected');

// --- config -----
// 删除生成文件
var afterDelete = true;

// 测试的方法集合
var commanderList = [
    'node ./bin/gka.js ./test/split',
    'node ./bin/gka.js ./test/split -csu',
    'node ./bin/gka.js ./test/split -t svg',
    'node ./bin/gka.js ./test/split -t svg -csu',
    'node ./bin/gka.js ./test/split -t canvas',
    'node ./bin/gka.js ./test/split -t canvas -csu',
    'node ./bin/gka.js ./test/split --split -cus -p a -t canvas -f 0.08',
    'node ./bin/gka.js ./test/retina',
    'node ./bin/gka.js ./test/mulit',
]
// -----------

for (var i = 0, commander; i < commanderList.length; i++) {
    commander = commanderList[i];
    ((commander) => {
        describe(commander, function () {
            var output = '';
            before(function runFn (done) {
                var s = execSync(`${commander} --env test`).toString();
                s.replace(/\[output dir\]: "(.*?)"/,function($0,$1){
                    output = $1;
                });
                output = path.basename(output);
                setTimeout(()=>{
                    done();
                }, 2000);
            });
            after(function cleanup () {
                console.log(output)
                afterDelete && deleteall(path.join(__dirname, output));
            });
            it(commander, function () {
                assert.deepEqual(getDirFile2Md5(path.join(expectedDir, output)), getDirFile2Md5(path.join(__dirname, output)), 'expect the same');
            });
        });
    })(commander)
}

function getFiles (dir, _files){
    _files = _files || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()){
            getFiles(name, _files);
        } else {
            _files.push(name);
        }
    }
    return _files;
}

function deleteall(path) {  
    var files = [];  
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path);  
        files.forEach(function(file, index) {  
            var curPath = path + "/" + file;  
            if(fs.statSync(curPath).isDirectory()) {
                deleteall(curPath);  
            } else {
                fs.unlinkSync(curPath);  
            }  
        });  
        fs.rmdirSync(path);  
    }  
}

function getDirFile2Md5 (dir) {
    var filepaths = getFiles(dir);
    var name2md5 = {};
    for (var i = 0, data, filepath; i < filepaths.length; i++) {
        filepath = filepaths[i];
        if (filepath.indexOf('.DS_Store') > -1) continue;

        data = fs.readFileSync(filepath);
        name2md5[path.relative(dir, filepaths[i])] = md5(data);
    }
    return name2md5;
}