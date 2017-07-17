/**
 * tpl entry
 */

var path = require("path"),
	fs = require("fs"),
	entry = fs.readdirSync(path.join(__dirname, '..', 'tpl'));

function get(floder, type) {
    var file = path.join(__dirname, '..', 'tpl', floder, type);
    return fs.existsSync(file)? require(file): null;
}

var result = {};

entry.map((item) => {
    result[item] = {
        html: get(item, "html.js"),
        css: get(item, "css.js"),
        js: get(item, "js.js"),
    };
});

module.exports = result;