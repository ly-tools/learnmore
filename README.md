# learnmore

===

一个快速在github上搭建日记的工具

[DEMO](http://lingyucoder.github.io/diary/#/2015/4/10)

## 安装

```shell
$npm install -g learnmore
```

## 初始化

```shell
$lm init
```

在当前文件夹下生成日记框架，结构如下，日记写在source中，一些定制在learnmore.json中:

```
CWD --- learnmore.json
		 |
		 +- source
```

## 新建日记

```shell
$lm new

$lm new -d 2015/4/1
$lm new --date 2015/4/1
```

在source下新建一篇日记，默认新建今天的日记，可以如上确定生成日记的时间

## 构建日记

```shell
$lm build
```

构建日记，构建完成后的资源存放在__diary下

## 本地服务器

```shell
$lm server

$lm server -p 3000
$lm server --port 3000
```

启动本地服务器，默认端口4000，可以通过-p和--port更改端口

## 发布日记

```shell
$lm publish
```

快速发布日记到learnmore.json中git字段指定的项目gh-pages分支下

##TODO
目前仅为测试版，还有太多东西需要完善，还有很多bug...

##License
The MIT License (MIT)

Copyright (c) 2015 Lingyu Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




