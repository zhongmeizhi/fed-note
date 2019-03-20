# flutter

## Flutter 简介
Flutter是Google的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。Flutter既不使用 WebView，也不使用操作系统的原生控件（使用自己的Skia引擎来绘 制 widget）。
 
## 优势：
* 对外提供了完全不依赖系统平台的 Widget 的能力
* 只通过自绘图形的方式工作（Skia），而 Android 自带 Skia
* 因此具有极其优秀的跨平台性（iOS和Android的效果基本完全一致）
* 目前已经支持了 iOS、Android、Fuchsia

## 环境搭建
环境搭建过程请访问flutter官网，附：笔者在安装的时候额外遇到的坑。
* 在android中能使用模拟器，却在flutter中不能使用模拟器
  * 以管理员身份运行 android studio
  * 清除as缓存 File -> Invalidate Caches
  * 安卓版本太高，降级到8.1。（flutter版本 1.2.1）

## End
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
  ## [返回主页](/README.md)