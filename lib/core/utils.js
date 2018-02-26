function simpleMerge(defaultObj, obj) {
    let res = {};
    for(var key in defaultObj) {
        res[key] = defaultObj[key];
    }
    for(var key in obj) {
        res[key] = obj[key]? obj[key]: defaultObj[key]
    }
    return res;
}

module.exports = {
    simpleMerge,
};
