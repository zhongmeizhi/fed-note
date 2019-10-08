# Flutter WebView使用

> 一个完整的WebView要有与JS交互和拦截URL的功能


使用过人气很高的[flutter_webview_plugin](https://github.com/fluttercommunity/flutter_webview_plugin)，但是缺少2个重要的功能。也在打开多个WebView时会出错。
* 不能在JS中调用Flutter方法
* 不能在H5进入某个URL之前拦截

虽然该插件不够完整，但是使用起来很方便，封装了很多功能。如果交互不多可以用该插件。

### 官方的 webview_flutter

之后使用官方的[webview_flutter](https://pub.dev/packages/webview_flutter)插件。

附：

在老版本的 Flutter WebView有在Android中无法调弹出键盘的问题，在`webview_flutter Version 0.3.10+2`中已经修复该BUG，使用最新版的Flutter SDK (`flutter _v1.7.8+hotfix.3-stable`)

见GitHub Issue：[issues/19718](https://github.com/flutter/flutter/issues/19718)

真的很好用。官方的Example也很到位哈。


### JS调用Flutter

使用实例：

```
    // 定义方法
    JavascriptChannel _toasterJavascriptChannel(BuildContext context) {
        return JavascriptChannel(
            name: 'Toaster',
            onMessageReceived: (JavascriptMessage message) {
            Scaffold.of(context).showSnackBar(
                SnackBar(content: Text(message.message)),
            );
            });
    }
    
    // 暴露给WebView
    WebView(
        // ... 略
        javascriptChannels: <JavascriptChannel>[
            _toasterJavascriptChannel(context),
        ].toSet(),
    )

    // JS调用方法
    Toaster.postMessage('弹弹乐');
```

### Flutter调用JS

```
    WebViewController _webViewController;

    WebView(
        // ... 略
        javascriptMode: JavascriptMode.unrestricted, // 使用JS没限制
        onWebViewCreated: (WebViewController webViewController) {
            // 在WebView创建完成后会产生一个 webViewController
            _webViewController = webViewController;
        },
    )

    // 之后可以调用 _webViewController 的 evaluateJavascript 属性来注入JS
    _webViewController.evaluateJavascript("Toaster.postMessage('弹弹乐');");
```

### 拦截URL

```
    WebView(
        navigationDelegate: (NavigationRequest request) {
            // 判断URL
            if (request.url.startsWith('https://www.baidu.com')) {
                // 做一些事情
                // 阻止进入登录页面
                return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
        },
    );
```