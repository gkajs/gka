<p align="center">
  <a href ="https://github.com/joeyguo/gka"><img alt="gka" src="gka.svg"></a>
</p>
<p align="center">
  <a href ="https://github.com/joeyguo/gka"><img alt="gka" src="https://user-images.githubusercontent.com/10385585/27863888-bb5e4826-61be-11e7-8994-4b19bb49bb22.png"></a>
</p>

# GKA

> 简单的、高效的帧动画生成工具.

<a href="https://www.npmjs.org/package/gka"><img src="https://img.shields.io/npm/v/gka.svg?style=flat"></a>
<a href="https://github.com/joeyguo/gka#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>

[gka](https://github.com/joeyguo/gka) 是一款简单的、高效的帧动画生成工具，图片处理工具。

只需一行命令，快速图片优化、生成动画文件，支持效果预览。

* **一键式 :**  图片文件批量序列化重命名，生成帧动画文件，支持预览
* **性能佳 :**  支持`相同帧图片复用`✓，`图片空白裁剪`✓，`合图模式`✓，`图片压缩`✓
* **多模板 :**  内置多种文件输出模板，支持自定义模板

# 快速开始

## 安装

```bash
sudo npm i gka -g
```

## 开始使用

只需一行命令，快速生成动画文件，支持效果预览。

举例：对 E:\img 目录中的图片进行处理，只需输入命令

```bash
gka E:\img 
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
├── gkatest_1.png
├── gkatest_2.png
├── gkatest_3.png
└── ...
</code></pre></td>
<td><pre><code>
./gka-img
└── gka.html
└── gka.css
└── img
    ├── gkatest_1.png
    ├── gkatest_2.png
    ├── gkatest_3.png
    └── ...
</code></pre></td>
        </tr>
    </tbody>
</table>

![preview](https://cloud.githubusercontent.com/assets/10385585/24502038/ac4bd9f2-157e-11e7-87e0-a9a44aaffafa.gif)

# 命令总览

gka 一键图片优化、生成动画文件。

```bash
gka <dir> [options]
```

gka tool 快速图片处理，支持压图、合图、空白裁剪、去重、生成图片信息。

```bash
gka tool <dir> [options]
```

# 使用教程

## gka

一键图片优化、生成动画文件。

### Command 命令 

```bash
gka <dir> [options]
```

### Options 参数选项 

```
-d, --dir <string>            #  图片文件夹地址

-u, --unique [boolean]        #  开启相同帧图片复用 默认开启
-m, --mini                    #  开启图片压缩

-o, --output <string>         #  指定生成目录地址

-p, --prefix [string]         #  重命名前缀， 默认 prefix
-f, --frameduration <number>  #  每帧时长，默认 0.04

-i, --info                    #  输出信息文件

-t, --template <string>       #  生成动画文件模板 默认 n ，可选模见 template list
```

### Templates 模板列表
<!-- ### List of Templates Plugins  -->

文件生成模板，内置对图片进行处理及优化，使用方式

```bash
gka 图片目录 -t 模板名

```

#### 内置的模板列表

- n  [normal]

    - 默认模板 
    - [Github 地址](https://github.com/gkajs/gka-tpl-normal)

- c  [crop]

    - 空白裁剪模板，`开启空白裁剪优化`✓ `相同帧图片复用`✓
    - [Github 地址](https://github.com/gkajs/gka-tpl-crop)

- s  [sprites] 

    - 合图模板，`相同帧图片复用`✓ `开启合图优化`✓ 
    - [Github 地址](https://github.com/gkajs/gka-tpl-sprites)

- percent 

    - 自适应缩放雪碧图模板，`相同帧图片复用`✓ `开启合图优化`✓ 
    - [Github 地址](https://github.com/gkajs/gka-tpl-sprites)

- canvas 

    - 生成 canvas 文件，`开启空白裁剪优化`✓ `相同帧图片复用`✓ `开启合图优化`✓ 
    - [Github 地址](https://github.com/gkajs/gka-tpl-canvas)

#### 增加模板

模板支持动态增加，只需安装需要的模板。即时安装，即刻可用。

```bash
sudo npm i gka-tpl-模板名 -g
```

### 示例

对 E:\img 目录中的图片进行处理。

使用默认模板生成帧动画

```bash
gka E:\img
```

使用空白裁剪模板生成帧动画

```bash
gka E:\img -t c
```

使用合图模板生成帧动画，并进行图片压缩

```bash
gka E:\img -m -t s
```

## gka tool

gka tool 是图片快速处理工具，可支持压图、合图、空白裁剪、去重、生成图片信息


### Command 命令

```bash
gka tool <dir> [options]
```

### Options 参数选项

```bash
-d, --dir <string>            #  图片文件夹地址

-u, --unique                  #  开启图片去重
-c, --crop                    #  开启空白裁剪模式
-s, --sprites                 #  开启合图模式
-m, --mini                    #  开启图片压缩
-p, --prefix [string]         #  重命名前缀 默认 prefix

-o, --output <string>         #  指定生成目录地址

-i, --info                    #  输出信息文件

-a, --algorithm <string>      #  合图布局模式 默认 binary-tree，可选 top-down | left-right ..

-r, --replace                 #  压缩源图片时使用，-mr
```

### 示例

对 E:\img 目录中的图片进行处理。

进行图片压缩 （如想直接压缩源文件，请使用 -mr）

```bash
gka tool E:\img -m
```

进行图片空白裁剪

```bash
gka tool E:\img -c
```

进行图片空白裁剪、裁剪后进行合图，并输出信息文件

```bash
gka tool E:\img -csi
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
- v2.1.0 增强 help、增强 template 方案、增加 gka tool 图片工具集
- v2.2.0 剥离 template、增加 template 动态增加方案、支持使用本地 template
- v2.2.1 增加指定生成目录地址 -o、template 支持多个图片目录处理
