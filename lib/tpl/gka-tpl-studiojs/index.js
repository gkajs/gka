var html = require("./lib/html"),
    css = require("./lib/css");

module.exports = function (data, opts, tool) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration;

    var names = tool.getNames();

    var writeFile = tool.writeFile;

    var cssFile = css(data, prefix, frameduration),
        htmlFile = html(names, prefix);

    writeFile(prefix + "gka.css", cssFile);
    writeFile(prefix + "gka.html", htmlFile);
};