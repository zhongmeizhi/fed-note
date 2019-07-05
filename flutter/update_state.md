# Flutter 更新策略

主要讲述：
* Stateful和Stateless
* buildContext
* state
* Diff算法
* StreamBuilder

用过Flutter都应该知道，在构建Flutter UI时都是使用Widget拼接起来的。

### Stateful和Stateless

有状态和无状态


Widget的更新在在canUpdate方法中会比较`runtimeType`和`key`

```
   static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType
        && oldWidget.key == newWidget.key;
  }
```

key的种类
* ValueKey
* ObjectKey
* UniqueKey
* PageStorageKey
* GlobalKey

Key的功能和名字一致。

### state

state和widget是分开的

在使用setState时会调用build方法更新。



### Flutter的Diff算法

类似于Vue/React的Diff算法。

### buildContext

每个widget都有自己的context。这个context是父组件通过build方法给他返回的。

xxx情况下调用`showSnackBar`方法会提示：`Scaffold.of() called with a context that does not contain a Scaffold`。

因为context不对

1. 可以通过 `new Builder(builder: (context) {...})` 获得context。
2. 或者将不能使用获取context的方法使用widget单独build
3. 使用`GlobalKey<ScaffoldState>()`调用


### Bolc模式的更新方式

StreamBuilder，可以实现局部更新


