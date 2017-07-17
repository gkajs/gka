module.exports = function css(obj, callback) {
    var frameDuration = obj.frameDuration,
        prefix = obj.prefix;

    var info = obj.info,
        frames = info.frames;

    var css = "";
    var dist = "";
    var len = Object.keys(frames).length;
    var per = 100 / (len - 1);  // per * max(i) = 100%

    // 图片的宽高 
    var width = "",
        height = "";

    var i = 0,
        percent = 0,
        keyframesStr = "";

    for (var src in frames) {
        var frame = frames[src];
        width = frame.width,
        height = frame.height; 

        // 指向的地址
        dist = frame.file;

        percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        background-image: url(img/${dist});
    }
`;
        ++i;

    }

    css += `.gka-base {
    width: ${width + "px"};
    height: ${height + "px"};

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

    callback && callback(`${prefix}gka.css`, css);
}