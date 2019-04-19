# 经验之谈

### dialog和body同时有滚动条的情况

> 会出现 dialog滚动到尽头时body滚动的情况 的BUG

解决方案：
```
    var mo = function (e) { e.preventDefault() }

    // 禁止页面滑动
    Vue.prototype.$banScroll = function () {
        // 禁止body滚动
        document.body.style.overflow = 'hidden';
        // 禁用原生下拉刷新
        document.addEventListener('touchmove', mo, false);
    }

    // 出现滚动条
    Vue.prototype.$canScroll = function () {
        // 恢复body滚动
        document.body.style.overflow = '';
        // 恢复原生下拉刷新
        document.removeEventListener('touchmove', mo, false);
    }
```