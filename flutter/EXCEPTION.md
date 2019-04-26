# 异常汇总


### Unhandled Exception: MissingPluginException(No implementation found for method

> 没有插件包

解决方案：
```
    flutter clean
    flutter packages get
```
.

### Unhandled exception: setState() called after dispose()

> 在 Flutter 构件树被销毁后仍然执行了 setState 方法改变页面状态。

解决方案：
```
    // mounted 为 false 时未挂载当前页面
    if (!mounted) {
        return;
    }
    setState(() {
        // 做一些事情
    });
```
.

### Scaffold.of() called with a context that does not contain a Scaffold

开始的时候 onpress写法：`Scaffold.of(context).showSnackBar(SnackBar(content: Text('data'),));`

改成：
```
    final _scaffoldkey = new GlobalKey<ScaffoldState>();

    // 然后设置Scaffold -> key: _scaffoldkey

    _scaffoldkey.currentState.showSnackBar(SnackBar(content: Text('data'),));
```

.

### There are multiple heroes that share the same tag ...

> 一个page 不能有多个 相同tag的Hero

删除掉多余的Hero就OK了

