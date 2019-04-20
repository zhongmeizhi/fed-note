# flutter

### Flutter 简介
Flutter是Google的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。Flutter既不使用 WebView，也不使用操作系统的原生控件（使用自己的Skia引擎来绘 制 widget）。
* Flutter借鉴的是React思想，页面使用Widget搭建
  * Widget就相当于一个UI库
* 使用的编程语言为 Dart2，一个强类型的语音
* 所以：使用Futter就好像 JS/Dart + React/Fultter + AntD/Widget
 
### 优势：
* 对外提供了完全不依赖系统平台的 Widget 的能力
* 只通过自绘图形的方式工作（Skia），而 Android 自带 Skia
* 因此具有极其优秀的跨平台性（iOS和Android的效果基本完全一致）
* 目前已经支持了 iOS、Android、Fuchsia

### 环境搭建
环境搭建过程请访问flutter官网，附：笔者在安装的时候额外遇到的坑。
* 在android中能使用模拟器，却在flutter中不能使用模拟器
  * 以管理员身份运行 android studio
  * 清除as缓存 File -> Invalidate Caches
  * 安卓版本太高，降级到8.1。（flutter版本 1.2.1）

### Widget介绍
* 基础类型Widget: `Text`、`Button`、`Image`、`Input`等
* 布局类型Widget: `Row`、`Column`、`Flex`、`Stack`、`Warp`、`Expanded`
* 修饰类型Widget: `Padding`、`SizedBox`、`DecoratedBox`
* 容器类型Widget: `Scaffold`、`ConstrainedBox`
* 滚动类型Widget: `ListView`、`GridView`、`CustomScrollView`
* 功能类型Widget: `WillPopScope`、`InheritedWidget`、`ThemeData`
* 事件类型Widget: `Listener`、`GestureDetector`、`NotificationListener`
* 还有：控制器

### 其他
* 动画
  * AnimationController
  * Tween
  * addListener
  * AnimatedWidget
* 路由
  * 自定义路由
    * MaterialPageRoute(builder: )
  * 命名路由：
    1. MaterialApp 处注册 routes 
    2. Navigator.pushNamed(context, "new_page");
* 请求
  * 例如：dio库


### [返回主页](/README.md)