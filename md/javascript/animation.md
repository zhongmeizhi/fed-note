# 关于前端动画效果

### 动画注意点

浏览器可以生成多个图层（普通文档流也是一个图层）。不同的图层渲染互不影响，所以对于需要频繁渲染的操作，最好单独生成一个新图层。

生成新图层的方式
* will-change
* 3D 变换：translate3d、translateZ
* 通过动画实现的 opacity 动画转换
* position: fixed
* video、iframe 标签

### requestAnimateFrame

> window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画

回调函数执行次数通常与浏览器屏幕刷新次数相匹配，通常是每秒60次。

和setTimeout的区别
1. 当requestAnimationFrame() 运行在后台标签页或者隐藏的`<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命。(setTimeout不会停止)
2. 跟着浏览器的绘制走，不会掉帧。（而setTimeout貌似是多个独立绘制。时间间隔不对一定会掉帧）
3. requestAnimationFrame有兼容性问题（当然：没办法时会降级成setTimeout）


// 来自作者：FedFun 的兼容方案
```
if (!Date.now)
    Date.now = function() { return new Date().getTime(); };
 
(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }

    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
```

### onTransitionEnd

做动画怎么能没有 `onTransitionEnd` 呢？目前兼容性还可以，vue的动画就是通过这个做的。

监听：css样式 `transition` 结束后触发


### 屏幕滚动

1. `window.scrollTo(0, 100)`
2. `document.body.scrollTop = 100`
3. `window.scrollBy(0, 100)`:相对滚动

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

添加平滑动画效果：
```
    // scrollTo scrollBy scrollIntoView 
    scrollTo({
        behavior: "smooth"
    })
```

### 解决 IOS 自定义滚动条滚动不顺畅情况

```
    .box {
        -webkit-overflow-scrolling: touch;
    }
```