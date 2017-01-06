var fs = require('fs');
var generateHTML = require("./generateHTML.js");
var path = require("path");
var mkdirp = require('mkdirp');
var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;

var mkdirpObservable = bindNodeCallback(mkdirp);

function generateKeyFramesStrSprites(coordinates, length, distDir, prefix,imgSuffix) {
    var coordinatesKeys = Object.keys(coordinates);

    var keyframesStr = '',
        percent,
        per = 100 / length,
        _index = 0;

    var one = null;

    for (var i = 0; i < coordinatesKeys.length; i++) {
        one = coordinates[coordinatesKeys[i]];

        percent = (i * (per)).toFixed(2);
        
        keyframesStr += `
            ${percent}%{
                background: url("./${prefix}${imgSuffix}") -${one.x}px -${one.y}px;
            }
        `;

    }

    return keyframesStr += `
            99.99999%{
                opacity: 1;
            }
            100%{
                opacity: 0;
            }
    `;
}

module.exports = function generateHTMLFileSprites(coordinates, prefix, distPath) {
    var coordinatesKeys = Object.keys(coordinates);
    var coordinatesLen = coordinatesKeys.length;

    var coordinatesOne = coordinates[coordinatesKeys[0]];
    var width = coordinatesOne.width;
    var height = coordinatesOne.height;

    var imgSuffix = path.extname(coordinatesKeys[0]);

    var keyframesStr = generateKeyFramesStrSprites(coordinates, coordinatesLen, 'img', prefix, imgSuffix);
    var fileStr = generateHTML(keyframesStr, (coordinatesLen * 0.04), width, height);
    
    console.log('generating html file .. ');
    try{
        mkdirpObservable(path.dirname(distPath))
        .subscribe(x => {
            fs.writeFile(distPath, fileStr, function(e){//会先清空原先的内容
                if(e) throw e;
                console.log('html file generated ✔ ');
            });
        });
    } catch(e) {
        fs.writeFile(distPath, fileStr, function(e){//会先清空原先的内容
            if(e) throw e;
            console.log('html file generated ✔ ');
        });
    }
}