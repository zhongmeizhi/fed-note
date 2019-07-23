# Flutter状态管理


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

Observable：Stream 的加强版
Subjects： 类似StreamController
