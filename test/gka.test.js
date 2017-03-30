var gka = require("../lib/gka");
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var assert = require('assert');

var imgFolder = path.join(__dirname, "img4test");
var expectedDir = path.join(__dirname, 'expected');
var expectedDir_normal = path.join(expectedDir, 'img4test-gka');
var expectedDir_sprites = path.join(expectedDir, 'img4test-gka-sprites');

var targetDir_normal = path.join(__dirname, 'img4test-gka');
var targetDir_sprites = path.join(__dirname, 'img4test-gka-sprites');

describe('gka actual test', function () {

     before(function runFn (done) {
        // gka - normal model
        gka({
            dir: imgFolder,
            prefix: "gka-",
            type: "normal"
        });

        // gka - sprites model
        gka({
            dir: imgFolder,
            prefix: "gka-",
            type: "sprites"
        });

        setTimeout(()=>{
            done();
        }, 12000);
    });

    after(function cleanup () {
        deleteall(targetDir_normal);
        deleteall(targetDir_sprites);
    });

    it('gka-normal：gka -d dir -p gka', function () {
        assert.deepEqual(getDirFile2Md5(expectedDir_normal), getDirFile2Md5(targetDir_normal), 'expect the same');
    });

    it('gka-sprites：gka -d dir -p gka -s true', function () {
        assert.deepEqual(getDirFile2Md5(expectedDir_sprites), getDirFile2Md5(targetDir_sprites), 'expect the same');
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
    var filepaths = getFiles(dir);
    var name2md5 = {};
    for (var i = 0, data, filepath; i < filepaths.length; i++) {
        filepath = filepaths[i];
        data = fs.readFileSync(filepath);
        name2md5[path.relative(dir, filepaths[i])] = md5(data);
    }
    return name2md5;
}