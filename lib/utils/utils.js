var path = require("path");
var fs = require("fs");

/*
    功能创建文件夹

    //测试代码
    mkdirSync("a/b/c",0,function(e){
        if(e){
            console.log('出错了');
        }else{
            console.log("创建成功")
        }
    });
*/
function mkdirSync(url,mode,cb){
    var path = require("path"), arr = url.split("/");
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        fs.stat(cur, function(err, stat) {
            if(err == null) {
                if(stat.isDirectory()) {
                    // console.log('文件夹存在');
                } else if(stat.isFile()) {
                    // console.log('文件存在');
                } else {
                    // console.log('路径存在，但既不是文件，也不是文件夹');
                    //输出路径对象信息
                    // console.log(stat);
                }
            } else if(err.code == 'ENOENT') {
                // console.log(err.name);
                // console.log('路径不存在');
                try{
                    fs.mkdirSync(cur, mode); // 存在的话，ignore error
                }catch(e){
                    // console.log("创建失败(文件夹已存在)：" + e)
                }

            } else {
                console.log('错误：' + err);
            }

            if(arr.length){
                inner(cur + "/"+arr.shift());
            }else{
                cb();
            }
        });
    }
    arr.length && inner(arr.shift());
}



module.exports = {
    mkdirSync: mkdirSync,
    
};
