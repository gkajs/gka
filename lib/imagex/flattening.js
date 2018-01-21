/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * image flattening
 */


var fs     = require("fs"),
    path   = require("path"),
    mkdirp = require('mkdirp');

module.exports = function flattening(tmpDir, src2id, keyMap, callback) {

    tmpDir = path.join(tmpDir, 'flattening');

    var j = 0,
        k = 0,
        src2idflattening = {},
        srcarr = Object.keys(src2id),
        len = srcarr.length;
    
    var src = '',
        filename = '',
        flatteningFilepath = '',
        writeStream = null;

    mkdirp(tmpDir, function (err) {
        
        for (var key in keyMap) {

            keyMap[key].map((index, i) => {
                // 重制索引
                keyMap[key][i] = k++;

                src = srcarr[index],
                filename = key !== '' ? key + '_' + path.basename(src) : path.basename(src),
                flatteningFilepath = path.join(tmpDir, filename);
                
                src2idflattening[flatteningFilepath] = src2id[src];

                writeStream = fs.createWriteStream(flatteningFilepath).on('finish', function(){
                    ++j;
                    if (j === len) {
                        // console.log(keyMap)
                        // console.log(src2idflattening)
                        console.log(' ✔ flattening done');
                        callback && callback(src2idflattening, keyMap);
                    }
                });
                fs.createReadStream(src).pipe(writeStream);
            })
        }
    })
}