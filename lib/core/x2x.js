/*
* 将 src2id 生成
* 指向最终地址
*
*/

// (num, length) (1,3)  => 001;
function addZero (num, length) {
    return new Array(length - String(num).length + 1).join("0") + num;
}

function x2x(src2id, prefix){
    var i = 0;
    var id = 0;
    var len = Object.keys(src2id).length;
    var dist = null;

    var src2distid = {},
        distids = [],
        src2src = {},
        srcs = [];

    var tmp_src2distid = {};
    var tmp_src2src = {};

    // 产生新的文件路径
    for(var src in src2id) {

        id = src2id[src];

        // 最终生成的id
        distid = addZero(i, len);

        // 相同 id 的则指向了同一个 dist
        if (tmp_src2distid[id] !== undefined) {
            src2distid[src] = tmp_src2distid[id];
        } else {
            ++i;

            tmp_src2distid[id] = i;
            src2distid[src] = i;
            distids.push(i);
        }

        // 相同 id 的，指向同一个 src
        if (tmp_src2src[id] !== undefined) {
            src2src[src] = tmp_src2src[id];
        } else {
            tmp_src2src[id] = src;
            src2src[src] = src;

            srcs.push(src);
        }
    }

    return {
        src2distid: src2distid,
        distids: distids,
        src2src: src2src,
        srcs: srcs
    };
}

module.exports = x2x;