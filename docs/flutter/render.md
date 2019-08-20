# Widget 渲染策略

主要讲述：
* Stateful和Stateless
* Key
* buildContext


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
