/*
* css_sprites 生成
*
*/
var fs = require('fs');
var path = require('path');

function gcss_sprites_percent(obj, callback) {
    var frameDuration = obj.frameDuration, 
        coors = obj.r.coordinates, 
        frames = obj.r.properties, 
        src2src = obj.src2src, 
        filepath = obj.sprites_path, 
        prefix = obj.prefix;

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


        var s_w = frames.width;
        var s_h = frames.height;

        var s_w_p = (s_w / width) * 100 + '%';
        var s_h_p = (s_h / height)  * 100 + '%';

        var n = (0 - coor.x ) / ( width - s_w) * 100 + '%' || 0;
        var m = (0 - coor.y ) / ( height - s_h) * 100 + '%' || 0;

        percent = (i * (per)).toFixed(2);

        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        background-position: ${n} ${m};
    }`;

        ++i;
    }

    // 暂时使用下方的百分比来保证宽高比
    // width: ${width + "px"};
    // height: ${height + "px"};

    css += `.gka-base {
    width: 100%;
    height: 0;
    padding-bottom: ${height/width * 100 + "%"};

    background-repeat: no-repeat;

    background-size: ${s_w_p} ${s_h_p};

    animation-timing-function: steps(1);
    animation-fill-mode: forwards;

    animation-iteration-count: infinite;

    /* 只播放一次，播放停止到最后一帧*/
    /* animation-iteration-count: 1; */ 
}

`;

    css += `.${prefix}animation {
    background-image: url(${filepath});

    animation-name: ${prefix}keyframes;
    animation-duration: ${len * frameDuration}s;
}

@-webkit-keyframes ${prefix}keyframes {${
    keyframesStr
}
}
`;

    callback && callback(`${prefix}gka_sprites_percent.css`, css);
}

module.exports = gcss_sprites_percent;