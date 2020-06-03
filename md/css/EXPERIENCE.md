# 静态页面 细节

### box-shadow细节

/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
* 可以同时定义多个阴影
* 阴影扩散半径可以为负数（向内扩散）
  * （可以弄出很多特效）

```
  box-shadow: 0 13px 0px -6px rebeccapurple, 14px 0px 0px -5px grey;
```

### 关于层级

1. `z-index` 支持为负
2. `block` 块状盒子
3. `float` 浮动元素
4. `inline`/`inline-block` 水平盒子
5. `z-index` 支持且为正

ps： 子元素的 `z-index` 只作用于父元素内部。

### flex 

1. 主轴 -> `justify-content`
2. 交叉轴 -> `align-items`(单项) + `align-content`(多项)
3. 顺序 -> `order`
4. flex-grow 放大比例，默认为 0 （不放大）
5. flex-shrink 缩小比例，默认 1 （空间不足自动缩小）
   * 剩余空间按照 空间 * 元素放大值 / 总放大值
6. flex-basis 计算剩余空间时的元素大小，auto 表示原本大小
7. flex [flex-grow、 flex-shrink、 flex-basis]，默认 [0 1 auto]
8. align-self 当前项的 align-items

### 可替换元素（img、input、select 等）伪类细节

以 `img` 标签的 `before`, `after` 为例：
1. 替换元素标准并没有清晰定义，这也导致了浏览器实现的差异性。
2. 在大多数浏览器中替换元素的 `before`, `after` 是无效的
3. 对于 `img` 这种自闭合标签，似乎不存在 `content`


### p标签 细节

p标签是无法包裹块状标签的（不注意如果产生BUG）

```html
  <p>
    <p>asaaa</p>
    <span>xxx</span>
    <div>yyy</div>
  </p>
```

### canvas有锯齿

canvas具有外部画布宽高，还有内部画布宽高（canvas基础）
1. 如果内外的宽高不匹配就会产生锯齿。
2. 就算宽高等比例，因为不同手机像素问题，还是会产生锯齿。


解决方案：百度echarts框架抗锯齿实现
```js
  // 获取像素比
  const ratio = window.devicePixelRatio;

  // 内部画布大小 按像素比扩大
  context.canvas.width = _width * ratio;
  context.canvas.height = _height * ratio;
  // 外部展示
  $ele.width = _width;
  $ele.height = _height;

  // ps 先定内部，再定外部，顺序不能乱
```


### 文本省略...
```
    /*单行*/
    .dot{
        display:block /*这里设置inline-block或者block；根据使用情况来定（行内元素需要加这个，块级元素和行内块级可以不用）*/
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

    /*多行*/
    .dot{
        text-overflow:ellipsis;
        overflow:hidden;
        display:-webkit-box;
        -webkit-line-clamp:2; /*这个数字是设置要显示省略号的行数*/
        -webkit-box-orient:vertical;
    }
```

### 改变图片背景色

```
    background: url('xx');
    background-blend-mode: multiply;
    background-color: #F6F6F6;
```

