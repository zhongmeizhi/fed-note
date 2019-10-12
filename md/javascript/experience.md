# 经验之谈

### 名词解释

* OOP：面向对象编程（Object Oriented Programming）（Oriented = 导向的）
* RP：响应式编程（Reactive Programming）（reactive = 响应的）
* FP：函数式编程（Functional Programming）
* AOT: 运行前编译（Ahead Of Time）
* JIT：运行时编译（Just-in-time）
* BOM：浏览器对象模型（Browser Object Model）（BOM的最核心对象是window对象）
* DOM：文档对象模型（Document Object Model）DOM的最根本对象是 window.document
* 静态作用域 -> 变量的作用域在写代码的时候就确定过了

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

### IOS键盘 在 WebView中BUG 2

在IOS中系统键盘弹出后，webview会弹到上边不回来了。（这个要看Native端，反正我用Flutter没问题，但是在公司某App的Hybrid开发中遇到了）

导致的BUG：webview内部touch等事件的位置不正确

解决方案：
```
    // @ts-ignore 元素blur的时候，回到可视区，使用了事件捕获,
    document.addEventListener(
        'blur', 
        // () => (IS_IOS && document.activeElement.scrollIntoViewIfNeeded(true)),
        () => IS_IOS && window.scrollBy({left: 0,top: 1}),
        true
    );
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

### 处理精确度问题

> JS的精确度。。。

* 0.1 + 0.2 => 0.30000000000000004
* 0.105.toFixed(2) = 0.1 // not 0.11

解决方案：(参考 [number-precision](https://github.com/nefe/number-precision))
```
    // 1. 获得小数点后位数 * 10
    // 2. *对应10 转换成整数 / 对应10

    function add(num1, num2) {
        const num1Digits = (num1.toString().split('.')[1] || '').length;
        const num2Digits = (num2.toString().split('.')[1] || '').length;
        const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    }
```

### input type="file" 相机和相册问题

2个属性的坑：`accept="image/*"` 和 `capture="camera"`

关于`capture="camera"` 一般情况下：
* `Android`系统：input`加上capture="camera"`，可以调用相机+相册
  * android可以同时使用2个属性
* `ios`系统：input`去掉capture属性`，可以调用相机 +相册
  * 如果加上`capture="camera"` 只调相机

关于`accept="image/*"`
* 如果限制图片枚举不够，会出现Android无法调用相册的情况。
* 推荐用`accept="image/*"`


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

    // 如果要利用 webpack的 externals
    // externals要用 import 后面的地址
    // 'echarts/lib/echarts',
    // 'echarts/lib/chart/line',
    // 'echarts/lib/component/tooltip',
```

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



