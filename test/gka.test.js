var gka = require("../lib/gka");
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var assert = require('assert');

var imgFolder = path.join(__dirname, "img4test");
var expectedDir = path.join(__dirname, 'expected');
var expectedDir_normal = path.join(expectedDir, 'gka-img4test-c-u-crop');
var expectedDir_sprites = path.join(expectedDir, 'gka-img4test-u-s-percent-prefix_');

var targetDir_normal = path.join(__dirname, 'gka-img4test-c-u-crop');
var targetDir_sprites = path.join(__dirname, 'gka-img4test-u-s-percent-prefix_');

describe('gka actual test', function () {

    before(function runFn (done) {
        // gka dir -cgr -f 0.08
        // ridding cut g duration 0.08
        gka(imgFolder, {
            // c
            // crop: true,
            // s
            // sprites: false, 
            // t 
            tiny: false,
            // r
            unique: true,
            // i
            info: true,
            // g
            tpl: "c",
            // p
            // prefix: "gka-",
            // f
            frameduration: 0.08,
        });

        setTimeout(()=>{
            done();
        }, 2000);
    });

    after(function cleanup () {
        deleteall(targetDir_normal);
    });

    it('gka-normal：gka dir -i -t c -f 0.08', function () {
        assert.deepEqual(getDirFile2Md5(expectedDir_normal), getDirFile2Md5(targetDir_normal), 'expect the same');
    });

});

describe('gka actual test', function () {

    before(function runFn (done) {
        // gka dir -sr -g pct -p gka- -a left-right
        // sprites ridding gen pct algorithm left-right prefix gka-
        gka(imgFolder, {
            // c
            // crop: false,
            // s
            // sprites: true, 
            // t 
            tiny: false,
            // r
            unique: true,
            // i
            info: true,
            // g
            tpl: "percent",
            // p
            prefix: "prefix_",
            // f
            frameduration: 0.04,
            // a
            // algorithm: "left-right",
        });

        setTimeout(()=>{
            done();
        }, 2000);
    });

    after(function cleanup () {
        deleteall(targetDir_sprites);
    });

    it('gka-sprites：gka dir  -i -t pct_s -p gka- -a left-right', function () {
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