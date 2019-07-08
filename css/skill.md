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

