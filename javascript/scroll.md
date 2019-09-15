
### 屏幕滚动

`window.scrollTo(0, 100)`
`document.body.scrollTop = 100`
`window.scrollBy(0, 100)`:相对滚动

让元素显示在视窗

```
    let offsetTop = document.querySelector('.a').offsetTop;
    window.scrollTo(0, offsetTop);
```

使用锚点：但是在三大框架`HashRouter`中很不方便
```
    <a href="#a">元素出现在顶部</a>
    <div id="a">aaa</div>
```

利用`scrollIntoView`
```
    document.querySelector(".a").scrollIntoView();
    // 或
    document.querySelector(".a").scrollIntoView({block: ["start" | "center" | "end"]});
```

添加平滑效果：
```
    // scrollTo scrollBy scrollIntoView 
    scrollTo({
        behavior: "smooth"
    })
```