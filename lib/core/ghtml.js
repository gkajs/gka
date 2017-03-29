var fs = require('fs');
var path = require("path");

function ghtml(dest, callback) {
var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>gka-animation-preview</title>
    <style>
        body {
            background-color: #000;
        }
    </style>
    <link href="./gka.css" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="gka-animation"></div>
</body>
</html>
`;

    callback && callback(str);
}

module.exports = ghtml;
