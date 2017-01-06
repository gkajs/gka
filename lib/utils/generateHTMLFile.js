var fs = require('fs');
var generateHTML = require("./generateHTML.js");
var sizeOf = require('image-size');

function generateKeyFramesStr(length, distDir, prefix) {
    var keyframesStr = '',
        percent,
        per = 100 / length,
        _index = 0;

    var begin = 1;

    for(var i = 0; i < length; i++){
        percent = (i * (per)).toFixed(2);
        _index = begin + i;
        _index = _index >= _index>= 100? _index: _index >= 10? ("0" + _index): "00" + _index;
        keyframesStr += `
            ${percent}%{
                background-image: url("./${distDir}/${prefix}${_index}${".png"}");
            }
        `;
    }
    keyframesStr += `
            99.99999%{
                opacity: 1;
            }
            100%{
                opacity: 0;
            }
    `;
    return keyframesStr;
}

module.exports =  function generateHTMLFile(length, filepath, prefix, distPath) {
    var dimensions = sizeOf(filepath);
    var width = dimensions.width,
        height = dimensions.height;

    var keyframesStr = generateKeyFramesStr(length, 'img', prefix);
    var fileStr = generateHTML(keyframesStr, (length * 0.04), width, height);
    console.log('generating html file .. ');
    fs.writeFile(distPath, fileStr, function(e){//会先清空原先的内容
        if(e) throw e;
        console.log('html file generated ✔ ');
    });
}