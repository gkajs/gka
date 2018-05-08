var deleteKeyMap = {
    'background-position': ['0px 0px', '0% 0%'],
    'transform': ['translate(0px, 0px)'],
    'margin-left': ['0px'],
    'border-top': ['0px solid transparent'],
}

function createKeyframeCSS (frames, name) {
    var len = frames.length, per = 100 / len;
    var css = '@keyframes ' + name + ' {'
    css += frames.reduce(function(str, frame, i, frames) {
        var percent = i === 0? 0: (i * (per)).toFixed(2)
        var _css = ''
        for(var key in frame) {
            // 0% 时，去掉 deleteKeyMap 匹配到的css
            // 其他percent，去掉跟上一个重复的css
            if ((i === 0 && (!deleteKeyMap[key] || (deleteKeyMap[key] && !~deleteKeyMap[key].indexOf(frame[key]))))
                || (i !== 0 && (frame[key] !== frames[i-1][key]))
            ) {
                _css += key + ':' + frame[key] + ';'
            }
        }
        if (i === frames.length - 1)
        return str + (_css? percent + '%, 100% {' + _css + '}': '');

        return str + (_css? percent + '% {' + _css + '}': '');
    }, '')
    css += '}'
    
    return css
}

function keyframesAnimationCSS(data, opts, {toFrameCSSObject}) {
    let {
        prefix,
        frameduration,
    } = opts;

    let {
        frames,
        animations,
        ratio,
        file,
    } = data;

    let keyframecss = '';

    let names = [], durations = [], delays = [];
    let firstFrameCSS = '';

    for (let name in animations) {
        let _framesObject = animations[name].map(i => toFrameCSSObject(frames[i], ratio));
        
        if (!firstFrameCSS) {
            for(let key in _framesObject[0]) {
                if (!deleteKeyMap[key] || (deleteKeyMap[key] && !~deleteKeyMap[key].indexOf(_framesObject[0][key])))
                    firstFrameCSS += `${key}: ${_framesObject[0][key]};`
            }
        }

        let keyframeName = prefix + 'keyframes' + (name !== '' ? '-' + name: '');
        keyframecss += createKeyframeCSS(_framesObject, keyframeName);
        
        let len = _framesObject.length;
        names.push(keyframeName);
        delays.push((delays[delays.length - 1] || 0) + (durations[durations.length - 1] || 0))
        durations.push(len * frameduration)
    }

    let css = `
        .${prefix}animation {
            ${firstFrameCSS}
            background-repeat: ${names.map(n => 'no-repeat').join(', ')};
            animation-name: ${names.join(', ')};
            animation-duration: ${durations.map(d => d + 's').join(', ')};
            animation-delay: ${delays.map(d => d + 's').join(', ')};
            animation-iteration-count: ${names.map((n,i) => {
                if(names.length === 1) return 'infinite'
                if(i === 0) return 1;
                return 'infinite';
            }).join(', ')};
            animation-fill-mode: ${names.map(n => 'forwards').join(', ')};
            animation-timing-function: ${names.map(n => 'steps(1)').join(', ')};
        }`;
    css += keyframecss;
    return css;
}

// 获得css
// example:
// var css = gkaUtils.css.getCSSText('.gka-wrap', {
//     width: `${frame.sourceW}px`,
//     height: `${frame.sourceH}px`,
// });

function getKeyVal(key, val) {
    return `${key}: ${val};`
}

function getCSSText(className, obj) {
    var cssText = Object.keys(obj).reduce(function(_str, key, i){
        return _str + getKeyVal(key, obj[key])
    }, '')
  
    return `${className} {${cssText}
}`;
}

module.exports = {
    keyframesAnimationCSS,
    getCSSText,
};