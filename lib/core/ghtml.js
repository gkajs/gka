var fs = require('fs');
var path = require("path");

function ghtml(dest, prefix, callback) {
var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>gka-animation-preview</title>
    <link href="./${prefix}gka.css" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="gka-animation ${prefix}animation"></div>
</body>
</html>
`;

    callback && callback(str);
}

module.exports = ghtml;
