/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

/**
 * minify image
 */

const path = require('path');
const fs = require('fs');  
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const defaultPlugins = ['pngquant', 'gifsicle', 'jpeg-recompress','optipng', 'svgo'];// 'jpegtran', 

const loadPlugin = (plugin, args) => {
    try {
        return require(`imagemin-${plugin}`).apply(null, args); // eslint-disable-line import/no-dynamic-require
    } catch (err) {
        console.log(`gulp-imagemin: Couldn't load default plugin "${plugin}"`);
    }
};

const getDefaultPlugins = () =>
    defaultPlugins.reduce((plugins, plugin) => {
        const instance = loadPlugin(plugin);

        if (!instance) {
            return plugins;
        }

        return plugins.concat(instance);
    }, []);

var imageFolderList = [];
var imgExt = [".png",".jpg",".jpeg"]; // 支持的图片类型

function walk(_path){
    var dirList = fs.readdirSync(_path);
    dirList.forEach(function(item){
        var _newpath = path.join(_path, item);

        if(fs.statSync(_newpath).isDirectory()){
            walk(_newpath);
        } else {
            if(imgExt.indexOf(path.extname(_newpath)) > -1 && imageFolderList.indexOf(_path) === -1){
                imageFolderList.push(_path);
            }
        }
    });
}

module.exports = function(imageFolder, distFolder){
    console.log(' - optimizing image.. ');
    console.log('dir: '+ imageFolder);

    imageFolderList = [];
    walk(imageFolder);

    console.log(imageFolderList);  

    const use = getDefaultPlugins();
    use.push(imageminPngquant({quality: '65-80'}));
    
    for (var i = 0; i < imageFolderList.length; i++) {
        imagemin([path.join(imageFolderList[i], '*.{jpg,png}')], (distFolder || imageFolderList[i]),  {use})
        .then(files => {
            console.log(' ✔ image optimized');
        });
    }
};