/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * output images
 */

var path        = require('path');

module.exports = function name(data, prefix, dest, callback) {
	var nameMap = {};
    data.frames = data.frames.map((item, i) => {
        let src = item['src'];
        let finalName = nameMap[item['src']];

        // 同样的src最终名字也一致
        if (!finalName) {
        	var suffix = path.extname(src),
                name   = path.basename(src);
            finalName = path.join(dest, (prefix? `${prefix}-${i}${suffix}`: name));
        	nameMap[item['src']] = finalName;
        }
        
        item['dest'] = finalName;
        item['file'] = path.basename(finalName);
        return item;
    })

    callback(data);
};
