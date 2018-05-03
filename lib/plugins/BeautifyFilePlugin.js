/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const js_beautify = require('js-beautify')

const beautifyCSS = content => {
	return js_beautify.css(content)
}

module.exports = class BeautifyFilePlugin {
    apply(compiler) {
        compiler.hooks.on('beforeGenerate', (context, next) => {
            let {
                assets,
                fileSystem
            } = context;

            for (let name in assets) {
                let extname = fileSystem.extname(name);
                if(extname === '.css')
                    assets[name] = beautifyCSS(assets[name]);
            }
            next(context);
        })
    }
}