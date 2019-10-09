# requestAnimateFrame

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