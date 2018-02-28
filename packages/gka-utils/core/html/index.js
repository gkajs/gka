// 获取版本号展示html
function getRibbon(gkaVersion, tplName, tplVersion){
    return `<div style="position: fixed; bottom: 10px;">Powered By <a target="_blank" href="https://github.com/gkajs/gka">gka ${gkaVersion}</a></div>`
	// return `<div style="position: fixed; bottom: 10px;">Powered By <a target="_blank" href="https://github.com/gkajs/gka">gka ${gkaVersion}</a> & <a target="_blank" href="https://github.com/gkajs/${tplName}">${tplName} ${tplVersion}</a></div>`
}
function preloadImage(names, cb, prefix){
        window.gkaCache = window.gkaCache || [];
        var n = 0,img,imgs = {};
        names.forEach(function(name) {
            img = new Image();
            window.gkaCache.push(img);
            img.onload = (function(name, img) {
                return function() {
                    imgs[name] = img;
                    (++n === names.length) && cb && cb(imgs);
                }
            })(name, img);
            img.src = (prefix || '') + name;
        });
    }
// 预加载图片函数script
function getPreloadImageScript(space){
	space = space || '';
	return `function preloadImage(names, cb, prefix){
${space}    window.gkaCache = window.gkaCache || [];
${space}    var n = 0,img,imgs = {};
${space}    names.forEach(function(name) {
${space}        img = new Image();
${space}        window.gkaCache.push(img);
${space}        img.onload = (function(name, img) {
${space}            return function() {
${space}                imgs[name] = img;
${space}                (++n === names.length) && cb && cb(imgs);
${space}            }
${space}        })(name, img);
${space}        img.src = (prefix || '') + name;
${space}    });
${space}}`
}
        
// 调整大小html
function getChangeWidthHTML(space, width){
	space = space || '';
	return `<div style="position: fixed; bottom: 60px;">
${space}    width：<input type="range" min="0" max="${width * 2}" value="${width}" oninput="container.style.width=this.value+'px';">
${space}</div>`
}

// html
function getHtmlWrap(options) {
    var env = options.env;
    var gkaVersion = options.gkaVersion;
    var headContent = [],
        bodyContent = [];

    var ribbon = getRibbon(gkaVersion);

    var _html = function() {
        return `<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,maximum-scale=1">
    ${env === 'test'? '':`<script name='gkaRibbon'>document.addEventListener('DOMContentLoaded',function(){var d=document.createElement('div');d.innerHTML='${ribbon}';document.body.appendChild(d)});</script>`}
    <title>gka-preview</title>${headContent.length > 0? `
` + headContent.join('') : ''}
</head>
<body>
${bodyContent.join('')}
</body>
</html>`;
    }

    return {
        includeHeadContent: function (c){
	        headContent.push(c);
	    },
        includeBodyContent: function (c){
	        bodyContent.push(c);
	    },
        toString: _html
    };
}

module.exports = {
	getRibbon,
	getPreloadImageScript,
	getHtmlWrap,
	getChangeWidthHTML,
}