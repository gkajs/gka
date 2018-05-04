/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

module.exports = class ImageRatioPlugin {
    constructor() {
    }
    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                options,
                data,
                fileSystem,
            } = context;

            const {
                ratio = 1,
            } = options;
    
            // ratio 为 1，则表示使用的是目录名的值
            if (ratio > 1) {
                data['ratio'] = ratio + '';
                console.log('[+] ratio');
            }
            next(context);
        })
    }
}