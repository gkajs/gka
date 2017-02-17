var fs = require('fs');
var generateHTML = require("./generateHTML.js");
var path = require("path");
var mkdirp = require('mkdirp');
var Rx = require('rxjs');
var bindNodeCallback = Rx.Observable.bindNodeCallback;

var mkdirpObservable = bindNodeCallback(mkdirp);

function generateKeyFramesStrSprites(coordinates, length, distDir, prefix, imgSuffix, src2srcMap) {
    console.log('src2srcMap')
    var srcKeys = Object.keys(src2srcMap);
    var srcLen = srcKeys.length;
    // console.log(srcKeys)
    try {
        srcKeys.sort(function(a, b){
            return (parseInt(a.match(/([0-9])*\./ig)[0].replace(/\./, "")) - parseInt(b.match(/([0-9])*\./ig)[0].replace(/\./, "")))
        });
    } catch(e) {
        console.log(e)  
    }
    console.log(srcKeys)
    // console.log(src2srcMap)
    var coordinatesKeys = Object.keys(coordinates);

    var keyframesStr = '',
        percent,
        per = 100 / srcLen,
        _index = 0;

    var one = null;

    for (var i = 0; i < srcLen; i++) {
        console.log(srcKeys[i])
        one = coordinates[src2srcMap[srcKeys[i]]];

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

module.exports = function generateHTMLFileSprites(coordinates, prefix, distPath, src2srcMap) {
    var coordinatesKeys = Object.keys(coordinates);
    var coordinatesLen = coordinatesKeys.length;
    var srcKeys = Object.keys(src2srcMap);
    var srcLen = srcKeys.length;
    
    var coordinatesOne = coordinates[coordinatesKeys[0]];
    var width = coordinatesOne.width;
    var height = coordinatesOne.height;

    var imgSuffix = path.extname(coordinatesKeys[0]);

    var keyframesStr = generateKeyFramesStrSprites(coordinates, srcLen, 'img', prefix, imgSuffix, src2srcMap);
    var fileStr = generateHTML(keyframesStr, (srcLen * 0.04), width, height);
    
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