var fs = require('fs');  
var path = require('path');  

function mkdirSync(dirpath,dirname){
	if(typeof dirname === "undefined"){   
	    if(fs.existsSync(dirpath)){  
	        return;  
	    }else{  
	        mkdir(dirpath,path.dirname(dirpath));  
	    }  
	}else{  
	    if(dirname !== path.dirname(dirpath)){   
	        mkdir(dirpath);  
	        return;  
	    }  
	    if(fs.existsSync(dirname)){  
	        fs.mkdirSync(dirpath)  
	    }else{  
	        mkdir(dirname,path.dirname(dirname));  
	        fs.mkdirSync(dirpath);  
	    }  
	}  
}  

function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}

// 文件写入
// 支持数组形式 [dir, '..', cssName]
function writeSync(filepath, content) {
	filepath = isArray(filepath) ? path.join.apply({}, filepath) : filepath;
	mkdirSync(path.dirname(filepath));
	fs.writeFileSync(filepath, content);
	console.log(` ✔ ${path.basename(filepath)} generated`);
}

// 文件读取
// 支持数组形式 [dir, '..', cssName]
function readFileSync(filepath) {
	filepath = isArray(filepath) ? path.join.apply({}, filepath) : filepath;
	return fs.readFileSync(filepath, 'utf8')
}

module.exports = {
	writeSync,
	readFileSync,
}