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

### echarts 按需引入

```
    // 新建abc.js文件, 如下配置

    // 加载echarts，注意引入文件的路径
    import echarts from 'echarts/lib/echarts'
    
    // 再引入你需要使用的图表类型，标题，提示信息等
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    
    export default echarts

    // 在需要的地方引入 abc.js 文件
```

### 跨域带token不通过问题

> 帮朋友解决BUG，想想应该比较常见

BUG描述：跨域请求，正常请求通过，在需要token请求的时候返回options请求返回302。没有后续请求

问题解决： （不懂跨域的童鞋可以看，[跨域](browser/cross_origin.md) 章节）
* 可能是后台根据token拦截掉了options的请求，导致预检查没有通过。
* 后台放行就好了。

### [返回主页](/README.md)