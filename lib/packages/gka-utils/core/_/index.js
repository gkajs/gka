// TODO: newKeys 的取值方式？

// 子目录中每一个文件夹都生成对应html、css
function effectSubFolderSync(run, data, opts) {
    var frames = data.frames,
        animations = data.animations;

    if (!animations || Object.keys(animations).length === 1) return;

    for (var key in animations) {
        // TODO 支持多层文件夹嵌套
        var keys = animations[key],
            newKeys = [],
            newFrames = keys.map((k, i) => {
                newKeys.push(i);
                return frames[k];
            });
        
    	run({
    		frames: newFrames,
    		animations: {
    			[key] : newKeys
    		}
    	}, opts, key);
    }
}

module.exports = {
	effectSubFolderSync,
}