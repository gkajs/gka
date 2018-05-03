/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const path = require('path'),
    fs = require('fs'),
    imagemin = require('imagemin'),
    imageminPngquant = require('imagemin-pngquant');

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
        var instance = loadPlugin(plugin);

        if (!instance) {
            return plugins;
        }

        return plugins.concat(instance);
    }, []);

const imgExt = [".png",".jpg",".jpeg"]; // 支持的图片类型
let imageFolderList = [];

const walk = _path => {
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

module.exports = class ImageMinifyPlugin {
    constructor() {}
    apply(compiler) {
        compiler.hooks.on('done', (context, next) => {
            let {
                options,
            } = context;

            ImageMinifyPlugin.process(options.imgOutput).then(_ => {
                next(context);
            })
        })
    }
    static process(imageFolder, distFolder) {
        console.log(' - minify image.. ');
        console.log('dir: '+ imageFolder);
    
        imageFolderList = [];
        walk(imageFolder);
    
        console.log(imageFolderList);  
    
        var use = getDefaultPlugins();
        use.push(imageminPngquant({quality: '65-80'}));
        
        let pr = imageFolderList.map(folder => {
            return imagemin([path.join(folder, '*.{jpg,png}')], (distFolder || folder),  {use})
        })

        return Promise.all(pr).then(files => {
            console.log('[+] minify');
        }).catch(err => {
            console.log('minify error', err)
        });
    }
}