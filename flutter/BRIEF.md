# flutter

### Flutter 简介

> Flutter是Google的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。

Flutter使用自绘UI+原生实现（使用自己的Skia引擎来绘 制 widget）。
* Flutter借鉴的是React思想，页面使用Widget搭建
  * Widget就相当于一个UI库
 
### 优势：
* 对外提供了完全不依赖系统平台的 Widget 的能力
* 只通过自绘图形的方式工作（Skia），而 Android 自带 Skia
* 因此具有极其优秀的跨平台性（iOS和Android的效果基本完全一致）
* 目前已经支持了 iOS、Android、Fuchsia
* Dart支持JIT和AOT
* 支持热重载
* 应用程序速度快。

### 环境搭建
[https://flutter.dev/](https://flutter.dev/)

### Widget介绍
* 基础类型Widget: `Text`、`Button`、`Image`、`Input`等
* 布局类型Widget: `Row`、`Column`、`Flex`、`Stack`、`Warp`等
* 修饰类型Widget: `Padding`、`SizedBox`、`DecoratedBox`等
* 容器类型Widget: `Scaffold`、`ConstrainedBox`等
* 滚动类型Widget: `ListView`、`GridView`、`CustomScrollView`等
* 功能类型Widget: `WillPopScope`、`InheritedWidget`、`ThemeData`等
* 事件类型Widget: `Listener`、`GestureDetector`、`NotificationListener`等
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
  * 动画路由
    ```
      Navigator.push(context, PageRouteBuilder(
        pageBuilder: (BuildContext context, Animation animation, Animation secondaryAnimation) {
          return FadeTransition(
            opacity: animation,
            child: HeroAnimationRouteB(imageName: "images/IMG_0696.jpg"),
          );
        })
      )
    ```
   
* 请求
  ```
    import 'dart:convert';
    import 'dart:io';
  ```


### [返回主页](/README.md)