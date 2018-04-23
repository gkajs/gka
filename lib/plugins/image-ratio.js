class ImageRatio {
    constructor(ratio) {
        this.ratio = ratio || 1
    }
    
    apply(data, callback) {

        const {
            ratio,
        } = this;

        // ratio 为 1，则表示使用的是目录名的值
        if (ratio > 1) {
            data['ratio'] = ratio + '' 
        }

        callback(data);
    }
}

module.exports = ImageRatio;
