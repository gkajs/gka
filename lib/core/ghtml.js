var fs = require('fs');
var path = require("path");

var defaultHtml = `<div id="gka" class="gka-base"></div>`;

function ghtml(dest, prefix, distsName, callback, html, cssname) {

var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>gka-animation-preview</title>
    <link href="./${prefix}gka${cssname || ""}.css" rel="stylesheet" type="text/css">
</head>
<body style="text-align: center;">
    ${html || defaultHtml}
    <script>
    function loadImage(names, cb, prefix){
        var n = 0, img;
        names.forEach(function(name) {
            img = new Image();
            img.onload = function() {
                (++n === names.length) && cb && cb();
            };
            img.src = (prefix || '') + name;
        });
    }

    var imgNames = ${distsName};

    loadImage(imgNames, function() {
        document.getElementById('gka').className += " ${prefix}animation"
    }, "img/")
    </script>
</body>
</html>
`;

    callback && callback(str);
}

module.exports = ghtml;
