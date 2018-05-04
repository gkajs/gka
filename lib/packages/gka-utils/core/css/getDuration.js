module.exports = getDuration;

function getDuration(keyframes, frameduration) {
    var arr = [];
    for (var i = 0; i < keyframes.length; i++) {
        arr.push((keyframes[i].len * frameduration) + 's');
    }
    return arr;
}