
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

    for(var src in frames) {
        // 对应的 src 坐标

        var frame = frames[src];

        width = frame.width,
        height = frame.height; 

        percent = (i * (per)).toFixed(2);

        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        x = frame.x === 0? 0: `-${frame.x}px`;
        y = frame.y === 0? 0: `-${frame.y}px`;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        background-position: ${x} ${y};
    }`;

        ++i;

        if (i == len) {
            keyframesStr += `
    100%{
        background-position: ${x} ${y};
    }
`;      }
    }

    css += `.gka-base {
    width: ${width + "px"};
    height: ${height + "px"};

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
