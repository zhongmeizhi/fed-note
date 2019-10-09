# css小技巧

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


## 迪卡侬官网学习


### 商品分类
使用 float: left; 布局，且第一个设置 `clear: left;`

在子元素中设置2个div，后一个div 300%宽度


###  float产生乱序问题

<div class="box">
    <div class="item">
    </div>
</div>

// 偶数会乱序

.box {
  float: left;
  width: 33%;
}

.box:nth-child(3n+1){
  clear: left;
}

