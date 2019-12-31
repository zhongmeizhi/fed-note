# Hybrid开发

> 所谓的Hybrid开发就是一层原生App（Native）的的壳，WebView 内嵌 H5。

Hybrid从开发层面实现“一次开发，多处运行”的机制（开发效率高、跨平台、低层本）。

Hybrid从业务开发上讲，没有版本问题，有BUG能及时修复

与Native交互：
* URL Schema
  * JSBridge
* Native注入Javascript

### URL Schema

URL Schema交互其实是WebView的URL拦截。拦截某些特定的URL.startWith('xxx')

比如携程H5页面要去到酒店Native某一个页面可以这样：

```
    // schema://forward?t=1446297653344&param=%7B%22topage%22%3A%22hotel%2Fdetail%20%20%22%2C%22type%22%3A%22h2n%22%2C%22id%22%3A20151031%7D
    
    // 其实就是拦截了 schema://forward 开头的URL
```

### JSBridge

JSBridge 其实是是URL Schema的升级版：

H5 通过某种方式触发一个url -> Native捕获到url,进行处理 -> Native调用H5的JSBridge对象传递回调（执行Javascript方法）。

比如调用Native相机+人脸识别，并获取人脸识别结果

```
    fnAbc() {
        return new Promise((resolve, reject) => {

            // 回调完成，返回数据
            window.livenessComplete =  (res) => {
                if (res && res.status === '0') {
                    resolve(res.data)
                } else {
                    reject('fail')
                }
            }

            // 使用JSBridge
            Bridge.liveness(JSON.stringify({ "callBack": "livenessComplete" }))

        })
    }
```

附上JsBridge原理图

![/img/JsBridge.png](/md/img/JsBridge.png)


### 通过UA获取数据

首先，需要APp端自定义 user-agent （navigator.userAgent）

附：UA是无法通过JS直接修改的


### JS 判断访问终端
```
    var browser={
        versions: function(){
            var u = navigator.userAgent, 
            app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    }
```
### 移动端调试

可以使用腾讯开源的`vConsole`进行调试（兼容到安卓 4.4）
* [下载 vConsole](https://github.com/Tencent/vConsole)，实例化就能使用
* 或：使用webpack插件`vconsole-webpack-plugin`（兼容到安卓5）

其他调试方式
* 如果有真机，可以使用 `fiddler` 进行真机调试
* 如果没有真机，可以使用 `xCode` 或 `Android Studio`的虚拟机进行调试
* **无论是虚拟机还是真机，都可以使用Chrome自带的inspect打开调试模式调试。**
* 当然也可以使用[spy-debugger](https://github.com/wuchangming/spy-debugger)

inspect打开方式：Chrome输入链接 [chrome://inspect/#devices](chrome://inspect/#devices)

### 禁用 IOS 长按下载图片

IOS在Hybrid中默认还是用 长按下载图片的，Android正常。

禁止 IOS 长按功能
```
    -webkit-touch-callout:none;
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


### input 问题2， IOS中placeholder在input上部

解决方案：
1. chrome浏览器展示 DOM 的隐藏项
2. 步骤：chrome -> `setting` -> `preferences` -> `Elements` -> 勾选 `Show user agent shadow DOM`
3. 检查 placeholder 的DOM元素和 input的DOM元素高度，
4. 设置 placeholder 的 `line-light` 使用顶部和 input顶部一致


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

### IOS键盘弹出问题 2 （在WebView中BUG）

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

### Hybrid中 new Date 的兼容性BUG （一般在IOS中）

> 在不同的浏览器上：不支持中横线这种时间，得改为斜杠

```
    new Date('2019-07-26 24:00:00'); // 有兼容性问题

    new Date('2019/07/26 24:00:00'); // 没有兼容性问题

```

### 解决IOS中 子元素滚动传播到父元素的情况

> 会出现 dialog滚动到尽头时body滚动的情况 的BUG

解决方案 一：
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

解决方案 二:
```
    .box {
        overscroll-behavior: contain; // 阻止滚动传播
    }
```
ps: overscroll-behavior 的兼容性并没有太好

参考 [can i use](https://www.caniuse.com/#search=overscroll-behavior)


### End

最后。还是学习Fultter吧

本人的Fultter项目
* [fultter-example-app](https://github.com/zhongmeizhi/fultter-example-app)
* [flutter-UI](https://github.com/zhongmeizhi/flutter-UI)
