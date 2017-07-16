
function ghtml(obj, callback) {
    var prefix = obj.prefix,
        names = obj.names;

var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>gka-animation-preview</title>
    <link href="./${prefix}gka_sprites_percent.css" rel="stylesheet" type="text/css">
</head>
<body style="text-align: center;">
    <div style="width:300px; display:inline-block;">
        <div id="gka" class="gka-base"></div>
    </div>
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

    callback && callback("gka_sprites_percent.html", str);
}

module.exports = ghtml;
