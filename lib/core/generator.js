/*
    generator
    
*/


var path = require("path");
var fs = require("fs");

var entry = fs.readdirSync(path.join(__dirname, '..', 'generator'));

function get(floder, type) {
    var file = path.join(__dirname, '..', 'generator', floder, type);
    return fs.existsSync(file)? require(file): null;
}

var result = {};

entry.map((item) => {
    result[item] = {
        html: get(item, "html.js"),
        css: get(item, "css.js"),
        js: get(item, "js.js"),
        config: get(item, "config.js"),
    };
});

module.exports = result;