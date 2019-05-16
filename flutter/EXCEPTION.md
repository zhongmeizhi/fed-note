# 异常汇总

### Debug

> import 'dart:developer';

首先你得使用调试模式开启Flutter
* 使用`debugger([when: bool])`开启Debug
* 如果你使用的是`VS Code`那么点行数字的左边空隙就可以Debugger了

.

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

> 找不到context（上下文）

将onpress写法：`Scaffold.of(context).showSnackBar(SnackBar(content: Text('data'),));`

改成：
```
    final _scaffoldkey = new GlobalKey<ScaffoldState>();

    // 然后设置Scaffold -> key: _scaffoldkey

    _scaffoldkey.currentState.showSnackBar(SnackBar(content: Text('data'),));
```

.


