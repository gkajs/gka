/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka css template
 */

const gkaUtils = require('../packages/gka-utils');

module.exports = class CssTemplatePlugin {
	constructor() {
    }
    apply(compiler) {
        compiler.hooks.on('templateOptions', (context, next) => {
            // css template do not support split/diff optimization
            context.options.split = false;
            context.options.diff = false;
            next(context);
        })
        
        compiler.hooks.on('template', (context, next) => {
            const {
                options,
                data,
            } = context;
            
            const dir = options.imgOutput;

            function run(data, opts, key) {
                let name = (key? key + '-' : '') + 'gka',
                    cssName = name + '.css',
                    htmlName = name + '.html';
        
                let cssContent = data.reduce((res, item) => {
                    return res += css(item, opts);
                }, '');

                context.assets[cssName] = cssContent;
                context.assets[htmlName] = html(data, opts, cssName);
            }
        
            run(data, options);
        
            // 对每个子目录都进行处理
            effectSubFolderSync(run, data, options);
        
            next(context);
        })
    }
}

// 子目录中每一个文件夹都生成对应html、css
function effectSubFolderSync(run, dataArr, opts) {

    let newDataObj = {};

    dataArr.forEach(data => {
        let {
            frames,
            animations,
            ratio,
        } = data;

        for (let key in animations) {
            // TODO 支持多层文件夹嵌套
            var keys = animations[key],
                newKeys = [],
                newFrames = keys.map((k, i) => {
                    newKeys.push(i);
                    return frames[k];
                });
            newDataObj[key] = newDataObj[key] || [];

            // 相同的动画名的不同ratio存到同一个data中
            newDataObj[key].push({
                frames: newFrames,
                animations: {
                    [key] : newKeys
                },
                ratio,
            })
        }
    })

    let animationsSize = Object.keys(newDataObj).length;
    if (animationsSize === 0 || animationsSize === 1) return;

    for(let key in newDataObj) {
        run(newDataObj[key], opts, key);
    }
}

function checkRatio(frames, ratio = 1) {
    return frames.map(item => {
        return {
            src: item.src,
            dest: item.dest,
            file: item.file,
            width: item.width / ratio,
            height: item.height / ratio,
            offX: item.offX / ratio,
            offY: item.offY / ratio,
            sourceW: item.sourceW / ratio,
            sourceH: item.sourceH / ratio,
            w: item.w / ratio,
            h: item.h / ratio,
            x: item.x / ratio,
            y: item.y / ratio
        }
    })
}

function toFrameCSSObject(frame, ratio = 1) {
    let {
        width,
        height,
        offX = 0,
        offY = 0,
        file,
        x = 0,
        y = 0,
        w,
        h,
    } = frame;
    w = w || width;
    h = h || height;

    return {
        "width": `${width}px`,
        "height": `${height}px`,
        "background-image": `url("${'./img/' + (ratio == 1? '': ratio + 'x' + '/') + file}")`,
        "background-position": `${0-x}px ${0-y}px`,
        "background-size": `${w}px ${h}px`,
        "transform": `translate(${offX}px, ${offY}px)`,
    }
}

function css(data, opts) {
    let {ratio, frames, animations} = data;
    // 不修改到原数据
    let newFrames = checkRatio(frames, ratio);

    let {sourceW, sourceH, width, height} = newFrames[0];

    // TODO
    var css = gkaUtils.css.getCSSText('.gka-wrap', {
        width: `${sourceW || width}px`,
        height: `${sourceH || height}px`,
    });

    css += gkaUtils.css.keyframesAnimationCSS({
             animations,
             ratio,
             frames: newFrames,
        }, opts, {toFrameCSSObject});
    
    // 文件夹名为@1x 或 命令行传入 ratio 参数
    if (ratio == 1 || opts.ratio) return css;
        
    // min-resolution: 192dpi 为 2倍图的处理方式，3倍图先不考虑
    return `
        @media (-webkit-min-device-pixel-ratio: ${ratio}),
               (min-resolution: 192dpi) {
            ${css}
        }`
}

function html(dataArr, opts, cssName) {
    var prefix = opts.prefix,
        names = JSON.stringify(gkaUtils.data.getImageNames(dataArr[0])),
        html = gkaUtils.html.getHtmlWrap(opts);

    const ratios = dataArr.map(data => data.ratio);
    let folder = '"'

    // 文件夹名的形式 存在 > 2x图时，那么js加载，才会使用nx图，否则默认加载1x图
    for (var i = 0; i < ratios.length; i++) {
        if (ratios[i] > 1) {
            folder =`" + (window.devicePixelRatio >= 2? '2x/': '')`
            break;
        }
    }

    // 命令行传入参数的，直接指定对应目录
    if (opts.ratio > 1) {
        folder = opts.ratio + 'x/"';
    }

    html.includeHeadContent(`<link href="./${cssName? cssName: 'gka.css'}" rel="stylesheet" type="text/css">`);
    html.includeBodyContent(`
    <div class="gka-wrap">
        <div id="gka"></div>
    </div>
    <script>
    ${gkaUtils.html.getPreloadImageScript('    ')}

    preloadImage(${names}, function() {
        document.getElementById('gka').className += " ${prefix}animation"
    }, "img/${folder})
    </script>`);

    return html + '';
}