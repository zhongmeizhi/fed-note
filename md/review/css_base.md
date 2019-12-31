# CSS 基础

### BFC

块状格式化上下文（block formatting context）简称 `BFC`：是页面上的一个隔离的独立容器,容器里面的子元素不会影响到外面的元素。

如何触发BFC？
1. 根元素（`html`）: 最大的BFC
2. `position` 设置为 `fixed` 或者 `absolute`
3. display 设置为 `inline-block` 、`table-block` 、 `table-caption`
4. `overflow` 的值不为 `visible`
5. `float` 的值不为 `none`
6. [MDN 格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

BFC的定位方案
1. 内部的box会在 **垂直方向上** 一个接一个的摆放
2. 属于同一个BFC中的两个相邻元素的 **垂直方向上 margin** 会重叠
3. BFC中每个元素的左边margin会与包含块的左边border相接触
4. 计算BFC的高度时，浮动元素也会参与计算


### 选择器权重

Css选择器优先级
1. !important -> 最高
2. 内联style -> 1000
3. id -> 100
4. class -> 10
5. tag -> 1
6. 继承样式

### margin 属性

1. `margin` 属性为给定元素设置所有四个（上下左右）方向的外边距属性。
2. 普通元素的 百分比margin 都是相对于容器的`宽度`计算的
3. 绝对定位元素的 百分比margin 相对于其定位祖先元素的宽度计算的
4. 上下margin会重叠：只会发生在 `block` 元素上，（取最大值）
   1. 解决重叠方法：
   2. **父元素**设置 `BFC`（如overflow：hidden；如position：absolute等）
   3. **父元素**设置 `border`/`padding`
5. 当 margin 的值为 `auto` 时。浏览器会自动选择一个合适的margin来应用（自动分配剩余空间）
   1. 需要元素是 块状元素
   2. 需要元素 设置宽度
6. margin 可以为 负值


### 水平居中 简单版

1. 内联元素
```
    text-align: center;
```
2. 固定宽度的 块状元素
```
    // 设置 左右 margin 为 auto
    margin: 0 auto;
```


### 垂直居中 简单版

1. 单行文本 垂直居中 -> `line-height`
2. 多行文本 垂直居中
```
    // vertical-align 只对行内元素、表格单元格元素生效
    // 指定 行内元素/表格单元元素 基线相对于 块状元素基线的位置

    .center-table {
        display: table;
    }
    .center-table p {
        display: table-cell;
        vertical-align: middle;
    }
```


### 元素居中（水平且垂直） 进阶

1. 固定宽高 居中

通过 绝对定位 + 负margin
```
    #main{
        position: relative;
        // ... 略
    }
    #center{
        position: absolute;
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        margin: -50px;
    }
```

通过 绝对定位 + `margin: auto;`
```
    #main{
        position: relative;
        // ... 略
    }
    #center{
        width: 100px;
        height: 100px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        position: absolute;
    }
```

2. 不定宽高

transform 居中
```
    #main{
        position: relative;
        // ... 略
    }
    #center{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
```

flex 居中（一）
```
    #main{
        display: flex; 
        justify-content: center; 
        align-items: center;
    }
```

flex 居中（二）
```
    #main{
        display: flex;
        // ... 略
    }
    #center{
        margin: auto;
    }
```


### 浏览器如何解析 css

1. css 的解析是从上往下
2. 渲染顺序也是从上往下
3. 下载和渲染是同时进行的。
4. css的解析和js的解析是不能同时进行的
5. `css选择器` 的解析是从右向左解析
   1. （jQuery选择器解析方式同理）
   2. 能先确定元素位置，减少匹配次数


### CSS属性支持判断

1. 利用属性覆盖原理

将高版本浏览器支持的特性写在后面。利用浏览器的2个CSS解析特性：
   * 后面的属性覆盖前面的属性
   * 遇到不认识的语法，CSS parser 不解析。
```
    div {
        background: red;
        background: linear-gradient(90deg, red, yellow)
    }
```

2. 使用 `.css` 的 `@supports` 来判断属性支持情况
```
    // 支持特定属性的处理
    @supports (position:sticky) {
        div {
            position:sticky;
        }
    }
    
    // 不支持特定属性：用not处理
    @supports not (background: linear-gradient(90deg, red, yellow)) {
        div {
            background: red;
        }
    }

    // 如果是多个css属性：用and处理
    @supports (display:-webkit-box) and (-webkit-line-clamp:2) and (-webkit-box-orient:vertical) {
        p {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
```

3. 使用 JS 判断 CSS 属性支持情况

作为 @supports 的另一种形式出现的，我们可以使用 javascript 的方式来获得 CSS 属性的支持情况。

`CSS.supports('display', 'flex');`  必须2个参数， 否则返回false，（目前不支持IE浏览器）

4. 使用 JS 库 `modernizr`

如果浏览器不支持`@supports`，可以通过调用ele.style来判断属性支持情况（库：[Modernizr](https://github.com/Modernizr/Modernizr)）

5. 通过判断 赋值再查询 来判断是否支持
```
    var root = document.documentElement; //HTML
 
    for(var key in root.style) {
        console.log(key);
    }

    // 将会打印
    // alignContent
    // alignItems
    // alignSelf
    // alignmentBaseline
    // all
    // animation
    // ...
```

元素可能有 background 属性，但是不支持具体的 linear-gradinet() 属性值。这个时候该如何检测呢？只需要将具体的值赋值给某一元素，再查询这个属性值能否被读取。

```
    var root = document.documentElement;
 
    root.style.backgroundImage = 'linear-gradient(90deg, #888, #ccc)';
    
    if(root.style.backgroundImage) {
    // 支持
    } else {
    // 不支持
    }
```


### 简单的 CSS 属性支持封装

通过页面隐藏的元素进行测试。

```
    /**
    * 用于简单的 CSS 特性检测
    * @param [String] property 需要检测的 CSS 属性名
    * @param [String] value 样式的具体属性值
    * @return [Boolean] 是否通过检查
    */
    function cssTest(property, value) {
        // CSS && CSS.supports
        // CSS.supports('display', 'flex');  必须2个参数， 否则返回false
        
        // 用于测试的元素，隐藏在页面上
        var ele = document.getElementById('test-display-none');
    
        // 只有一个参数的情况
        if(arguments.length === 1) {
            if(property in ele.style) {
                return true;
            }
        // 两个参数的情况
        }else if(arguments.length === 2){
            ele.style[property] = value;
    
            if(ele.style[property]) {
                return true;
            }
        }
    
        return false;
    }
```


### position定位 细节

position: absolute;
* 相对于 非static的先辈元素定位
* 如果先辈元素全是`static`，那么相对于**视口**定位

position：fixed
* 相对于视口定位
* 如果先辈元素有`非none`的`transform`属性，那么相对于该先辈元素定位
  * （不注意容易产生BUG）


### visibility:hidden、display:none、z-index=-1、opacity：0



### 清除浮动

浮动元素脱离了文档流，不能撑开元素。需要清除浮动。

清除浮动的方法
1. 伪元素 + `clear: both;`
```
    // 全浏览器通用的clearfix方案
    // 引入了zoom以支持IE6/7
    .clearfix:after {
        display: table;
        content: " ";
        clear: both;
    }
    .clearfix{
        *zoom: 1;
    }

    // 全浏览器通用的clearfix方案【推荐】
    // 引入了zoom以支持IE6/7
    // 同时加入:before以解决现代浏览器上边距折叠的问题
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: " ";
    }
    .clearfix:after {
        clear: both;
    }
    .clearfix{
        *zoom: 1;
    }
```
2. 给父元素设置 `overflow: hidden;`
3. 空白元素 + `clear: both;` （和伪元素实现原理一样，不过 low 很多）


### rem em px vw

* `px`：(pixel 像素的缩写)，相对于显示器屏幕分辨率
* `em`：相对于父元素的 `font-size`
* `rem`：可想成 `root-em`，相对于 root（html）的 `font-size`
* `vw`：相对视口（viewport）的宽度而定的，长度等于视口宽度的 1/100


### 伪类和伪元素的作用和区别

伪类：伪类选择元素基于的是当前元素处于的状态，或者说元素当前所具有的特性，功能和class有些类似，但它是基于文档之外的抽象，所以叫伪类（:first-child   :link   :visitive   :hover   :focus   :lang）


伪元素：伪元素控制的内容实际上和元素是相同的，但是它本身只是基于元素的抽象，**不存在于文档中**，所以叫伪元素（:first-line  :first-letter   :befoe   :after)

