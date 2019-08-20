# IphoneX适配

IphoneX底部有小黑条，导致网页出现了比较尴尬的屏幕适配问题。

在IOS11中，苹果公司为了适配IphoneX对meta标签加了扩展属性`viewport-fit`，用来设置窗口布局。

viewport-fit 设置为cover可以网页内容完全覆盖可视窗口

### 适配 H5

### 一：

`viewport`中新增`viweport-fit`属性，使得页面内容完全覆盖整个窗口：

`<meta name="viewport" content="width=device-width, viewport-fit=cover">`

只有设置了 viewport-fit=cover，才能使用 env()。

###  二：

将页面主体内容限定在安全区域内

```
  body {
    padding-bottom: constant(safe-area-inset-bottom);  /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom);  /* 兼容 iOS >= 11.2 */
  }
```

参考：[凹凸实验室](https://aotu.io/notes/2017/11/27/iphonex/?utm_source=tuicool&utm_medium=referral)


### 小程序

至于小程序，只能通过JS来配置。

```
  wx.getSystemInfo({
    success: function(res) {
      console.log(res.model)
      // 判断 model是否包含 'iPhone X'
      // 然后动态设置 bottom:68rpx
    }
  })
```