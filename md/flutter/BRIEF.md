# flutter

### Flutter 简介

> Flutter是Google的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。

Flutter使用自绘UI+原生实现（使用自己的Skia引擎来绘 制 widget）。
* Flutter借鉴的是React思想，页面使用Widget搭建
  * Widget就相当于一个UI库

Flutter中有四⼤线程，Platform Task Runner 、UI Task Runner、GPU Task Runner 和 IO Task Runner。运行机制和JS类似。

对于 Flutter ⽽⾔，整个屏幕都是⼀块画布，我们通过各种 Offset 和 Rect 确定了位置，然后通过 PaintingContext 的 Canvas 绘制上去，⽬标是整个屏幕区域，整个屏幕就是⼀帧，每次改变都是重新绘制。
 
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

### Widget

在 Flutter 中，⼀切的显示都是 Widget 。Widget 是通过 state 跨帧实现管理数据状态的，（类似于React）

渲染经历了从 Widget 到 Element 再到 RenderObject 的过程。

Flutter 中的根Widget 是`RenderObjectToWidgetAdapter`,根 Widget 的 child 就是我们在void runApp(Widget app)中传入的自定义 Widget。

<div align=center>

![widget](../img/widget.png)

</div>


Widget 分为 有状态（`StatefulWidget`）和 ⽆状态（`StatelessWidget`）两种，在 Flutter 中每个⻚⾯都是⼀帧，⽆状态就是保持在那⼀帧，⽽有状态的 Widget 当数据更新时，其实是绘制了新的 Widget，只是 State 实现了跨帧的数据同步保存。

State 中主要的生命周期：
* `initState` ：初始化，理论上只有初始化⼀次，第⼆篇中会说特殊情况下。
* `didChangeDependencies`：在 initState 之后调⽤，此时可以获取其他 State 。
* `dispose` ：销毁，只会调⽤⼀次。*

在Flutter中，要主动改变⼦控件的状态，还可以使⽤ `GlobalKey` 。


具体每个Widget的使用方式和展现：[Flutter-UI](https://github.com/zhongmeizhi/flutter-UI)


# Flutter 实现原理

渲染
![渲染](../img/flutter_render.png)

状态
![状态](../img/flutter_state.png)

GPU
![GPU](../img/flutter_GPU.png)

