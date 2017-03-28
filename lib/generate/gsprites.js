var fs = require('fs');
var path = require("path");
var mkdirp = require('mkdirp');
var Rx = require('rxjs');

var bindNodeCallback = Rx.Observable.bindNodeCallback;

var mkdirpObservable = bindNodeCallback(mkdirp);

var ghtml = require("./ghtml.js");

function generateKeyFramesStrSprites(coordinates, length, distDir, prefix, imgSuffix, src2srcMap) {
    var srcKeys = Object.keys(src2srcMap);
    var srcLen = srcKeys.length;

    try {
        srcKeys.sort(function(a, b){
            return (parseInt(a.match(/([0-9])*\./ig)[0].replace(/\./, "")) - parseInt(b.match(/([0-9])*\./ig)[0].replace(/\./, "")))
        });
    } catch(e) {
        console.log(e)  
    }
    // console.log(srcKeys, src2srcMap);

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
        background: url("./${prefix}-sprites${imgSuffix}") -${one.x}px -${one.y}px;
    }`;
    }

    return keyframesStr += `
    99.99999%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }`;
}

module.exports = function gsprites(coordinates, prefix, dest, src2srcMap) {
    var coordinatesKeys = Object.keys(coordinates);
    var coordinatesLen = coordinatesKeys.length;
    var srcKeys = Object.keys(src2srcMap);
    var srcLen = srcKeys.length;
    
    var coordinatesOne = coordinates[coordinatesKeys[0]];
    var width = coordinatesOne.width;
    var height = coordinatesOne.height;
    var imgSuffix = path.extname(coordinatesKeys[0]);

    var keyframesStr = generateKeyFramesStrSprites(coordinates, srcLen, 'img', prefix, imgSuffix, src2srcMap);

    var  str = `.gka-animation {
    width: ${width + "px"};
    height: ${height + "px"};

    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;;

    -webkit-animation: gka_keyframes ${srcLen * 0.04}s steps(1) infinite;
}

@-webkit-keyframes gka_keyframes {${
    keyframesStr
}
}
`;

    // generate gka.css
    fs.writeFile(path.join(dest, "gka.css"), str, function(e){
        if(e) throw e;
        console.log('gka.css generated ✔ ');
    });


    // console.log('generating html file .. ');
    // try{
    //     mkdirpObservable(dest)
    //     .subscribe(x => {
    //         ghtml(dest);
    //     });
    // } catch(e) {
    //     ghtml(dest);
    // }
};