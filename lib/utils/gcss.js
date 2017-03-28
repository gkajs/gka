var path = require("path");
var fs = require('fs');
var ghtml = require("./ghtml.js");
var sizeOf = require('image-size');

function gkeyframes(length, distDir, prefix, nameMap) {
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
        background-image: url("./${distDir}/${nameMap[prefix + _index + ".png"]}");
    }
`;
    }
    // background-image: url("./${distDir}/${prefix}${_index}${".png"}");
    
    keyframesStr += `
    99.99999%{
        opacity: 1;
    }

    100%{
        opacity: 0;
    }`;
    return keyframesStr;
}

module.exports =  function gcss(length, filepath, prefix, dest, nameMap) {
    var dimensions = sizeOf(filepath);
    var width = dimensions.width,
        height = dimensions.height;

    var keyframesStr = gkeyframes(length, 'img', prefix, nameMap);

    var  str = `.gka-animation {
    width: ${width + "px"};
    height: ${height + "px"};

    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;;

    -webkit-animation: gka_keyframes ${length * 0.04}s steps(1) infinite;
}

@-webkit-keyframes gka_keyframes {${
    keyframesStr
}
}
`;
    /*-webkit-animation: animation ${animationTime}s  steps(1);*/

    // generate gka.css
    fs.writeFile(path.join(dest, "gka.css"), str, function(e){//会先清空原先的内容
        if(e) throw e;
        console.log('gka.css generated ✔ ');
    });

    // generate gka.html
    fs.writeFile(path.join(dest, "gka.html"), ghtml(), function(e){//会先清空原先的内容
        if(e) throw e;
        console.log('gka.html generated ✔ ');
    });
}