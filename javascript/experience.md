# 经验之谈

### 名词解释

* OOP：面向对象编程（Object Oriented Programming
  * Oriented = 导向的
* RP：响应式编程（Reactive Programming）
  * reactive = 反应的
* FP：函数式编程（Functional Programming）
* 
* AOT: 运行前编译（Ahead Of Time）
* JIT：运行时编译（Just-in-time）
* 
* BOM：浏览器对象模型（Browser Object Model）
  * BOM的最核心对象是window对象
* DOM：文档对象模型（Document Object Model）
  * DOM的最根本对象是document（window.document）

### 关于 IOS 键盘弹出问题

> IOS键盘弹出后，是覆盖式的。安卓是上推式的。

```
    const ua = navigator.userAgent;

    const isAndroid = ua.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    const isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 监听键盘收起及弹出状态
    document.body.addEventListener('focusout', () => {
        if (isiOS) {
            setTimeout(() => {
            document.body.scrollTop = document.body.scrollHeight
            }, 100)
        }
    })

    document.body.addEventListener('focusin', () => {
        if (isiOS) {
            setTimeout(() => {
            document.body.scrollTop = document.body.scrollHeight
            }, 100)
        }
    })
```

### JS中 new Date 的兼容性BUG

> 在不同的浏览器上：不支持中横线这种时间，得改为斜杠

```
    new Date('2019-07-26 24:00:00'); // 有兼容性问题

    new Date('2019/07/26 24:00:00'); // 没有兼容性问题

```

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

### 关于POST请求的body体

在使用PostMan时，常用的body体有
* form-data -> FormData类型
  * 算x-www-form-urlencoded的超集，既可以上传键值对，也可以上传文件
* x-www-form-urlencoded -> 就是`application/x-www-from-urlencoded,`
  * 原始的表单类型，需要序列化（name=jack&age=18）（使用FormData也行）
* JSON  -> 对象
* raw   -> （未加工的）可以上传任何格式的文本
* binary    -> 相当于`Content-Type:application/octet-stream`
  * 上传文件（只能上传一个）


### [返回主页](/README.md)