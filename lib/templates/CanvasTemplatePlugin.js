/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka canvas template
 */

const gkaUtils = require('../packages/gka-utils');

module.exports = class CanvasTemplatePlugin {
    constructor() {
    }
    apply(compiler) {
        compiler.hooks.on('templateOptions', (context, next) => {
            next(context);
        })
        
        compiler.hooks.on('template', (context, next) => {
            const {
                options,
                data,
            } = context;
            
            const dir = options.imgOutput;

            function run(data, opts, key) {
                var name = (key? key + '-' : '') + 'gka',
                    dataName = name + '-data.js',
                    htmlName = name + '.html';

                var _data = gkaUtils.data.formateData(data, ['name', 'src', 'dest'], true);
                
                context.assets[dataName] = `var data = ${gkaUtils.data.fixArrayString(JSON.stringify(_data, null, '    '))}`;
                context.assets[htmlName] = html(data, opts, dataName);
            }

            run(data[0], options);

            // 对每个子目录都进行处理
            gkaUtils._.effectSubFolderSync(run, data[0], options);
        
            next(context);
        })
    }
}

/*
不设置时，为gka设置的默认值
设置为 any 时，为用户设置的值
设置非 any 时，强制为config设置的值
*/

// module.exports.config = function(opts) {
//     return {
//         crop: 'any',
//         sprites: 'any',
//         'diff': 'any',
//         'split': 'any',
//     }
// };

function html(data, opts, dataName) {

    var prefix = opts.prefix,
        isDiff = opts.diff,
        frameduration = opts.frameduration,
        names = JSON.stringify(gkaUtils.data.getImageNames(data)),
        width = data.frames[0].sourceW,
        height = data.frames[0].sourceH,
        html = gkaUtils.html.getHtmlWrap(opts);

    var diffjs = (function(){
        if (isDiff) {
            return `
            if (i === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
`
        } else {
           return `
            ctx.clearRect(0, 0, canvas.width, canvas.height);
` 
        }
    })()

    html.includeBodyContent(`
    <canvas id="gka" width="${width}" height="${height}"></canvas>
    <script src="./${dataName}"></script>
    <script>
    ${gkaUtils.html.getPreloadImageScript('    ')}
    preloadImage(${names}, function(imgs) {
       var canvas = document.getElementById('gka'),
            ctx = canvas.getContext('2d'),
            frames = data.frames,
            i = 0,
            o = {},
            key = Object.keys(data.animations)[0],
            list = data.animations[key],
            len = list.length;

        var cacheCanvas = document.createElement("canvas"),
            ctxCache = cacheCanvas.getContext("2d");

        cacheCanvas.width = canvas.width;
        cacheCanvas.height = canvas.height;

        setInterval(function(){
            o = list[i];
            ctxCache.clearRect(0, 0, canvas.width, canvas.height);
            o = Object.prototype.toString.call(o)=='[object Array]'? o: [o];
            for (var j = 0, t; j < o.length; j++) {
                t = data.frames[o[j]];
                ctxCache.drawImage((imgs[t.file] || imgs[data.file]), (t.x || data.x || 0), (t.y || data.y || 0), (t.width || data.width), (t.height || data.height), (t.offX || data.offX || 0), (t.offY || data.offY || 0), (t.width || data.width), (t.height || data.height));
            }
            ${diffjs}
            ctx.drawImage(cacheCanvas, 0, 0, canvas.width, canvas.height);
            i = ++i === len? 0: i;
        }, ${frameduration * 1000})
    }, "img/")
    </script>`);

    return html + '';
}