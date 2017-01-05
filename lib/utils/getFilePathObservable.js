var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;
var fs = require("fs");

var fakeAsync = require("../fakeAsync");
var statObservable = bindNodeCallback(fakeAsync(fs.statSync));

module.exports = function getFilePathObservable(filepath){
    return statObservable(filepath)
            .filter(stats => {
                if (stats.isDirectory()) {
                    getFilePathObservable(filepath);
                    return false;
                } else {
                    return true;
                }
            })
            .filter(stats => stats.isFile())
            .map(v => {
                return filepath;
            });
};