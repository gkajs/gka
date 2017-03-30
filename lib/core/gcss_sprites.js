/*
* css_sprites 生成
*
*/
var fs = require('fs');
var path = require('path');

function gcss_sprites(frameDuration, coors, src2src, filepath, callback) {
    var css = "";
    var src2 = null;
    var len = Object.keys(src2src).length;
    var per = 100 / len;

    var i = 0;
    var percent = 0,
        keyframesStr = "";

    // 图片的宽高 
    var width = null,
        height = null;

    for(var src in src2src) {

        // 对应的 src 坐标
        src2 = src2src[src];

        var coor = coors[src2];

        if (!width) {
            width = coor.width,
            height = coor.height; 
        }

        percent = (i * (per)).toFixed(2);

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        background: url(${filepath}) -${coor.x}px -${coor.y}px;
    }`;

        ++i;
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

    -webkit-animation: gka_keyframes ${len * frameDuration}s steps(1) infinite;
}

@-webkit-keyframes gka_keyframes {${
    keyframesStr
}
}
`;
    
    callback && callback(css);
}

module.exports = gcss_sprites;