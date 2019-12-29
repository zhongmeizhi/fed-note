# CSS 基础

css 常用知识点全在这里了。

总结是对自己能力的提升，也希望能帮助到同学们。

### BFC

块状格式化上下文（block formatting context）简称 `BFC`：是页面上的一个隔离的独立容器,容器里面的子元素不会影响到外面的元素。

如何触发BFC？
1. 根元素（html）: 最大的BFC
2. position 设置为 fixed 或者 absolute
3. display设置为 inline-block 、table-block 、 table-caption
4. overflow的值不为visible（默认）
5. float的值不为none（默认）
BFC的定位方案
1. 内部的box会在垂直方向上一个接一个的摆放
2. box垂直方向的距离由margin决定，属于同一个BFC中的两个相邻box的margin会重叠（注意是垂直方向上）
3. BFC中每个元素的左边margin会与包含块的左边border相接触
4. 计算BFC的高度时，浮动元素也会参与计算

### 选择器权重

Css选择器优先级
1. !important
2. 内联style -> 1000
3. id -> 100
4. class -> 10
5. tag -> 1
6. 继承样式

### 居中

### 相对/绝对定位

### flex

### visibility:hidden、display:none、z-index=-1、opacity：0

### 清除浮动


### rem em px vw

### 伪类和伪元素

### 清除浮动


Module One. Css
'流'概念
'流'是css的一种基本定位和布局机制，HTML默认的布局机制就是'流布局',是一种自上而下（例如块级元素div），从左到右（例如内联元素span）排列的布局方式
盒模型
元素按照盒模型的规则在页面中进行布局，它是由content+ margin + border + padding组成
盒模型可以分为两种：

### IE盒模型（怪异盒模型）

width = border + padding + content
一个块的宽度 = width + margin

W3C盒模型（标准盒模型）

width = content
一个块的宽度 = width + padding + border + margin


### Css伪类与伪元素有什么区别？
伪类选择元素基于的是当前元素处于的状态，或者说元素当前所具有的特性
而不是元素的di、class、属性等静态的标签
由于状态是动态变化的，所以一个元素达到一个特定状态时，他可能得到伪类的样式；当状态改变时，他又失去这个样式。

由此可以看出，他的功能和class有些类似，但它是基于文档之外的抽象，所以叫伪类
（:first-child   :link   :visitive   :hover   :focus   :lang）


伪元素：
与伪类针对特殊状态的元素不同的是，伪元素对元素中的特定内容进行操作，
它所操作的层次比伪类更深一层，
也因此它的动态性比伪类要低得多。它控制的内容实际上和元素是相同的，
但是它本身只是基于元素的抽象，并不存在于文档中，所以叫伪元素
（:first-line  :first-letter   :befoe   :after)
display 各值解析



垂直居中

line-height 适合纯文字类内容居中
父元素设置相对定位，子元素设置绝对定位，标签通过margin实现自适应居中
万能flex

{
    display:flex;
    align-items:center;
}

父元素设置相对定位，子元素设置绝对定位，通过transform实现居中
父元素设置display:table + 子元素设置vertical-align:middle

垂直水平居中

万能flex（个人推荐）

{
    display:flex;
    justify-content:center;
    align-items:center;
}

position + transform （宽高未知）

