const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');

module.exports = function(imageFolder){
    imagemin([imageFolder+ '/*.{jpg,png,JPG}'], imageFolder + '/img', {use: [imageminJpegtran({progressive: true })]}, {
        plugins: [
            imageminPngquant({quality: '65-80'}),
        ]
    }).then(files => {
        console.log(files);
    });
    console.log('--', imageFolder)
};