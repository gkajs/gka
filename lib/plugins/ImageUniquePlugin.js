/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const fs = require("fs"),
    md5  = require('md5');

function animationsChange(animations, val, newVal) {
    var animation = [];
    for(var k in animations) {
        animation = animations[k];
        for (var i = 0, ani; i < animation.length; i++) {
            ani = animation[i];
            if (ani === val) {
                animation[i] = newVal;
            } else if (Object.prototype.toString.call(ani)=='[object Array]') {
                for (var j = 0; j < ani.length; j++) {
                    if (ani[j] === val) {
                        animation[i][j] = newVal;
                    }
                }
            }
        }
    }
}

function isSameObj(a, b) {
    var len1 = Object.keys(a).length,
        len2 = Object.keys(b).length;
    if (len1 !== len2) return false;
    for(var key in a) {
        if (a[k] !== b[k]) {
            return false;
            break;
        }
    }
    return true;
}

function copyObj(a) {
    var b = {};
    for(var key in a) {
        b[key] = a[key];
    }
    return b;
}

module.exports = class ImageUniquePlugin {
    constructor() {}
    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                options,
                data,
                fileSystem,
            } = context;

            let {
                frames,
                animations,
                ratio,
            } = data;

            let newFrames = [],
                md5map = {};

            frames.map((item, i) => {

                let src = item['src'],
                    data = fs.readFileSync(src),
                    md5number = md5(data);

                let itemSaved = md5map[md5number];

                // 已存在相同图片，指向相同src
                if (itemSaved !== undefined) {
                    // 两个数据完全一致，则只保留一个，且修改对应keymap
                    if(isSameObj(item, itemSaved)) {
                        animationsChange(animations, i, itemSaved['tmpIndex']);
                    } else {
                        item.src = md5map[md5number]['src'];
                        newFrames.push(item)
                    }
                } else {
                    item['tmpIndex'] = newFrames.push(copyObj(item)) - 1;
                    md5map[md5number] = item;
                }
            })

            // TODO
            context.data['frames'] = newFrames;
            context.data['animations'] = animations;
            context.data['ratio'] = ratio;

            console.log('[+] unique');
            next(context);
        })
    }
}