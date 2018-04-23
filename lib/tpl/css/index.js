/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka css template
 */

var gkaUtils = require('../../../packages/gka-utils'),
    writeSync = gkaUtils.file.writeSync;

module.exports = function (data, opts, cb) {
    var dir = opts.imgOutput;

    function run(data, opts, key) {
        var name = (key? key + '-' : '') + 'gka',
            cssName = name + '.css',
            htmlName = name + '.html';

        let cssContent = data.reduce((res, item) => {
            return res += css(item, opts);
        }, '');

        writeSync([dir, '..', cssName], cssContent);
        writeSync([dir, '..', htmlName], html(data, opts, cssName));
    }

    run(data, opts);

    // 对每个子目录都进行处理
    // gkaUtils._.effectSubFolderSync(run, data, opts);

    cb && cb();
};

module.exports.config = function(opts) {
    // console.log(opts)
    /*
        不设置时，为gka设置的默认值
        设置为 any 时，为用户设置的值
        设置非 any 时，强制为config设置的值
    */
    return {
        crop: 'any',
        sprites: 'any',
    }
};

function getConfig(frame, i, frames, ratio) {
    var {
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

    var {
        offX: b_offX = 0,
        offY: b_offY = 0,
        x: b_x = 0,
        y: b_y = 0,
    } = frames[i - 1] || {};

    x = x || 0;
    y = y || 0;
    b_x = b_x || 0;
    b_y = b_y || 0;
    w = w || width;
    h = h || height;

    file = './img/' + (ratio == 1? '': ratio + 'x' + '/') + frame.file;

    let res = {};

    width && (res['width'] = `${width}px`);
    height && (res['height'] = `${height}px`);


    file && (res['background-image'] = `url("${file}")`);

    (!(offX === 0 && b_offX === 0 && offY === 0 && b_offY === 0)) && (res['transform'] = `translate(${offX === 0? 0: (offX + 'px')}, ${offY === 0? 0: (offY + 'px')})`);
    (!(x === 0 && y === 0 && b_x === 0 && b_y === 0)) && (res['background-position'] = `${x === 0? 0: (-x + 'px')} ${y === 0? 0: (-y + 'px')}`);
    
    
    // // 支持多倍图模式
    // var s_w_p = (w / width) * 100 + '%',
    //     s_h_p = (h / height) * 100 + '%';

    res['background-size'] = `${w}px ${h}px`;
    return res;
}

function injectAnimationCSS(firstFrame) {
    var {
        width,
        height,
        offX,
        offY,
        file,
        x,
        y,
        w,
        h,
    } = firstFrame;

    let res = {
        width: `${width + "px"}`,
        height: `${height+ "px"}`
    }

    w = w? w: width;
    h = h? h: height;

    // 支持多倍图模式
    // var s_w_p = (w / width) * 100 + '%',
    //     s_h_p = (h / height) * 100 + '%';
    // res['background-size'] = `${s_w_p} ${s_h_p}`;

    // 使用 px 方式，更好的兼容
    res['background-size'] = `${w}px ${h}px`;

    return res;
}

function checkRatio(frames, ratio) {
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

function css(data, opts) {
    let {ratio, frames} = data;
    data.frames = frames = checkRatio(frames, ratio);

    let {sourceW, sourceH, width, height} = frames[0];

    // TODO
    var css = gkaUtils.css.getCSSText('.gka-wrap', {
        width: `${sourceW || width}px`,
        height: `${sourceH || height}px`,
    });

    css += gkaUtils.css.getKeyframesCSS(data, opts, {
        getConfig,
        injectAnimationCSS
    });

    let res = ''

    // 文件夹名为@1x 或 命令行传入 ratio 参数
    if (ratio == 1 || opts.ratio) {
        res = css;
    } else {
    // min-resolution: 192dpi 为 2倍图的处理方式，3倍图先不考虑
    res = `
@media (-webkit-min-device-pixel-ratio: ${ratio}),
       (min-resolution: 192dpi) {
${css}}`
}
    return res;
}

function getRatios(dataArr) {
    return dataArr.map(data => data.ratio)
}
function html(dataArr, opts, cssName) {
    var prefix = opts.prefix,
        names = JSON.stringify(gkaUtils.data.getImageNames(dataArr[0])),
        html = gkaUtils.html.getHtmlWrap(opts);

    const ratios = getRatios(dataArr);
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