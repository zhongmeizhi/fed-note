# Flutter 较折腾的Issue

## ListView与Column的冲突问题

跟列有关的 Colum、Flex、Expanded 扩展Widget都会Error

> `会铺满整屏幕的Widget`与`屏幕能扩展滚动的ListView` 想想都不能兼容

解决方案： 使用`限制高度的Widget`（如ConstrainedBox、SizedBox）来包裹Column

## Class类型转换为Widget时，构造器传参会运行失败的问题

> 报错处在源码内，不知如何调试，先Mark



## End

> 持续更新中 [来Github 点颗⭐吧](https://github.com/zhongmeizhi/Interview-Knowledge-FED)

### [返回主页](/README.md)