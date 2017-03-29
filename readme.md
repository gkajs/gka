# `G`enerate  `K`eyframes  `A`nimation

#  [gka](https://github.com/joeyguo/gka)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/joeyguo/gka#license) 

[gka](https://github.com/joeyguo/gka) 是一款高效、高性能的帧动画生成工具。

通过对图片集进行处理，一键式生成序列帧动画文件，并内置相关优化。

* **一键式 :**  图片文件批量序列化重命名，生成 css keyframes，生成帧动画预览文件
* **性能佳 :**  支持图片压缩✓，支持`合图模式`✓，`相同帧图片复用`✓

# Install

```sh
$ sudo npm install -g gka
```

# Usage

### `gka <options> <files>`
```
-d, --dir <string>       -d 图片文件夹地址
-p, --prefix <string>     -p 重命名前缀
-s, --sprites <boolean>   -s true 开启合图模式

-t, --tiny <string>       -t 图片文件夹地址 压缩图片
```


```sh
# 帧动画生成 - 普通模式

$ gka -d [imageFolderPath] -p [prefix] 
```

```sh
# 帧动画生成 - 合图模式

$ gka -d [imageFolderPath] -p [prefix] -s true
```

```sh
# 压缩图片

$ gka -t [imageFolderPath]
```

# Examples

### 生成帧动画 &middot; `普通模式`

1.示例参数： 

- 图片目录：E:\gka-test\img
- 图片名前缀：prefix

2.命令

```sh
# gka -d [imageFolderPath] -p [prefix] 

$ gka -d E:\gka-test\img -p prefix
```

3.结果： 
<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>
./img
├── 害羞_00000.png
├── 害羞_00001.png
├── 害羞_00002.png
├── 害羞_00003.png
├── 害羞_00004.png
└── ...
</code></pre></td>
<td><pre><code>
./img-gka
└── gka.html
└── gka.css
└── img
    ├── prefix001.png
    ├── prefix002.png
    ├── prefix003.png
    ├── prefix004.png
    └── ...
</code></pre></td>
        </tr>
    </tbody>
</table>

## 生成帧动画 &middot; `合图模式`

1.示例参数： 

- 图片目录：E:\gka-test\img
- 图片名前缀：prefix

2.命令

```sh
# gka -d [imageFolderPath] -p [prefix] -s true

$ gka -d E:\gka-test\img -p prefix -s true
```

3.结果： 
<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>
./img
├── 害羞_00000.png
├── 害羞_00001.png
├── 害羞_00002.png
├── 害羞_00003.png
├── 害羞_00004.png
└── ...
</code></pre></td>
<td><pre><code>
./img-gka-sprites
└── gka.html
└── gka.css
└── prefix-sprites.png
</code></pre></td>
        </tr>
    </tbody>
</table>

## 图片压缩

1.示例参数： 

- 图片目录：E:\gka-test\img

2.命令
```sh
# gka -t [imageFolderPath]

$ gka -t E:\gka-test\img
```

# License

[MIT](./LICENSE) 

# Log

- v1.0.x 重命名图片文件、 生成 keyframe animation css 动画、自动化合图、自动化图片压缩、效果预览
- v1.1.0 相同帧图片复用
