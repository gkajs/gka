module.exports = getKeyFrames;

function isEqualObj(a, b) {
  for (let key in b) if (a[key] !== b[key]) return false;
  return true;
}

function getKeyFrames(key, frames, data) {
    var len = frames.length,
        per = 100 / (len);  // len === 2，0% 50% 100% ，确保播放 0% 和 50%

    var beforeData = {},
        curData = {},
        filepath = "";

    var keyframesStr = frames.reduce(function(str, frame, i, frames){

        var percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        var x = frame.x === 0? 0: `-${frame.x}px`,
            y = frame.y === 0? 0: `-${frame.y}px`,
            width = frame.width,
            height = frame.height,
            offX = frame.offX,
            offY = frame.offY,

        filepath = './img/' + (data.file || frame.file);

        curData = {
            filepath: filepath,
            x: x,
            y: y,
            width: width,
            height: height,
            offX: offX,
            offY: offY
        }

        if (isEqualObj(beforeData, curData)) return str;

        if (beforeData['filepath'] === filepath) {
            str += `
    ${percent}% {
        width: ${width}px;
        height: ${height}px;
        transform: translate(${offX}px, ${offY}px);
        background-position: ${x} ${y};
    }`;
        } else {
            str += `
    ${percent}% {
        width: ${width}px;
        height: ${height}px;
        transform: translate(${offX}px, ${offY}px);
        background-image: url("${filepath}");
        background-position: ${x} ${y};
    }`;
        }
        
        if (i == len - 1) {
            str += `
    100% {
        width: ${width}px;
        height: ${height}px;
        transform: translate(${offX}px, ${offY}px);
        background-position: ${x} ${y};
    }
`;      }

        beforeData = curData;
        return str;
    }, "");

    return {
        keyframesStr: keyframesStr,
        len: len,
        key: key
    };
}