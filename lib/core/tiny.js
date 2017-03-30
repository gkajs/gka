const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const defaultPlugins = ['gifsicle', 'jpegtran', 'optipng', 'svgo'];

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

module.exports = function(imageFolder, distFolder){
    console.log(' - optimizing image.. ',[imageFolder]);

    const use = getDefaultPlugins();
    use.push(imageminPngquant({quality: '65-80'}));
    
    imagemin([imageFolder+ '/*.{jpg,png}'], (distFolder || imageFolder),  {use})
        .then(files => {
            console.log(' ✔ image optimized');
        });
};