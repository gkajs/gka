/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const fs   = require('fs'),
    path   = require('path'),
    sizeOf = require('image-size'),
    PNG    = require('pngjs').PNG;

// 根据文件名最后的数字进行排序
const sortByFileName = files =>  {
	const reg = /[0-9]+/g;
	return files.sort((a, b) => {
		let na = (a.match(reg) || []).slice(-1),
			nb = (b.match(reg) || []).slice(-1)
		return na - nb
	});
}

// log 不支持的格式的文件列表
const logUnSupportedList = (isLog, data) => {
	if (!isLog) return
	console.log("\n[unsupported]:")
	for (var i = 0; i < data.length; i++) {
		console.log(data[i])
	}
	console.log()
}

// 匹配出多倍图文件夹的实际名字和倍数, eg: name@2x
const getRatioAndNameByFolderName = name => {
	const re = /(.*)@([1-9])x$/;
    let res = name.match(re) || [name, name, 1];
    return {
    	name: res[1],
    	ratio: res[2],
    }
}

const separateDataByRatio = (data) => {
	let ratioDataMap = {}
	let newData = []

    for(let folderName in data) {
        let {
        	name,
        	ratio = 1
        } = getRatioAndNameByFolderName(folderName)
        
        let _frames = data[folderName];

        ratioDataMap[ratio] = ratioDataMap[ratio] || {}

        let {
        	frames = [],
        	animations = {}
        } = ratioDataMap[ratio];

    	animations[name] = animations[name] || []

        _frames.map(item => {
        	frames.push(item)
        	animations[name].push(frames.length - 1)
        })

        ratioDataMap[ratio]['frames'] = frames
        ratioDataMap[ratio]['animations'] = animations
    }

    for(let ratio in ratioDataMap) {
		let item = ratioDataMap[ratio]
		item['ratio']= ratio
    	newData.push(item)
    }

    return newData
}

class FolderParser {
	constructor(...args) {
	}
	apply(compiler) {
		compiler.hooks.on('parse', (context, next) => {
			const dir = context.options.dir;
			context.data = this.parse(dir);

			console.log('[+] parse')
			next(context);
		})
	}
	parse(dir) {
		// 判断分析方式
		let data = this.anylize(dir)

		return data
	}
	anylize(dir) {
		let data = FolderParser.parseImageFrame(dir)
		// 区分多配图
		data = separateDataByRatio(data)
		return data
	}

	// 遍历文件夹拿到图片列表
	static parseImageFrame(dir) {

		const supportedSuffex = ['.jpg', '.png', '.jpeg']

		let data = {}
		// 不支持的文件列表
		let unSupportedList = []

		const iteratior = (dir, key) => {
			let files = fs.readdirSync(dir)

			files = sortByFileName(files)

        	files.map(file => {
        		const filepath = path.join(dir, file),
	            	stats = fs.statSync(filepath)
	            
	            // 目录地址进行迭代读取
	            if (!stats.isFile()) return iteratior(filepath, path.basename(filepath))

				const suffix = path.extname(filepath);

				// 忽略不支持的文件格式
				if (!~supportedSuffex.indexOf(suffix)) return unSupportedList.push(filepath)

				let {
					width,
					height
				} = sizeOf(filepath)

				data[key] = data[key] || []

				// 数据存入
				data[key].push({
					src: filepath,
					width,
					height,
					offX: 0,
					offY: 0,
					sourceW: width,
					sourceH: height,
					w: width,
					h: height,
					x: 0,
					y: 0
				});
        	})
		}
		
		// 开始迭代读取数据
		iteratior(dir, path.basename(dir))

		logUnSupportedList(unSupportedList.length > 0, unSupportedList)
        
        // TODO [error]: Can not find images

		return data
	}
}

module.exports = FolderParser;
