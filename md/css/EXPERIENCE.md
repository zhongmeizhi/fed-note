# 静态页面 细节

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

canvas具有外部画布宽高，还有内部画布宽高（canvas基础）
1. 如果内外的宽高不匹配就会产生锯齿。
2. 就算宽高等比例，因为不同手机像素问题，还是会产生锯齿。


解决方案：百度echarts框架抗锯齿实现
```
  // 内部画布大小 按像素比扩大
  context.canvas.width = _width * 3;
  context.canvas.height = _height * 3;
  // 外部展示
  $ele.style.width = _width + 'px';
  $ele.style.height = _height + 'px';
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

