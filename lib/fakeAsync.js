module.exports = function fakeAsync(syncFn) {
    return function(opts, callback) {
        var res = syncFn(opts);
        callback(null, res);
    };
};