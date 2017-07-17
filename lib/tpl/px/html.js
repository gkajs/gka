module.exports = function html(obj, callback) {
    var prefix = obj.prefix,
        names = obj.names;

var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>gka-animation-preview</title>
    <link href="./${prefix}gka.css" rel="stylesheet" type="text/css">
</head>
<body style="text-align: center;">
    <div id="gka" class="gka-base"></div>
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

    var imgNames = ${names};

    loadImage(imgNames, function() {
        document.getElementById('gka').className += " ${prefix}animation"
    }, "img/")
    </script>
</body>
</html>
`;

    callback && callback(`${prefix}gka.html`, str);
}
