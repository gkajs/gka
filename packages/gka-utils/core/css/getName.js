module.exports = getName;

function getName(keyframes, prefix) {
    var arr = [];
    for (var i = 0, key; i < keyframes.length; i++) {
        key = keyframes[i].key;
        var name = prefix + 'keyframes' + (key !== '' ? '-' + key: '');
        arr.push(name);
    }
    return arr;
}