父元素
{
    position:relative;
}
子元素
{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

position + margin （宽高确定）

父元素
{
    position: relative;
}
子元素
{
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px;
}

绝对定位设置各个方向为0，通过margin:auto实现垂直水平居中（宽高已知）

父元素
{
    position: relative;
}
子元素
{
    width: 100px;
    height: 100px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
}

### 定位 position
position属性共有5和属性值，分别如下

relative 相对定位，相对于自身位置进行定位

很多人不明白相对于自身位置是什么意思，其实可以这样理解：

    将本身当前位置固定住，以此位置进行定位

absolute 绝对定位，相对于position不为static的第一个父级元素进行定位
fixed 固定定位。相对于浏览器窗口进行定位
inherit 继承父级元素position属性值
static 默认值，即没有定位，仍为文档流

对于position，需要注意的是absolute到底是相对于哪一个父级进行定位
css3新增了一个新的定位属性. sticky，作用类似于relative和fixed. 元素在跨越特定阈值前为相对定位，跨越之后为固定定位。
浮动布局是什么？优劣势在哪？
浮动布局. 当元素设置了浮动后，可以向左向右移动，直到它的外边缘碰到包含它的框或者另外一个浮动元素的边框为止。
浮动元素脱离了正常文档流，可以想象成浮动元素浮在了正常文档流上方，文档流不再有这个元素存在
优点
在图文混排的场景下十分适用，可以实现文字环绕图片的效果，当元素浮动后，它有着块级元素的特点（可设置宽高），但它与inline-block存在差别

float可以在横向排序上设置方向，而inline-block不可
inline-block会出现存在空白间隙情况

缺点
float致使元素脱离文档流，若父元素高度自适应，则会引起父元素高度塌陷
清除浮动（常见面试题）

通过伪类选择器清除浮动（关键方式）

<div class="Parent">
    <div class="Float"></div>
</div>

设置 .Parent:after伪元素
.Parent:after{
      /* 设置添加子元素的内容是空 */
      content: '';  
      /* 设置添加子元素为块级元素 */
      display: block;
      /* 设置添加的子元素的高度0 */
      height: 0;
      /* 设置添加子元素看不见 */
      visibility: hidden;
      /* 设置clear：both */
      clear: both;
}

父级元素添加overflow属性，或者设置高度（原理是触发父元素BFC）

<div class="Parent" style="overflow:hidden">//auto 也可以
    <div class="Float"></div>
</div>

添加额外标签

<div class="Parent">
    //添加额外标签并且添加clear属性
    <div style="clear:both"></div>
    <div class='Float'></div>
</div>

▲ 注意：设置元素浮动后，该元素的display值会变为block
当position跟display、overflow、float这些特性相互叠加后会出现什么情况？
- display：规定元素应该生成的框的类型（子元素的排序方式）
- position：规定元素的定位类型
- float：定义元素在哪个方向浮动

其中，position:absolute / fixed 优先级最高
当position设置为absolute或者fixed时，float失效，display需要调整
float / absolute定位的元素，只能是块元素或表单（block / table）
布局精英. flex 布局
该布局提供了一种更高效的方法对容器中的项目进行布局、对齐和分配空间，他没有方向上的限制，可以由开发人员自由操作
使用场景： 移动端开发，安卓，iOS
容器属性（6）

flex-direction 决定主轴方向（容器排列方向）

flex-direction: row | row-reverse | column | column-reverse;

flex-wrap 如果一条轴线排不下，定义换行规则

flex-wrap: nowrap | wrap | wrap-reverse;

flex-flow flex-direction和flex-wrap的简写形式

flex-flow: <flex-direction> || <flex-wrap>;

justify-content 定义容器在主轴上的对齐方式

justify-content: flex-start | flex-end | center | space-between | space-around;

align-items 定义容器在交叉轴上的对齐方式

align-items: flex-start | flex-end | center | baseline | stretch;

align-content 定义多根轴线的对齐方式，如果容器只有一根轴线，该属性不起作用

align-content: flex-start | flex-end | center | space-between | space-around | stretch;
项目属性（6）

order 定义项目的排列顺序，数值越小，排列越靠前，默认为0
flex-grow 定义项目的放大比例，默认为0（即如果存在剩余空间，也不放大）
flex-shrink 定义项目的缩小比例，默认为1（即如果空间不足，该项目将缩小）
flex-basis 定义了在分配多余空间之前，项目占据的主轴空间。默认值为auto（项目本来大小）
flex 是flex-grow、flex-shrink和flex-basis的简写，默认值为 0 1 auto

flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

该属性有两个快捷值: auto(1 1 auto) 和 none(0 0 auto)

建议优先使用这个属性，而不是单独写三个分离的属性

因为浏览器会推算相关值

align-self 允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性，默认值为auto（表示继承父元素align-items属性，如果没有父元素，等同于stretch）

align-self: auto | flex-start | flex-end | center | baseline | stretch;
经典布局案例. 三栏布局
三栏布局. 左右容器自适应，中间容器自适应
三栏布局在实际中十分常用，也是css面试常题，实现方法有如下三种：
<div class="container">
    <div class="left">left</div>
    <div class="main">main</div>
    <div class="right">right</div>
</div>

第一种方式：flex
.container{
    display: flex;
}
.left{
    flex-basis:200px;
    background: green;
}
.main{
    flex: 1;
    background: red;
}
.right{
    flex-basis:200px;
    background: green;
}

第二种方式：position + margin
.left,.right{
    position: absolute;
    top: 0;
    background: red;
}
.left{
    left: 0;
    width: 200px;
}
.right{
    right: 0;
    width: 200px;
}
.main{
    margin: 0 200px ;
    background: green;
}

第三种方式 float + margin
.left{
    float:left;
    width:200px;
    background:red;
}
.main{
    margin:0 200px;
    background: green;
}
.right{
    float:right;
    width:200px;
    background:red;
}
Css3有哪些新特性？

各种css选择器
圆角border-radius
多列布局
文本效果
线性渐变
2D转换
过渡transition
动画animation
flex布局
旋转transform
媒体查询

### 浏览器如何解析Css选择器？
css选择器的解析是从右向左解析，为了避免对所有元素进行解析
overflow属性解剖
- scroll：必定出现滚动条
- auto：子元素内容大于父元素时出现滚动条
- visible：溢出的内容出现在父元素之外
- hidden：溢出时隐藏
全屏滚动的原理？需要哪些css属性？
原理 类似于轮播图，整体元素一直排列下去，假设有5个需要展示的全屏页面，那么高度将会是500%，但我们只能展示100%，剩下的内容可以通过transform进行Y轴定位，也可以通过margin-top实现
涉及css属性 overflow:hidden | transition:all 1000ms ease
响应式设计是什么？响应式设计的原理是什么？如何兼容低版本IE？
响应式设计 是指网站能够兼容多个终端，而不是为每一个终端特地去开发新的一个版本
原理 通过媒体查询测试不同的设备屏幕尺寸做处理
兼容低版本IE，页面头部必须有meta声明的viewport

<meta name=“viewport” content=“width=device-width，initial-scale=1.maximum-scale=1，user-scalable=no”>

布局题：自适应填补
有一个高度固定的div，里面有两个div，一个高度100px，另一个填补剩下的高度
方案一 外层div使用position:relative;,要求高度自适用的div使用position:absolute; top:100px; bottom:0; left:0
方案二
使用flex布局方式，高度自适应的div使用flex:1
RGBA() 与 opacity 在透明效果上有什么区别？

opacity 作用于元素，以及元素内的所有内容的透明度
rgba() 只作用于元素的颜色或者背景色（设置rgba透明的元素的子元素不会继承透明效果）

px | em 有什么区别?
px 和 em 都是长度单位
区别在于px的值是固定的，指定多少就是多少，而em的值是不固定的，并且em会继承父级元素的字体大小


▲ 浏览器的默认字体高都是16px。
所以未经调整的浏览器都符合：1em=16px。那么12px = 0.75em  10px = 0.625em
如何实现元素在z轴上移动？

translate3d(x,y,z)
translateZ(z)

Css有哪些引入方式？ 通过link和@import引入有什么区别？
Css引入方式有4种 内联、内嵌、外链、导入
外链link 除了可以加载css之外,还可以定义rss、rel等属性，没有兼容性问题，支持使用javascript改变样式
@import 是css提供的，只能用于加载css，不支持通过javascript修改样式
▲ 页面被加载的时候，link会被同时加载，而@import则需等到页面加载完后再加载，可能出现无样式网页
图形题：纯Css创建一个三角形
原理 创建一个没有高度和宽度的div，设置其中一条边框的作为三角形，其他边框的颜色应为透明
{
    width:0px;
    height:0px;
    border-top:10px solid transparent;
    border-left:10px solid transparent;
    border-right:10px solid transparent;
    border-bottom:10px solid #000;
}
display:none 与 visibility:hidden 的区别是什么？

display:none  隐藏对应的元素，在文档布局中不再分配空间（导致重排）
visibility:hidden  隐藏对应的元素，在文档布局中保留原来的空间（导致重绘）

### 浏览器是如何解析Css选择器？
Css选择的解析是从右向左解析，能够避免对所有元素进行解析
如何水平并垂直居中一张背景图？
设置属性 background-position:center;
style 标签写在 body 后和 body 前有什么区别？
页面加载自上而下，当然是需要先加载样式
写在body标签后，由于浏览器以逐行方式对HTML文档进行解析，当解析写在尾部的样式表会导致浏览器停止之前的渲染，等待加载且解析样式表后才重新进行渲染，这样可能导致留白现象（所以最好将style标签写在body前）
常见的Css兼容性问题有哪些？
- 不同浏览器的标签默认的padding/margin不同，通过初始化css样式可以解决
    *{
        margin:0;
        padding:0px;
    }
- IE6双边距BUG
- 设置较小高度标签（一般小于10px），在IE6,IE7中高度超出自己设置的高度
    通过设置overflow:hidden;或者设置行高line-height小于你设置的高度
- IE下，可以使用获取常规属性的方法来获取自定义属性，也可以使用getAttribute()获取自定义属性
- Chrome中文界面下默认会将小于12px的文本强制为12px
    通过加入css属性 -webkit-text-size-adjust：none;可以解决，或者使用transform中的缩放属性
- 超链接访问过后hover样式就不出现，因为被点击访问过的超链接样式不再具有hover和active了
    解决方法是改变css属性的排列属性：L-V-H-A
    a:link{} → a:visited{} → a:hover{} → a:active{}
- IE下，event对象有x,y属性，但是没有pageX，pageY属性，但没有x，y属性
    解决方式：通过条件
- png24位的图片在IE6浏览器上出现背景，解决方案是做出PNG8
Css优化，如何提高性能

避免过渡约束
避免后代选择符
避免链式选择符
使用紧凑的语法
避免不必要的命名空间
避免不必要的重复样式
使用具有语义的名字
避免使用 !important
尽可能地精简规则
修复解析错误
避免使用多种类型选择符
移除空的css规则
正确使用display属性

inline后不应该使用width、height、margin、padding以及float；
inline-block后不应该使用float；
block后不应该使用vertical-align

不滥用浮动
不滥用web字体
不声明过多font-size
少使用id选择器
不给h1-h6定义过多样式
不重复定义h1-h6
值为0时不需要任何单位
标准化各种浏览器前缀
遵守盒模型规则
