# Widget 渲染策略

主要讲述：
* Stateful和Stateless
* Key
* buildContext
* setState
* InheritedWidget
* SteamBuilder


### Stateful 和 Stateless

Stateful的Widget可以多次绘制更新。（运行时和setState时都会调用build方法）

每次绘制都会进入更新算法`canUpdate`：会比较`runtimeType (组件的类型和子元素的引用)` 和 `key`

```
   static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType
        && oldWidget.key == newWidget.key;
  }
```

Stateless 重写的 build 方法只能在Widget运行时调用一次。

如果要重绘`Stateless`的Widget，那么必须创建新的实例。当然在`Stateless`中也并不需要使用`key`，


### Key


key的种类
* ValueKey
* ObjectKey
* UniqueKey
* PageStorageKey
* GlobalKey

Key的功能和名字一致。


### buildContext

每个widget都有自己的context。这个context是父组件通过build方法给他返回的。

比如context不匹配时调用`showSnackBar`方法会提示：`Scaffold.of() called with a context that does not contain a Scaffold`。

解决方法：
1. 可以通过 `new Builder(builder: (context) {...})` 获得context。
2. 或者将不能使用获取context的方法使用widget单独build
3. 使用`GlobalKey<ScaffoldState>()`，通过key来调用


因为每个build的context不一样，所以每个不同的页面数据无法共享。（InheritedWidget 等除外）


### setState()

在Stateful的Widget中，能够使用`setState()`方法来**调用build**，从而重新渲染页面。

如果遇到需要跨Widget共享state的时候，你只能放在它们共有的祖先组件上，然后逐层传递，这样有势必会造成多余的组件更新。



### InheritedWidget

然后，官方提出了`InheritedWidget`的类，**共享的State放在一个继承InheritedWidget的类中**，随之社区推出了[scoped_model](https://pub.dartlang.org/packages/scoped_model)的库（比Redux方便）

但是还是会存在整棵树的Widget都会更新，虽然在`ScopedModelDescendant`中有`rebuildOnChange`来阻止重新渲染（类似React的shouldComponentUpdate，当然它有竞态的问题）

不过，Scope model 使用起来很方便，如果不是复杂项目，使用 Scope model 会**容易上手**。



### SteamBuilder()

BloC即（Business Logic Component），是一种利用reactive programming方式构建应用的方法，这是一个由流构成的完全异步的世界。

* 用StreamBuilder包裹有状态的部件，streambuilder将会监听一个流
* 这个流来自于BLoC
* 有状态小部件中的数据来自于监听的流。
* 用户交互手势被检测到，产生了事件。例如按了一下按钮。
* 调用bloc的功能来处理这个事件
* 在bloc中处理完毕后将会吧最新的数据add进流的sink中
* StreamBuilder监听到新的数据，产生一个新的snapshot，并重新调用build方法
* Widget被重新构建

[参考链接](https://juejin.im/post/5bb6f344f265da0aa664d68a)


### RxDart

RxDart： Reactive Extensions for Dart

Observable：扩展 Stream
Subjects： 扩展了StreamController


