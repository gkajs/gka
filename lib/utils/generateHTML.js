module.exports =  function generateHTML(keyframesStr, animationTime, width, height) {
var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>animation</title>
    <style>
        body {
            background-color: #000;
        }
        .animation {
            width: ${width + "px"};
            height: ${height + "px"};

            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;;

            /*-webkit-animation: animation ${animationTime}s  steps(1);*/
            -webkit-animation: animation ${animationTime}s steps(1) infinite;
        }

        @-webkit-keyframes animation {${
            keyframesStr
        }}
    </style>
</head>
<body>
    <div class="animation"></div>
</body>
</html>
`;
        return str;
    }
