gka -d dir -sct -p prefix -f 0.08 -a binary-tree -g pct

-d 目录
-p 前缀
-sct 合图|去空|压缩
-f 帧时长
-a 合图模式
-g 生成css内容（px或百分比，提供参数用户可自定义生成）

t       压图

c       去空
s       合图
s_c     合图 去空

px      像素 不合图 不去空
px_c    像素 不合图 去空
px_s    像素 合图   不去空
px_s_c  像素 合图   去空

pct     百分比 不合图 不去空
pct_c   百分比 不合图 去空
pct_s   百分比 合图   不去空
pct_s_c 百分比 合图   去空


{"file":"啊啊.png","frames":{
"hello-01":{"x":1790,"y":1094,"w":229,"h":548,"offX":24,"offY":28,"sourceW":316,"sourceH":600},
"hello-02":{"x":1049,"y":1092,"w":230,"h":549,"offX":24,"offY":27,"sourceW":316,"sourceH":600},