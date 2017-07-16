
/*
* css 生成
*
*/

function gcss(obj, callback) {
    var frameDuration = obj.frameDuration,
        prefix = obj.prefix;

    var info = obj.info,
        frames = info.frames;

    var css = "";
    var dist = "";
    var len = Object.keys(frames).length;
    var per = 100 / (len - 1);  // per * max(i) = 100%

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
        -webkit-transform: translate(${frame.offX}px, ${frame.offY}px);
        background-image: url(img/${frame.file});
    }
`;
        ++i;

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

