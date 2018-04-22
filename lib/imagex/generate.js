/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * generate
 */

const fs   = require("fs"),
    path   = require('path'),
    mkdirp = require('mkdirp');

const writeFile = (src, dest) => {
    return new Promise((resolve, reject) => {
        mkdirp(path.dirname(dest), function (err) {
            if (err) console.error(err)
            let writeStream = fs.createWriteStream(dest).on('finish', resolve);
            fs.createReadStream(src).pipe(writeStream);
        });
    })
}

const generate = ({ frames }, callback) => {
    let pr = frames.map(item => {
        let {src, dest} = item
        return writeFile(src, dest)
    })
    Promise.all(pr).then(() => {
        console.log(' ✔ image generated');
        callback && callback();
    });
};

module.exports = generate
