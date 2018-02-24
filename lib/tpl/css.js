var gkaUtils = require('../gka-utils'),
    writeSync = gkaUtils.file.writeSync;
var pkg = require("../../package.json");

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
    console.log(opts)
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

function getConfig(frame, i) {
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

    file = './img/' + frame.file;

    let res = {};

    width && (res['width'] = `${width}px`);
    height && (res['height'] = `${height}px`);

    (!(offX === 0 && offY === 0)) && (res['transform'] = `translate(${offX}px, ${offY}px)`);
    file && (res['background-image'] = `url("${file}")`);

    (!(x === 0 && y === 0)) && (res['background-position'] = `${-x}px ${-y}px`);

    return res;

    // return {
    //     width: `${width}px`,
    //     height: `${height}px`,
    //     transform: `translate(${offX}px, ${offY}px)`,
    //     'background-image': `url("${file}")`,
    //     'background-position': `${-x}px ${-y}px`,
    // }
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

    return {
        width: `${width + "px"}`,
        height: `${height+ "px"}`
    }
}

function getConfig_percent(frame, i, frames, key) {
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

    w = w? w: width;
    h = h? h: height;

    var file = './img/' + file;

    var s_w_p = (w / width) * 100 + '%',
        s_h_p = (h / height) * 100 + '%';

    var p_x = (0 - x ) / ( width - w || 1) * 100 + '%' || 0,
        p_y = (0 - y ) / ( height - h || 1) * 100 + '%' || 0;

    let res = {};

    // (!(offX === 0 && offY === 0)) && (res['transform'] = `translate(${offX}px, ${offY}px)`);
    
    file && (res['background-image'] = `url("${file}")`);

    (!(p_x === '0%' && p_y === '0%')) && (res['background-position'] = `${p_x} ${p_y}`);
    (!(s_w_p=== '100%' && s_h_p === '100%')) && (res['background-size'] = `${s_w_p} ${s_h_p}`);

    return res;
}

function injectAnimationCSS_percent(firstFrame) {
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

    w = w? w: width;
    h = h? h: height;

    var file = './img/' + file;

    var s_w_p = (w / width) * 100 + '%',
        s_h_p = (h / height) * 100 + '%';

    let res = {
        width: `100%`,
        height: 0,
        'padding-bottom': height / width * 100 + "%",
    };

    (!(s_w_p=== '100%' && s_h_p === '100%')) && (res['background-size'] = `${s_w_p} ${s_h_p}`);
    return res;
}

function css(data, opts) {

    let {sourceW, sourceH, width, height} = data.frames[0];

    // TODO
    var css = gkaUtils.css.getCSSText('.gka-wrap', {
        width: `${sourceW || width}px`,
        height: `${sourceH || height}px`,
    });

    css += gkaUtils.css.getKeyframesCSS(data, opts, {
        getConfig: getConfig_percent,
        injectAnimationCSS: injectAnimationCSS_percent
        // getConfig,
        // injectAnimationCSS
    });

    return css;
}

function html(data, opts, cssName) {

    var prefix = opts.prefix,
        names = JSON.stringify(gkaUtils.data.getImageNames(data)),
        html = gkaUtils.html.getHtmlWrap(opts.gkaVersion, pkg.name, pkg.version);

    html.includeHeadContent(`<link href="./${cssName? cssName: 'gka.css'}" rel="stylesheet" type="text/css">`);
    html.includeBodyContent(`
    <div class="gka-wrap">
        <div id="gka"></div>
    </div>
    <script>
    ${gkaUtils.html.getPreloadImageScript('    ')}
    preloadImage(${names}, function() {
        document.getElementById('gka').className += " ${prefix}animation"
    }, "img/")
    </script>`);

    return html + '';
}