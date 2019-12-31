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

### End

最后。还是学习Fultter吧

本人的Fultter项目
* [fultter-example-app](https://github.com/zhongmeizhi/fultter-example-app)
* [flutter-UI](https://github.com/zhongmeizhi/flutter-UI)
