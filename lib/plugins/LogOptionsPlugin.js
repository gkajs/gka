/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const _ = require('lodash');
const chalk = require('chalk');

// options logger
module.exports = class LogOptionsPlugin {
    apply(compiler) {
        compiler.hooks.on('run', (context, next) => {
            let {
                options,
            } = context;
            logOptionsInfo(options);
            next(context);
        })
    }
}

function logblock(name, value) {
    if (value) {
        return name.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()) + ': ' + chalk.yellow(value)
    } else {
        return name.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
}

function logOptionsInfo(options) {
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
        spritesCount  = 0,      // ? 生成多合图，指定几张图片合成一张合图，可选
        bgcolor       = '',     // 为图片增加背景色，可选，支持格式：'rgb(255,205,44)'、 '#ffcd2c'
        prefix        = '',     // 重命名前缀， 默认 prefix
        mini          = false,  // 开启图片压缩

        diff          = false,  // 开启图片像素差模式，与 -t canvas 结合使用
        split         = false,  // 开启图片拆分模式，与 -t canvas 结合使用

        // 文件处理相关
        template      = 'css',  // 生成动画文件模板 默认 n ，可选模见 template list
        frameduration = 0.04,   // 每帧时长，默认 0.04

        ratio         = 1,      // 设置生成 N 倍图

        info          = false,  // 是否输出图片数据
    } = options;

    let logs = [];
    logs.push(['Input  directory', dir]);
    logs.push(['Output directory', output]);
    logs.push(['', '']);
    
    bgcolor && logs.push(['bgcolor', bgcolor]);
    diff && logs.push(['diff', 'true']);
    split && logs.push(['split', 'true']);
    crop && logs.push(['crop', 'true']);
    mini && logs.push(['mini', 'true']);
    info && logs.push(['info', 'true']);
    unique && logs.push(['unique', 'true']);
    sprites && logs.push(['sprites', 'true']);
    sprites && logs.push(['algorithm', algorithm]);
    sprites && spritesCount && logs.push(['spritesCount', spritesCount]);
    prefix && logs.push(['prefix', prefix]);
    template && logs.push(['template', (_.isFunction(template) ? 'function': template)]);
    template && logs.push(['frameDuration', frameduration + 's']);
    ratio > 1 && logs.push(['ratio', ratio]);

    console.log()
    console.log(
        logs.map(arr => {
            return logblock(arr[0], arr[1]);
        }).join('\n')
    )
    console.log(chalk.gray('----------------------------\n'));
}