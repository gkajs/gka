const pluginIn = plugins => plugins.filter(plugin => plugin[0]).map(plugin => plugin[1])

const pluginCompose = (...funcs) => {
    function run(data, callback, i = 0) {
        funcs[i].apply(data, _data => {
            if (i === funcs.length - 1) {
                callback(_data);
            } else {
                run(_data, callback, ++i)
            }
        })
    }
    return (data, callback) => run(data, callback)
}

module.exports = {
    pluginIn,
    pluginCompose,
};