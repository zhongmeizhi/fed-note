# 自适应布局方式

> 圣杯布局 + 双飞翼布局的最大好处：兼容低版本浏览器

### 圣杯布局：

* 设置容器的`padding`值给左右两部分留出空间。（最好再设置个`overflow: hidden;`）
  * 如果容器用`margin`留空间会导致`overflow: hidden;`把两边清理掉
* 内部三部分都设置左浮动。
* 中间宽度100%。`width: 100%`。
* 两边负边距挪动位置：`margin-left`，左边`-100%`，右边`-width px`。
  * 这边会有BUG，当中间小于两边的时候，两边会掉下去。
* 两边再挪动位置到容器padding处：设置相对定位。左边left为`-width`，右边right为`-width`。

```
    <!DOCTYPE html>
    <html lang="zh">
        <head>  
            <style>
                body {min-width: 555px;} 
                .col {position: relative;float: left;}
                #container {padding: 0 190px 0 190px; overflow: hidden;}
                #main {width: 100%;height: 400px;background-color: #ccc;}
                #left {width: 190px;height: 400px;margin-left: -100%;left: -190px; background-color: red;}
                #right {width: 190px;height: 400px;margin-left: -190px;right: -190px; background-color: pink;}
            </style>
        </head>
        <body>
            <div id="container">
                <!--先写中间部分-->
                <div id="main" class="col"></div>
                <div id="left" class="col"></div>
                <div id="right" class="col"></div>
            </div>
        </body>
    </html>
```

### 双飞翼布局

双飞翼布局在圣杯布局的基础上改进
* 容器可以什么都不做（最好加上`overflow: hidden;`）
* 内部三部分都设置左浮动
* 中间部分`width: 100%`
* 中间部分内部设置子元素：以`margin`的方式为两边留位置
* 左边设置`margin-left: -100%` + 设置自己宽度
* 右边设置`margin-left: -190px` + 设置自己宽度

优点：
* 实现比圣杯布局简单（两边不需要设置`position: relative`移动了，因为中间是通过`margin`实现的）
* 解决圣杯布局的BUG

```
    <!DOCTYPE html>
    <html>
        <head>
            <style type="text/css">
                body {min-width: 550px;}
                .col {float: left;}
                #container {overflow: hidden;}
                #main {width: 100%;height: 400px; background-color: #ccc;}
                #main-wrap {margin: 0 190px 0 300px; height: 100%;}
                #left {width: 300px;height: 400px;margin-left: -100%;background-color: red;}
                #right {width: 190px;height: 400px;margin-left: -190px;background-color: pink;}
            </style>
        </head>
        <body>
            <div id="container">
                <div id="main" class="col">
                    <div id="main-wrap"></div>
                </div>
                <div id="left" class="col"></div>
                <div id="right" class="col"></div>
            </div>
        </body>
    </html>
```

### 左右固定，中间自适应

优点：简单粗暴
缺点：div的顺序优点怪

```
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {min-width: 550px;}
                #container {overflow: hidden;}
                #main {background: #ccc; height: 100px; margin: 0 190px;}
                #left {background: red; height: 100px; width: 190px; float: left;}
                #right {background: pink; height: 100px; width: 190px; float: right;}
            </style>
        </head>
        <body>
            <div id="container">
                <div id="left">1</div>
                <div id="right">3</div>
                <div id="main">2</div>
            </div>
        </body>
    </html>
```

### 多栏自适应布局

利用 BFC 特性实现

PS：一般情况浮动放图片，否则最好还是设置宽度

```
    <!DOCTYPE html>
    <html>
        <head>
            <style type="text/css">
                body { min-width: 550px; }
                .container { overflow: hidden; }
                .left { float: left; width: 190px; background: red; height: 200px; }
                .main { overflow: hidden; background: #CCC; height: 200px; }
                .right { float: right; width: 190px; background: pink; height: 200px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="left">阿诗丹顿，案发生的快捷方式肯定你，阿斯蒂芬喀什巴靠你了1</div>
                <div class="right">阿诗丹顿，案发生的快捷方式肯定你，阿斯蒂芬喀什巴靠你了1</div>
                <div class="main">阿诗丹顿，案发生的快捷方式肯定你，阿斯蒂芬喀什巴靠你了1</div>
            </div>
        </body>
    </html>
```


### flex布局

优点：实现简单粗暴。
缺点：有点兼容性问题
* PC端兼容 IE10+
* 移动端还是OK的

```
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                #container {display: flex; flex-flow: row;}
                #left {background: red; height: 100px; width: 190px;}
                #main {background: #ccc; height: 100px; flex: 1;}
                #right {background: pink; height: 100px; width: 190px;}
            </style>
        </head>
        <body>
            <div id="container">
                <div id="left"></div>
                <div id="main"></div>
                <div id="right"></div>
            </div>
        </body>
    </html>
```

### end

尝试了`display: inline-block;` + `calc()`的布局，但是由于`inline-block;`对中文编码会导致中间部分换行（英文是OK的），通过设置`overflow: hidden;`后有缓解，但是如果三部分的高度不一样会导致模块都靠在下边。而且inline-block还要处理dom间距的问题。
