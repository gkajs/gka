var gka = require("../lib/gka");
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var assert = require('assert');
var execSync = require('child_process').execSync;
var expectedDir = path.join(__dirname, 'expected');
// var expectedDir = path.join(__dirname, 'expected-win');

// --- config -----
// 删除生成文件
var afterDelete = true;

// 测试的方法集合
var commanderMap = [
    {
        commander: 'node ./bin/gka.js ./test/split',
        expected: 'gka-split-css',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -csu',
        expected: 'gka-split-css-c-u-s',
    },
    {
        commander: 'node ./bin/gka.js ./test/retina',
        expected: 'gka-retina-css',
    },
    {
        commander: 'node ./bin/gka.js ./test/mulit',
        expected: 'gka-mulit-css',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t svg',
        expected: 'gka-split-svg',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t svg -csu',
        expected: 'gka-split-svg-c-u-s',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t canvas',
        expected: 'gka-split-canvas',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t canvas -csu',
        expected: 'gka-split-canvas-c-u-s',
    },
    {
        commander: 'node ./bin/gka.js ./test/diff -t canvas --diff',
        expected: 'gka-diff-canvas-d',
    },
    {
        commander: 'node ./bin/gka.js ./test/split --split -cus -p a -t canvas -f 0.08',
        expected: 'gka-split-canvas-c-u-s-a-sp',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t percent -su',
        expected: 'gka-split-percent-u-s',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t studiojs -csu',
        expected: 'gka-split-studiojs-c-u-s',
    },
    {
        commander: 'node ./bin/gka.js ./test/split -t createjs -csu',
        expected: 'gka-split-createjs-c-u-s',
    },
]
// -----------

commanderMap.map(({commander, expected}) => {
    describe(commander, function () {
        var output = '';
        before(function runFn (done) {
            execSync(`${commander} --env test`).toString();
            setTimeout(()=>{
                done();
            }, 2000);
        });
        after(function cleanup () {
            afterDelete && deleteall(path.join(__dirname, expected));
        });
        it(commander, function () {
            console.log(path.join(expectedDir, expected))
            assert.deepEqual(getDirFile2Md5(path.join(expectedDir, expected)), getDirFile2Md5(path.join(__dirname, expected)), 'expect the same');
        });
    });
})

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