/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

module.exports = class DataInfoPlugin {
    apply(compiler) {
        compiler.hooks.on('beforeGenerate', (context, next) => {
            let {
                data,
            } = context;
            context.assets['__info/data.json'] = JSON.stringify(data, null, '    ');
            next(context);
        })
    }
}