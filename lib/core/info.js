/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka info
 */

var {
    isFunction
}  = require('./utils');

function info(options) {
    let {
        cmd, // 命令名

        // 原图，与生产目录
        dir           = '',     // 图片文件夹地址
        output        = '',     // 指定生成目录地址

        // 图片处理相关
        unique        = false,  // 开启相同帧图片复用 默认开启
        crop          = false,  // 开启空白裁剪模式
        sprites       = false,  // 开启合图模式
        algorithm     = 'left-right', // 合图布局模式 默认 left-right，可选 binary-tree | top-down ..
        count         = 0,      // ? 生成多合图，指定几张图片合成一张合图，可选
        bgcolor       = '',     // 为图片增加背景色，可选，支持格式：'rgb(255,205,44)'、 '#ffcd2c'
        prefix        = '',     // 重命名前缀， 默认 prefix
        mini          = false,  // 开启图片压缩

        diff          = false,  // 开启图片像素差模式，与 -t canvas 结合使用
        split         = false,  // 开启图片拆分模式，与 -t canvas 结合使用

        // 文件处理相关
        template      = 'css',  // 生成动画文件模板 默认 n ，可选模见 template list
        frameduration = 0.04,   // 每帧时长，默认 0.04
    } = options;

    console.log("\nGKA------------------------------------------------------------");
    console.log('           [dir]: %j', dir);
    bgcolor && console.log('       [bgcolor]: %j', bgcolor);
    diff && console.log('          [diff]: true');
    split && console.log('         [split]: true');
    crop && console.log('          [crop]: true');
    sprites && console.log('       [sprites]: true');
    sprites && console.log('     [algorithm]: %j', algorithm);
    sprites && count && console.log('     [spritesCount]: %j', count);
    mini && console.log('          [mini]: true');
    info && console.log('          [info]: true');
    unique && console.log('        [unique]: true');
    prefix && console.log('        [prefix]: %j', prefix);
    // TODO template 为函数时
    template && console.log('      [template]: %j', (isFunction(template) ? 'function': template));
    template && console.log(' [frameDuration]: %j', frameduration);
    console.log('\n[output dir]: %j', output);
    console.log("---------------------------------------------------------------");
    
}

module.exports = info;