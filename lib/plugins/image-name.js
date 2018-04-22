const path = require('path');

class ImageName {
    constructor({prefix, dest}) {
        // super(...args);
        this.prefix = prefix
        this.dest = dest
        this.apply = this.apply.bind(this)
    }
    
    apply(data, callback) {
        
        const {
            prefix,
            dest,
        } = this;

        let nameMap = {};

        data.frames = data.frames.map((item, i) => {

            let src = item['src'], finalName = nameMap[item['src']];

            // 同样的src最终名字也一致
            if (!finalName) {
                var suffix = path.extname(src),
                    name   = path.basename(src);
                finalName = path.join(dest, (data.ratio == 1? '': data.ratio + 'x'), (prefix? `${prefix}-${i}${suffix}`: name));
                nameMap[item['src']] = finalName;
            }
            
            item['dest'] = finalName;
            item['file'] = path.basename(finalName);
            return item;
        })
        callback(data);
    }
}

module.exports = ImageName;
