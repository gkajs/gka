
module.exports = function css(data, prefix, frameduration) {
    var info = data,
        frames = info.frames;
console.log(data)
    var css = "",
        dist = "",
        len = Object.keys(frames).length,
        per = 100 / (len);  // len === 2，0% 50% 100% ，确保播放 0% 和 50%

    var i = 0,
        percent = 0,
        keyframesStr = "";

    for (var src in frames) {

        var frame = frames[src];

        percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        width: ${frame.width}px;
        height: ${frame.height}px;
        transform: translate(${frame.offX}px, ${frame.offY}px);
        background-image: url("img/${frame.file}");
    }
`;
        ++i;

        if (i == len) {
            keyframesStr += `
    100%{
        width: ${frame.width}px;
        height: ${frame.height}px;
        transform: translate(${frame.offX}px, ${frame.offY}px);
        background-image: url("img/${frame.file}");
    }
`;      }
    }

    css += `.gka-wrap {
    width: ${frame.sourceW}px;
    height: ${frame.sourceH}px;
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
    animation-duration: ${len * frameduration}s;
}

@-webkit-keyframes ${prefix}keyframes {${
    keyframesStr
}
}
`;

return css;

}

