function isSame(frames, key) {
    var same = frames.filter(function(f){
        return f[key] === frames[0][key];
    });
    return (same.length === frames.length? true: false);
}

/**
 * data 为传入数据
 * delKeys {array} 制定frame中哪些字段去除
 * withAnimations {boolean} 是否保留 animations，默认false
 */
function formateData(data, delKeys, withAnimations) {
    var frames = data.frames,
        frame = frames[0];

    var sKeys = [];
    var _data = {};

    for (var i = 0, fKeys = Object.keys(frames[0]); i < fKeys.length; i++) {
        var key = fKeys[i];
        if(isSame(frames, key) && (delKeys? delKeys.indexOf(key) === -1:  true)) {
            sKeys.push(key);
            // 去掉0
            // if (frames[0][key] !== 0) {
                _data[key] = frames[0][key]
            // }
        }
    }

    if(_data['width'] === _data['w'] && _data['height'] === _data['h']) {
        delete _data['w'];
        delete _data['h'];
        delete _data['x'];
        delete _data['y'];
    }
     
    var newFrame = frames.map(function(frame){
        if(frame['width'] === frame['w'] && frame['height'] === frame['h']) {
            delete frame['w'];
            delete frame['h'];
            delete _data['x'];
            delete _data['y'];
        } 
        var f = {};
        for(var k in frame) {
            if(sKeys.indexOf(k) === -1 && (delKeys? delKeys.indexOf(k) === -1:  true)) {
                // 去掉0
                f[k] = frame[k];
            }
        }
        return f;
    })

    _data['frames'] = newFrame;
    if (withAnimations && data['animations']) {
        _data['animations'] = {};
        for(var k in data['animations']) {
            _data['animations'][k] = JSON.stringify(data['animations'][k])
        }
    }
    return _data;
}

function fixArrayString(str) {
    return str.replace(/\"\[/ig, "\[").replace(/\]\"/ig, "\]");
}

/**
 * data 为传入数据
 * 返回 所有图片资源名
 */
function getImageNames(data) {
    var res = [];
    if (data.file) {
        res.push(data.file);
        return res;
    }

    var frames = data.frames;
    for (var i = 0,frame; i < frames.length; i++) {
        frame = frames[i];
        frame = Object.prototype.toString.call(frame)=='[object Array]'? frame: [frame];
        for (var j = 0; j < frame.length; j++) {
            res.push(frame[j].file);
        }
    }

    return res.filter(function(item,index,self){
        return self.indexOf(item) == index;     
    });
}

module.exports = {
    getImageNames: getImageNames,
    formateData: formateData,
    fixArrayString: fixArrayString,
}