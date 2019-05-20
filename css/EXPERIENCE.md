# 静态页面 细节

### position定位 细节

position: absolute;
* 相对于 非static的先辈元素定位
* 如果先辈元素全是`static`，那么相对于**视口**定位

position：fixed
* 相对于视口定位
* 如果先辈元素有`非none`的`transform`属性，那么相对于该先辈元素定位
  * （不注意容易产生BUG）

### box-shadow细节

/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
* 可以同时定义多个阴影
* 阴影扩散半径可以为负数（向内扩散）
  * （可以弄出很多特效）

```
  box-shadow: 0 13px 0px -6px rebeccapurple, 14px 0px 0px -5px grey;
```

### p标签 细节

p标签是无法包裹块状标签的（不注意如果产生BUG）
```
  <p>
    <p>asaaa</p>
    <span>xxx</span>
    <div>yyy</div>
  </p>
```

### canvas有锯齿

canvas具有外部画布宽高，还有内部画布宽高（canvas基础）。如果内外的宽高不匹配就会产生锯齿。

解决:
···
  let canvas = document.getElementById('canvas'),
  //  获取外部画布的宽高
  width = canvas.offsetWidth,
  height = canvas.offsetHeight,

  context = canvas.getContext('2d')

  //  设置内部宽高
  canvas.width = width;
  canvas.height = height;
···

