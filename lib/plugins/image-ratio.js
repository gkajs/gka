class ImageRatio {
    constructor(ratio) {
        this.ratio = ratio || 1
    }
    
    apply(data, callback) {

        const {
            ratio,
        } = this;

        data['ratio'] *= ratio 
        data['ratio'] += '' 
        
        callback(data);
    }
}

module.exports = ImageRatio;
