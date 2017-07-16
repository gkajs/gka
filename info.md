去重 --unique -u
压缩 --mini   -m  Ω TODO 增加压缩 level
合图 --sprite -s  Ω algorithm(binary-tree)
去空 --trim   -t

模板 --template -tpl 
Ω fps(25)、algorithm(binary-tree)

gka dir -tusm -tpl pct -p prefix -a binary-tree -f 0.08 


```
gka dir -cstr -g pct -p prefix -a binary-tree -f 0.08 

gka dir -m 压缩图片 Ω Todo 增加压缩 level
gka dir -s 合图，Ω algorithm(binary-tree)
gka dir -t 图片去空
gka dir -u 图片去重

gka dir -p prefix 图片重命名 prefix[1-n].suffix
Ω p(prefix-)

gka dir -g 生成帧动画
Ω gen(px),t(true),u(true),p(gka-),duration(0.04)

```

-d 目录
-p 前缀
-sct 合图|去空|压缩
-f 帧时长
-a 合图模式
-g 生成css内容（px或百分比，提供参数用户可自定义生成）

t       压图
c       去空 + info
s       合图 + info
r		去重 + info
p		重命名

sc     	合图 去空 + info

engine:
[css|html]

px      像素 不合图 不去空
px_c    像素 不合图 去空
px_s    像素 合图   不去空
px_s_c  像素 合图   去空

pct     百分比 不合图 不去空
pct_c   百分比 不合图 去空
pct_s   百分比 合图   不去空
pct_s_c 百分比 合图   去空

去空 -> 去重 -> 图片生成(合图或普通) -> 压缩
								-> 生成帧动画(html|css|js)
src2info[cutFilepath] = {
                        offX: top,
                        offY: left,
                        w: width,
                        h: height,
                        sourceW: this.width,
                        sourceH: this.height,
                        // data: png.data,
                    };

{"file":"啊啊.png","frames":{
"hello-01":{"x":1790,"y":1094,"w":229,"h":548,"offX":24,"offY":28,"sourceW":316,"sourceH":600},
"hello-02":{"x":1049,"y":1092,"w":230,"h":549,"offX":24,"offY":27,"sourceW":316,"sourceH":600},


// info
var info = {
    "w": 1360, // 合图宽高（frame当前图片所在的图片的宽高），不合图时则等于frame当前宽高，则省略
    "h": 900,
    "file": "prefix-gka_sprites.png", // 通用 frame 当前图片
    <!-- "x": 0,    // 通用 frame 当前图片坐标，不合图时为 0，0 则省略 -->
    <!-- "y": 600, -->
    "width": 170,  // 通用 frame 当前图片宽度
    "height": 300,
    "sourceW":316, // 通用 frame 原图片宽高，不 cut 时等于当前图片宽高 则省略
    "sourceH":600
    "frames": {
        "02.png": {		   // 原图片名
        	<!-- "w": 1360, // 当前图片所在的图片的宽高，不合图时则等于当前图片宽高，则省略 -->
    		<!-- "h": 900, -->
    		"file": "prefix-1.png", // 当前图片名
            "x": 0,        // 当前图片坐标
            "y": 600,
            "offX":242,    // 当前图片相对于原图片的偏移，不 cut 时为 0，0 则省略
            "offY":28,
            "width": 170,  // 当前图片宽度
            "height": 300,
            "sourceW":316, // 原图片宽高，不 cut 时等于当前图片宽高 则省略
            "sourceH":600
        },
        "05.png": {
            "x": 0,
            "y": 600,
            "offX":242,
            "offY":28,
            "width": 170,
            "height": 300,
            "sourceW":316,
            "sourceH":600
        }
    }
}


function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  } else {
    const last = funcs[funcs.length - 1]
    const rest = funcs.slice(0, -1)
    return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
  }
}

var c = compose(a, b); // 将a,b函数进行组合
c('c');  // => cba

function a(cb){
	return function(obj) {
		console.log(obj)
		++obj;
		cb(obj);
	}
}

function b(cb){
	return function(obj) {
		console.log(obj)
		++obj;
		cb(obj);
	}
}

function c(cb){
	return function(obj) {
		console.log(obj)
		++obj;
		cb(obj);
	}
}

a(b)(c)(1)

