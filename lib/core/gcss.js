/*
* css 生成
*
*/

var sizeOf = require('image-size');
var fs = require('fs');
var path = require('path');

function fixpath(dist) {
  return dist.replace(/\\/, "/");
}

function gcss(src2dist, callback) {
    var css = "";
    var dist = null;
    var len = Object.keys(src2dist).length;
    var per = 100 / len;

    // 图片的宽高 
    var width = null,
        height = null;

    var i = 0;
    var percent = 0,
        keyframesStr = "";

    for (var src in src2dist) {
        if (!width) {
            var d = sizeOf(src);
            width = d.width,
            height = d.height; 
        }

        // 生成 keyframes
        i++;

        // 指向的地址
        dist = src2dist[src];

        percent = (i * (per)).toFixed(2);

        keyframesStr += `
    ${percent}%{
        background-image: url("${fixpath(dist)}");
    }
`;
    }

    keyframesStr += `
    99.99999%{
        opacity: 1;
    }

    100%{
        opacity: 0;
    }`;

    css = `.gka-animation {
    width: ${width + "px"};
    height: ${height + "px"};

    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;;

    -webkit-animation: gka_keyframes ${len * 0.04}s steps(1) infinite;
}

@-webkit-keyframes gka_keyframes {${
    keyframesStr
}
}
`;
    callback && callback(css);
}

module.exports = gcss;

