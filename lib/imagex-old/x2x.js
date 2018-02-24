/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * output more info
 */

var path = require("path");

function getdists(ids, src2distid, dest, prefix, suffix) {
    var filename = 0;
    return ids.map(id => {

        filename = (prefix + "-" + id + suffix);

        if (!prefix) {
            for(var src in src2distid){
                if (id === src2distid[src]) {
                    filename = path.basename(src);
                    break; // get the first filename and break
                }
            }
        }
        
        return path.join(dest, filename);
    });
}

function getsrc2dist(src2distid, src2src, dest, prefix, suffix) {
    var src2dist = {}, filename;
    
    for(var src in src2distid) {
        filename = prefix? (prefix + "-" + src2distid[src] + suffix): path.basename(src2src[src]);
        src2dist[src] = path.join(dest, filename);
    }
    
    return src2dist;
}

// (num, length) (1,3)  => 001;
// function addZero (num, length) {
//     return new Array(length - String(num).length + 1).join("0") + num;
// }

function x2x(src2id, suffix, dest, prefix, isSprites, callback){
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

    for(var src in src2id) {

        id = src2id[src];

        // 最终生成的id
        // distid = addZero(i, len);

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

    var dists = getdists(distids, src2distid, dest, prefix, suffix),
        src2dist = getsrc2dist(src2distid, src2src, dest, prefix, suffix);
    
    /*
        srcs 最终处理的图片
        去除了相同的图片话，剩余需处理的图片
        
        src2src  原文件与指向文件的关系
        当序列帧中存在相同图片，指向将指为同一个，进行复用
    */

    callback(src2distid,src2src,srcs,dists,src2dist);
}

module.exports = x2x;