module.exports = getDelay;

function getDelay(keyframes, frameduration) {
    var arr = [],
        res = [];
    arr.push(0);
    res.push('0s');

    for (var i = 1, before, current; i < keyframes.length; i++) {
        before = arr[arr.length - 1];
        current = before + (Number(keyframes[i - 1].len * frameduration));
        current = Math.round(current * 100) / 100;
        arr.push(current);
        res.push(current + 's');
    }
    return res;
}