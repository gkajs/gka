var gka = require("../lib/gka");
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var assert = require('assert');

var expectedDir = path.join(__dirname, 'expected');

var imgFolderSplit = path.join(__dirname, "split");

var expectedDir_split = path.join(expectedDir, 'gka-split-canvas-c-u-s-a-sp');
var targetDir_split = path.join(__dirname, 'gka-split-canvas-c-u-s-a-sp');

describe('gka actual test', function () {

    before(function runFn (done) {
        gka({
            dir: imgFolderSplit,
            split: true,
            crop: true,
            unique: true,
            sprites: true, 

            template: 'canvas',
            prefix: "a",
            frameduration: 0.08,

            mini: false,
            info: false,
        });

        setTimeout(()=>{
            done();
        }, 2000);
    });

    after(function cleanup () {
        deleteall(targetDir_split);
    });

    it('gka dir --split -cus -p a -t canvas -f 0.08', function () {
        assert.deepEqual(getDirFile2Md5(expectedDir_split), getDirFile2Md5(targetDir_split), 'expect the same');
    });

});


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
    console.log(dir)
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