# 移动端布局方案汇总&&原理解析

### 阿里flexible布局 - 版本1.x

> 该布局于 2017年8月9日被2.0版本取代

实现原理 `假设（UI稿750px宽）`
* 设置viewport的 `scale = 1/window.devicePixelRatio`
* 将屏幕分成10份，`font-size = 实际屏幕宽度 / 10;`
* 开发时直接填写`(设计稿DOM宽度)px`
* 利用 `px2rem插件` 转换为 ->  实际rem


### 阿里flexible布局 - 版本2.x

> flexible 2.x： https://github.com/amfe/lib-flexible

实现原理
* 利用viewport的理想视口，删除1.x版本的scale缩放
* 其他依旧和1.x版本一样

### 网易布局

> 个人很喜欢的布局方案

实现原理 `假设（UI稿750px宽）`
* 如低版本浏览器:
  * UI稿以`font-size = 100px;`作为参照，`总宽度 = 7.5rem`
  * `(设计稿DOM对应px / 750px) * 7.5rem = 实际rem`
  * 其他屏幕按`屏幕宽度百分比 缩放 font-size的值`
* 若高版本浏览器:
  * `1px/750px ≈ 0.1333333%`
  * 按照低版本逻辑：`font-size = 0.1333333% * 100 = 13.33333vw`


### webpack插件postcss-px-to-viewport

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

### 最后

当然，如果不要求特别精确

* flex
* px
* vw
* 百分比

### 附：现成方案

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
        // 各种场景初始化字体
        window.addEventListener("load", resetFontSize, false);
        window.addEventListener("orientationchange", resetFontSize, false);
        window.addEventListener("resize", resetFontSize, false);
    };

    initDocumentFontSize();
```

都是可以的啊

### [返回主页](/README.md)