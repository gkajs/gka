/*
* css_sprites 生成
*
*/
var fs = require('fs');
var path = require('path');

function gcss_sprites(frameDuration, coors, src2src, filepath, prefix, callback) {
    var css = "";
    var src2 = null;
    var len = Object.keys(src2src).length;
    var per = 100 / (len - 1);  // per * max(i) = 100%

    var i = 0;
    var percent = 0,
        keyframesStr = "";

    // 图片的宽高 
    var width = null,
        height = null,
        x = 0,
        y = 0;

    for(var src in src2src) {

        // 对应的 src 坐标
        src2 = src2src[src];

        var coor = coors[src2];

        if (!width) {
            width = coor.width,
            height = coor.height; 
        }

        percent = (i * (per)).toFixed(2);

        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        x = coor.x === 0? 0: `-${coor.x}px`;
        y = coor.y === 0? 0: `-${coor.y}px`;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        background-position: ${x} ${y};
    }`;

        ++i;
    }

    css += `.gka-animation {
    width: ${width + "px"};
    height: ${height + "px"};

    background-image: url(${filepath});
    background-repeat: no-repeat;

    /* background-size: contain;*/

    animation-timing-function: steps(1);
    animation-fill-mode: forwards;

    animation-iteration-count: infinite;

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

    callback && callback(css);
}

module.exports = gcss_sprites;