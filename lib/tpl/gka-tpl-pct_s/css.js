module.exports = function css(obj, callback) {
    var frameDuration = obj.frameDuration, 
        prefix = obj.prefix;

    var info = obj.info,
        frames = info.frames,
        filepath = `./img/${info.file}`;

    var css = "",
        len = Object.keys(frames).length,
        per = 100 / (len);  // len === 2，0% 50% 100% ，确保播放 0% 和 50%

    var i = 0;
    var percent = 0,
        keyframesStr = "";

    // 图片的宽高 
    var width = null,
        height = null,
        x = 0,
        y = 0;

    var s_w = info.w;
    var s_h = info.h;

    for(var src in frames) {
        // 对应的 src 坐标
        var frame = frames[src];

        width = frame.width,
        height = frame.height; 

        var s_w_p = (s_w / width) * 100 + '%';
        var s_h_p = (s_h / height) * 100 + '%';

        var n = (0 - frame.x ) / ( width - s_w || 1) * 100 + '%' || 0;
        var m = (0 - frame.y ) / ( height - s_h || 1) * 100 + '%' || 0;

        percent = (i * (per)).toFixed(2);

        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        background-position: ${n} ${m};
    }`;

        ++i;

        if (i == len) {
            keyframesStr += `
    100%{
        background-position: ${n} ${m};
    }
`;      }
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
    background-image: url("${filepath}");

    animation-name: ${prefix}keyframes;
    animation-duration: ${len * frameDuration}s;
}

@-webkit-keyframes ${prefix}keyframes {${
    keyframesStr
}
}
`;

    callback && callback(`${prefix}gka.css`, css);
}