/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka svg template
 */

var gkaUtils = require('../../../packages/gka-utils'),
    writeSync = gkaUtils.file.writeSync;

module.exports = function (data, opts, cb) {
    var dir = opts.imgOutput;

    function run(data, opts, key) {
        var name = (key? key + '-' : '') + 'gka',
            cssName = name + '.css',
            htmlName = name + '.html';

     	writeSync([dir, '..', cssName], css(data, opts));
        writeSync([dir, '..', htmlName], html(data, opts, cssName));
    }

    run(data, opts);

    // 对每个子目录都进行处理
    gkaUtils._.effectSubFolderSync(run, data, opts);

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

function getConfig(frame, i, frames, key) {
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

    var file = './img/' + file;

    let res = {};

    width && (res['width'] = `${width}px`);
    height && (res['height'] = `${height}px`);
    file && (res['background-image'] = `url("${file}")`);

    (!(offX === 0 && b_offX === 0)) && (res['margin-left'] = `${offX === 0? 0: (offX + 'px')}`);
    (!(offY === 0 && b_offY === 0)) && (res['border-top'] = `${offY}px solid transparent`);
    (!(x === 0 && y === 0 && b_x === 0 && b_y === 0)) && (res['background-position'] = `${x === 0? 0: (-x + 'px')} ${y === 0? 0: (-y + 'px')}`);

    return res;
}

function injectAnimationCSS(firstFrame) {
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
    } = firstFrame;

    let res = {};

    (!(offY === 0)) && (res['border-top'] = `${offY}px solid transparent`);
    
    return res;
}

function css(data, opts) {
    var css = gkaUtils.css.getKeyframesCSS(data, opts, {
        getConfig,
        injectAnimationCSS
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