/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

module.exports = class ImageNamePlugin {
    constructor() {}
    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                options,
                data,
                fileSystem,
            } = context;

            const {
                prefix,
                imgOutput: output,
            } = options;

            let nameMap = {};
    
            data.frames = data.frames.map((item, i) => {
    
                let src = item['src'], finalName = nameMap[item['src']];
    
                // 同样的src最终名字也一致
                if (!finalName) {
                    var suffix = fileSystem.extname(src),
                        name   = fileSystem.basename(src);
                    
                    finalName = fileSystem.join(output, (data.ratio == 1? '': data.ratio + 'x'), (prefix? `${prefix}-${i}${suffix}`: name));
                    nameMap[item['src']] = finalName;
                }
                
                item['dest'] = finalName;
                item['file'] = fileSystem.basename(finalName);
                return item;
            })

            if (prefix) {
                console.log('[+] name');
            }
            next(context);
        })
    }
}