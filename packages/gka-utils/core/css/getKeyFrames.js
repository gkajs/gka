module.exports = getKeyFrames;

function isEqualObj(a, b) {
  for (let key in b) if (a[key] !== b[key]) return false;
  return true;
}

function clone(a) {
    var b = {};
    for (var k in a) {
        b[k] = a[k];
    }
    return b;
}

function getFrameStr(percent, str) {
    return `
    ${percent}% {${str}
    }`;
}

function getKeyVal(key, val) {
    return `
        ${key}: ${val};`
}

function getKeyFrames(key, frames, data, getKeyframesConfig) {
    var len = frames.length,
        per = 100 / (len);  // len === 2，0% 50% 100% ，确保播放 0% 和 50%

    var beforeData = {},
        curData = {};

    var keyframesStr = frames.reduce(function(str, frame, i, frames){

        var percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        var k = getKeyframesConfig(frame, i, frames, key);

        var frameStr = Object.keys(k).reduce(function(_str, key, i){
            // 当前的css值
            var cur = getKeyVal(key, k[key]);
            curData[key] = cur;
            // 当前的css值 与 之前一直，则不需要再设置
            if (beforeData[key] === cur) return _str;
            
            return _str += cur;
        }, '')

        // 完全相同则跳过这个key
        if (!isEqualObj(beforeData, curData)) str += getFrameStr(percent, frameStr);

        // 设置100%
        if (i == len - 1) str += getFrameStr(100, frameStr) + `
`;
        
        beforeData = clone(curData);
        return str;
    }, "");

    return {
        keyframesStr: keyframesStr,
        len: len,
        key: key
    };
}