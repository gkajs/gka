/*
* 生成各种信息
*
*/

var path = require("path");

// (num, length) (1,3)  => 001;
function addZero (num, length) {
    return new Array(length - String(num).length + 1).join("0") + num;
}

function getdists(ids, src2distid, dest, prefix, suffix) {
    var filename = 0;
     return ids.map(id => {
        filename = (prefix + id + suffix);

        if (!prefix) {
            for(var src in src2distid){
                if (id === src2distid[src]) {
                    filename = path.basename(src);
                }
            }
        }
        
        return path.join(dest, filename);
    });
}

function getsrc2dist(src2distid, dest, prefix, suffix) {
    var src2dist = {}, filename;
    
    for(var src in src2distid) {
        filename = prefix? (prefix + src2distid[src] + suffix): path.basename(src);
        src2dist[src] = path.join(dest, filename);
    }
    return src2dist;
}

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

    // 高级数据
    var dists = getdists(distids, src2distid, path.join(dest, "img"), prefix, suffix),
        src2dist = getsrc2dist(src2distid, path.join(dest, "img"), prefix, suffix),
        src2distrelative = getsrc2dist(src2distid, "img", prefix, suffix);

    var distsName = [];
    
    if (isSprites) {
        distsName = [`${prefix}gka_sprites${suffix}`];
    } else {
        distsName = getdists(distids, src2distid, "", prefix, suffix);
    } 

    callback(src2distid,distids,src2src,srcs,dists,src2dist,src2distrelative,distsName);
}

module.exports = x2x;