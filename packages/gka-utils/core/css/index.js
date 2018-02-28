var getDelay = require('./getDelay.js');
var getDuration = require('./getDuration.js');
var getKeyFrames = require('./getKeyFrames.js');
var getName = require('./getName.js');

function getStr(len, val) {
    return Array(len).fill(val).join(', ');
}

function getKeyVal(key, val) {
    return `
    ${key}: ${val};`
}

function getInjectAnimationCSS(k) {
    var frameStr = Object.keys(k).reduce(function(_str, key, i){
        // 当前的css值
        var cur = getKeyVal(key, k[key]);
        return _str += cur;
    }, '');

    return frameStr;
}

/*
obj:
getConfig 获取每一帧的css
injectAnimationCSS 插入到animaiton中的css
*/
function getKeyframesCSS(data, opts, obj) {
    var getConfig = obj.getConfig,
        injectAnimationCSS = obj.injectAnimationCSS;

	var prefix = opts.prefix,
		frameduration = opts.frameduration;

	var frames = data.frames,
        animations = data.animations,
        keyframes = [],
        _frames = [];

    for (var key in animations) {
        _frames = animations[key].map(key => {
            return frames[key]
        });
        keyframes.push(getKeyFrames(key, _frames, data, getConfig));
    }

    var duration = getDuration(keyframes, frameduration),
        names = getName(keyframes, prefix),
        delays = getDelay(keyframes, frameduration),
        counts = keyframes.length === 1? 'infinite' : getStr(keyframes.length - 1, 1) + ', infinite',
        functions = getStr(keyframes.length, 'steps(1)'),
        modes = getStr(keyframes.length, 'forwards');

    var firstFrame = frames[0];
    
    var k = injectAnimationCSS && injectAnimationCSS(firstFrame) || {};
    var frameStr = getInjectAnimationCSS(k)

    // background-size: contain;
    var css = `.${prefix}animation {${frameStr}
    background-image: url("${'./img/' + (data.file || firstFrame.file)}");
    background-repeat: no-repeat;

    animation-name: ${names.join(', ')};
    animation-duration: ${duration.join(', ')};
    animation-delay: ${delays.join(', ')};
    animation-iteration-count: ${counts};
    
    animation-fill-mode: ${modes};
    animation-timing-function: ${functions};
}

`;

    for(var j = 0; j < names.length; j++) {
        css += `@-webkit-keyframes ${names[j]} {${keyframes[j].keyframesStr}}

`;
    }

    return css;
}

// 获得css
// example:
// var css = gkaUtils.css.getCSSText('.gka-wrap', {
//     width: `${frame.sourceW}px`,
//     height: `${frame.sourceH}px`,
// });
function getCSSText(className, obj) {
    var cssText = Object.keys(obj).reduce(function(_str, key, i){
        return _str + getKeyVal(key, obj[key])
    }, '')
  
    return `${className} {${cssText}
}

`;
}

module.exports = {
    getKeyframesCSS,
    getCSSText,
};

// module.exports = {
//     getDelay: getDelay,
//     getDuration: getDuration,
//     getKeyFrames: getKeyFrames,
//     getName: getName,
// }