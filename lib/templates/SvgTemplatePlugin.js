/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka svg template
 */

const gkaUtils = require('../packages/gka-utils');

module.exports = class SvgTemplatePlugin {
    constructor() {
    }
    apply(compiler) {
        compiler.hooks.on('templateOptions', (context, next) => {
            // svg template do not support split/diff
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
                var name = (key? key + '-' : '') + 'gka',
                    cssName = name + '.css',
                    htmlName = name + '.html';

                context.assets[cssName] = css(data, opts);
                context.assets[htmlName] = html(data, opts, cssName);
            }

            // TODO 支持多倍图
            run(data[0], options);

            // 对每个子目录都进行处理
            gkaUtils._.effectSubFolderSync(run, data[0], options);
        
            next(context);
        })
    }
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
        "margin-left": `${offX}px`,
        "border-top": `${offY}px solid transparent`,
    }
}

function css(data, opts) {
    var css = gkaUtils.css.keyframesAnimationCSS(data, opts, {
        toFrameCSSObject,
    });
    return css;
}

function html(data, opts, cssName) {

    var prefix = opts.prefix,
        names = JSON.stringify(gkaUtils.data.getImageNames(data)),
        width = data.frames[0].sourceW || data.frames[0].width,
        height = data.frames[0].sourceH || data.frames[0].height,
        html = gkaUtils.html.getHtmlWrap(opts);

    html.includeHeadContent(`<link href="./${cssName? cssName: 'gka.css'}" rel="stylesheet" type="text/css">`);
    html.includeBodyContent(`    ${gkaUtils.html.getChangeWidthHTML('    ', width)}
    
    <svg id="container" viewBox="0, 0, ${width}, ${height}" style="width: ${width}px">
        <foreignobject width="${width}" height="${height}">
            <div id="gka" class="gka-base"></div>
        </foreignobject>
    </svg>
    <script>
    ${gkaUtils.html.getPreloadImageScript('    ')}
    preloadImage(${names}, function() {
        document.getElementById('gka').className += " ${prefix}animation"
    }, "img/")
    </script>`);

    return html + '';
}