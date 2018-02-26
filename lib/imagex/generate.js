/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * output images
 */

var fs          = require("fs"),
    path        = require('path'),
    mkdirp      = require('mkdirp');

module.exports = function generate(data, callback) {
    
    let {
        frames
    } = data;

    let len = frames.length,
        j = 0;

    frames.map(item => {
        mkdirp(path.dirname(item['dest']), function (err) {
            
            var writeStream = fs.createWriteStream(item['dest']).on('finish', function(){
                // console.log(' ✔ ' + path.basename(dist) +' generated');
                if (++j === len) {
                    console.log(' ✔ image generated');
                    callback && callback(len);
                }
            });
            fs.createReadStream(item['src']).pipe(writeStream);
        });
    })
    
};
