var fs = require('fs');
var path = require("path");

module.exports = function ghtml(dest) {
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

    fs.writeFile(path.join(dest, "gka.html"), str, function(e){
        if(e) throw e;
        console.log('gka.html generated ✔ ');
    });

};
