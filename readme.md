<p align="center">
<a href ="https://github.com/joeyguo/gka"><img alt="gka" src="https://user-images.githubusercontent.com/10385585/28497647-cfc6ceba-6fbe-11e7-9f32-9ff1895b893b.png"></a>
</p>
<p align="center">
 <a href ="https://github.com/joeyguo/gka"><img alt="gka" src="https://user-images.githubusercontent.com/10385585/27863888-bb5e4826-61be-11e7-8994-4b19bb49bb22.png"></a>
</p>
<p align="center">
简单的、高效的帧动画生成工具
</p>
<p align="center">
<a href="https://www.npmjs.org/package/gka"><img src="https://img.shields.io/npm/v/gka.svg?style=flat"></a>
<a href="https://www.npmjs.org/package/gka"><img src="https://img.shields.io/node/v/gka.svg?maxAge=2592001"></a>
<a href="https://github.com/joeyguo/gka#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
<a href="https://github.com/joeyguo/gka"><img src="https://camo.githubusercontent.com/d4e0f63e9613ee474a7dfdc23c240b9795712c96/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5052732d77656c636f6d652d627269676874677265656e2e737667"></a>
</p>

--- 

# GKA

[gka](https://github.com/joeyguo/gka) 是一款简单的、高效的帧动画生成工具，图片处理工具。

只需一行命令，快速图片优化、生成动画文件，支持效果预览。

* **一键式:**  图片文件批量序列化重命名，生成帧动画文件，支持预览
* **性能佳:**  支持`相同图片复用`✓ `图片空白裁剪`✓ `合图优化`✓ `图片压缩`✓ `图片空白拆分优化`✓ `图片像素差优化`✓
* **多模板:**  内置多种文件输出模板，支持自定义模板

在线官方文档：[https://gka.js.org](https://gka.js.org)

![gka-show](https://user-images.githubusercontent.com/10385585/28651130-77b0bc80-72b2-11e7-9c42-7aad9e5774a7.jpg)

# 快速开始

## 安装

```bash
npm i gka -g
```

## 开始使用

只需一行命令，快速生成动画文件，支持效果预览。

```bash
gka E:\img  # 对 E:\img 目录中的图片进行处理
```

生成新的文件、效果预览

<table>
    <thead>
        <tr><th>处理前</th><th>处理后</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>
./img
├── gka_1.png
├── gka_2.png
├── gka_3.png
└── ...
</code></pre></td>
<td><pre><code>
./gka-img
└── gka.html
└── gka.css
└── img
    ├── gka_1.png
    ├── gka_2.png
    ├── gka_3.png
    └── ...
</code></pre></td>
        </tr>
    </tbody>
</table>

![rockit](https://user-images.githubusercontent.com/10385585/28810071-499e24a2-76ba-11e7-9ee8-cd600c0035b1.gif)

# 使用教程

## gka

一键快速图片优化、生成动画文件。

### Command 命令 

```bash
gka <dir> [options]
```

### Options 参数选项 

```
-d, --dir <string>            #  图片文件夹地址

-u, --unique [boolean]        #  开启相同图片复用优化

-c, --crop [boolean]          #  开启空白裁剪优化

-s, --sprites [boolean]       #  开启合图优化

-m, --mini [boolean]          #  开启图片压缩

-p, --prefix [string]         #  文件重命名前缀

-t, --template <string>       #  生成动画文件模板 默认 css ，可选模见 Templates 模板列表

-f, --frameduration <number>  #  每帧时长，默认 0.04

-i, --info [boolean]          #  开启输出信息文件

-o, --output <string>         #  指定生成目录地址

-a, --algorithm <string>      #  合图布局模式 默认 left-right，可选 binary-tree | top-down ..

--bgcolor <string>            #  为图片增加背景色，可选，支持格式：'rgb(255,205,44)'、 '#ffcd2c'

--count <number>              #  生成多合图，指定几张图片合成一张合图，可选

--split [boolean]             #  开启图片空白拆分优化，与 -t canvas 结合使用

--diff [boolean]              #  开启图片像素差优化，与 -t canvas 结合使用

```

### Templates 模板列表
<!-- ### List of Templates Plugins  -->

使用方式

```bash
gka 图片目录 -t 模板名
```

#### 内置的模板列表

- css

    - 默认模板
    - 输出 css 动画文件
    - 结合 -ucs 支持 `相同帧图片复用`✓ `空白裁剪优化`✓ `合图优化`✓ (可选) 

- canvas

    - 输出 canvas 动画文件
    - 结合 -ucs 支持 `相同帧图片复用`✓ `空白裁剪优化`✓ `合图优化`✓ (可选) 
    - 结合 --diff 支持 `图片像素差优化`✓ (可选) 
    - 结合 --split 支持 `图片空白拆分优化`✓ (可选) 

- svg

    - 输出 svg 动画文件，支持 `自适应缩放雪碧图`✓ 
    - 结合 -ucs 支持 `相同帧图片复用`✓ `空白裁剪优化`✓ `合图优化`✓ (可选) 

#### 内置的自定义模板列表

- percent 

    - 输出 css 百分比动画文件
    - 使用该方案支持 `移动端多倍图适配`✓ `自适应缩放雪碧图`✓ 
    - 结合 -u 支持 `相同帧图片复用`✓ (可选) 
    - 默认开启 `开启合图优化`✓
    - [Github 地址](https://github.com/gkajs/gka-tpl-percent)
    
- createjs 

    - 输出 createjs 精灵图动画文件
    - 结合 -uc 支持 `相同帧图片复用`✓ `空白裁剪优化`✓ (可选) 
    - 默认开启 `开启合图优化`✓
    - [Github 地址](https://github.com/gkajs/gka-tpl-createjs)

- studiojs 

    - 输出 studiojs 动画文件
    - 结合 -uc 支持 `相同帧图片复用`✓ `空白裁剪优化`✓ (可选) 
    - 默认开启 `开启合图优化`✓
    - [Github 地址](https://github.com/gkajs/gka-tpl-studiojs)

#### 增加模板

模板支持动态增加，只需安装需要的模板。即时安装，即刻可用。

```bash
npm i gka-tpl-模板名 -g
```

### 使用示例

对 E:\img 目录中的图片进行处理。

1. 快速生成帧动画

```bash
gka E:\img
```

2. 进行图片去重、合图优化，输出 css 动画文件

```bash
gka E:\img -us
```

3. 进行图片去重、空白裁剪、合图优化，使用 canvas 模板，输出 canvas 动画文件

```bash
gka E:\img -ucs -t canvas
```

# 定制化

<!-- ## List of Templates -->
## 开发模板 TODO

#### 命名规范
#### 开发流程
#### 发布模版
#### 使用模板

# Welcome

* 欢迎 Pull requests、Issues 一般在24小时内处理
* 讨论与咨询请+QQ 3201590286  :D

# License

[MIT](./LICENSE) 

Copyright (c) 2017 - present, joeyguo

# Change Log

- v1.0.x 重命名图片文件、 生成 keyframe animation css 动画、自动化合图、自动化图片压缩、效果预览
- v1.1.0 相同帧图片复用
- v1.4.5 支持输出信息文件、合图布局参数
- v1.4.6 增加图片预加载
- v2.0.0 增加图片裁剪模式、暴露图片去重开关、增加模板选择、优化图片信息文件
- v2.1.0 增强 help，增强 template 方案，增加 gka tool 图片工具集
- v2.2.0 剥离 template、增加 template 动态增加方案、支持使用本地 template
- v2.2.1 增加指定生成目录地址 -o、template 支持多个图片目录处理
- v2.2.2 优化支持相对路径、增加文件夹无图片时提示
- v2.2.3 剥离 imagex、合图时输出信息file指向合图
- v2.4.0 增加 --count 参数 用于指定几张图片合成一张合图、支持多合图生成及多合图模板动画
- v2.5.0 增加 --bgcolor 为图片增加背景色、增加 --diff 参数 用于开启像素复用优化、增加 --split 参数 用于开启图片拆分优化、当生成的目标目录保持新增，不覆盖、修复全透明图片空白裁剪的问题
- v2.6.0 除去 gka tool，重构使用data数据流转，模板更新及内置
