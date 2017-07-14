
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

function gcss(obj, callback) {
    var frameDuration = obj.frameDuration,
        src2dist = obj.src2dist,
        src2distrelative = obj.src2distrelative,
        dist2info = obj.dist2info,
        prefix = obj.prefix;

    var css = "";
    var dist = "";
    var len = Object.keys(src2distrelative).length;
    var per = 100 / (len - 1);  // per * max(i) = 100%

    // 图片的宽高 
    var width = "",
        height = "",
        info = {};

    var i = 0,
        percent = 0,
        keyframesStr = "";

    for (var src in src2distrelative) {
        if (!width) {
            var d = sizeOf(src);
            width = d.width,
            height = d.height; 
        }

        // 指向的地址
        dist = src2distrelative[src];

        var z = src2dist[src];
        info = dist2info[z];

        // console.log(dist2info)
        // console.log(dist)
        // console.log(info)
        percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        width: ${info.width}px;
        height: ${info.height}px;
        transform: translate(${info.left}px, ${info.top}px);
        background-image: url("${fixpath(dist)}");
    }
`;
        ++i;

    }

    css += `.gka-wrap {
    width: ${info.origin.width}px;
    height: ${info.origin.height}px;
}

`;

    css += `.gka-base {
   
    background-repeat: no-repeat;
    background-position: center center;
    
    /* background-size: contain;*/
    
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    
    animation-timing-function: steps(1);

    /* 只播放一次，播放停止到最后一帧*/
    /* animation-iteration-count: 1; */ 
}

`;

    css += `.${prefix}animation {
    animation-name: ${prefix}keyframes;
    animation-duration: ${len * frameDuration}s;
}

@-webkit-keyframes ${prefix}keyframes {${
    keyframesStr
}
}
`;

    callback && callback(`${prefix}gka_cut.css`, css);
}

module.exports = gcss;

