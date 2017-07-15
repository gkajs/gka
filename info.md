
```
gka dir -cstr -g pct -p prefix -a binary-tree -f 0.08 

gka dir -t 压缩图片 Ω Todo 增加压缩 level
gka dir -s 合图，Ω algorithm(binary-tree)
gka dir -c 图片去空
gka dir -r 图片去重

gka dir -p prefix 图片重命名 prefix[1-n].suffix
Ω p(prefix-)

gka dir -g 生成帧动画
Ω gen(px),c(true),r(true),p(gka-),duration(0.04)

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

{"file":"啊啊.png","frames":{
"hello-01":{"x":1790,"y":1094,"w":229,"h":548,"offX":24,"offY":28,"sourceW":316,"sourceH":600},
"hello-02":{"x":1049,"y":1092,"w":230,"h":549,"offX":24,"offY":27,"sourceW":316,"sourceH":600},


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

