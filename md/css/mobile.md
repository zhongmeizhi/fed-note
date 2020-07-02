# 移动端适配

首先是名词介绍：
* 像素：Pixel，就是
* 物理像素：也就是设备像素
* 逻辑像素：（css像素）单位为 `px`
* 设备像素比：`devicePixelRatio`，（在高倍屏会出现1px变大的问题）。
* css单位`em`：相对于当前对象内文本的字体尺寸
* css单位`rem`： 即root em，root指的是根（html标签）

### 1px问题

京东商城解决方案：伪元素 + `scale`
```
  .div::after {
    content: "";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #bfbfbf;
    border-radius: 4px;
    -webkit-transform: scale(.5);
    transform: scale(.5);
    -webkit-transform-origin: top left;
    transform-origin: top left;
  }
```

那么淘宝商城呢？`border-left: 1px solid #dfdfdf;`，因为阿里大大已经表示不支持石器时代的浏览器了。

其他较好解决方案：渐变的还不错。


## 一、像素适配

##### 阿里flexible布局 - 版本1.x

> 该布局于 2017年8月9日被2.0版本取代

实现原理 `假设（UI稿750px宽）`
* 设置viewport的 `scale = 1/window.devicePixelRatio`
* 将屏幕分成10份，`font-size = 实际屏幕宽度 / 10;`
* 开发时直接填写`(设计稿DOM宽度)px`
* 利用 `px2rem插件` 转换为 ->  实际rem


##### 阿里flexible布局 - 版本2.x

> flexible 2.x： https://github.com/amfe/lib-flexible

实现原理
* 利用viewport的理想视口，删除1.x版本的scale缩放
* 其他依旧和1.x版本一样

##### 网易布局

> 个人很喜欢的布局方案

实现原理 `假设（UI稿750px宽）`
* 如低版本浏览器:
  * UI稿以`font-size = 100px;`作为参照，`总宽度 = 7.5rem`
  * `(设计稿DOM对应px / 750px) * 7.5rem = 实际rem`
  * 其他屏幕按`屏幕宽度百分比 缩放 font-size的值`
* 若高版本浏览器:
  * `1px/750px ≈ 0.1333333%`
  * 按照低版本逻辑：`font-size = 0.1333333% * 100 = 13.33333vw`


##### webpack插件postcss-px-to-viewport

> 顾名思义，将px转换为vw、vh、vmin、vmax

```
{
    viewportWidth: 750,
    viewportHeight: 1334,
    unitPrecision: 3,
    viewportUnit: 'vw',
    selectorBlackList: ['.ignore', '.hairlines'],
    minPixelValue： 1,
    mediaQuery: false
}
```

##### 附：自用方案

```
    var initDocumentFontSize = function initDocumentFontSize() {
        var resetFontSize = function resetFontSize() {
            var bodyWidth = document.body.clientWidth;
            // UI 稿宽度 目前是 375px
            var UI_Layout_Width = 375;
            // 以100作为基数，方便计算
            var Base_Font_Size = 100;
            // 设置最宽屏幕宽度
            var Max_Layout_Width = 768;
            // 注意在最上级的section || div标签上要设置maxwidth: 768px; margin: 0 auto;
            // 得到fontSize
            var fontSize =
                bodyWidth <= Max_Layout_Width
                    ? (Base_Font_Size * bodyWidth) / UI_Layout_Width
                    : (Base_Font_Size * Max_Layout_Width) / UI_Layout_Width;
            // 如果要设置最大
            // 设置html字体大小
            document.documentElement.style.fontSize = fontSize + "px";
            // 重写body的font-size，避免未设置字体大小时，字体继承过于夸张
            document.body.style.fontSize = "12px";
        };
        resetFontSize();
        // load 窗口加载完成触发
        window.addEventListener("load", resetFontSize, false);
        // orientationchange 设备的纵横方向改变时触发。
        window.addEventListener("orientationchange", resetFontSize, false);
        // resize 窗口大小改变时触发
        window.addEventListener("resize", resetFontSize, false);
    };

    initDocumentFontSize();
```

## 二、IphoneX适配

IphoneX底部有小黑条，导致网页出现了比较尴尬的屏幕适配问题。

在IOS11中，苹果公司为了适配IphoneX对meta标签加了扩展属性`viewport-fit`，用来设置窗口布局。

viewport-fit 设置为cover可以网页内容完全覆盖可视窗口

### H5 IphoneX适配


`viewport`中新增`viweport-fit`属性，使得页面内容完全覆盖整个窗口：

`<meta name="viewport" content="width=device-width, viewport-fit=cover">`

只有设置了 viewport-fit=cover，才能使用 env()。


将页面主体内容限定在安全区域内

```
  body {
    padding-bottom: constant(safe-area-inset-bottom);  /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom);  /* 兼容 iOS >= 11.2 */
  }
```

参考：[凹凸实验室](https://aotu.io/notes/2017/11/27/iphonex/?utm_source=tuicool&utm_medium=referral)


### 小程序 IphoneX适配

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

### Safari 圆角无效BUG

在 Safari 中当元素有背景时，会出现 `border-radius` 不能清理背景（圆角变直角）

解决方法：

1. `overflow: hidden;`
2. 如果方法1无效，可以再添加 `border: none;`
