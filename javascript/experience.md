# 经验之谈

\[dialog和body同时有滚动条的情况\]
```
    // 会出现dialog滚动到尽头时body滚动的情况

    var mo = function (e) { e.preventDefault() }

    // 禁止页面滑动
    Vue.prototype.$banScroll = function () {
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', mo, false);
    }

    // 出现滚动条
    Vue.prototype.$canScroll = function () {
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', mo, false);
    }
```