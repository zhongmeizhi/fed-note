# Dart-稍微抽象点


### 泛型

泛型：有些情况下你可能想使用类型来表明你的意图，不管是使用泛型还是 具体类型。

在 Dart 中类型是可选的，你可以选择不用泛型。类、函数/方法中都可以使用泛型。

泛型通过 `<类型>`来使用。

```
  // 通过泛型就可以减少包含具体类型定义的重复代码
  abstract class Cache<T> {
    T getByKey(String key);
    setByKey(String key, T value);
  }

  // 泛型还能 限制泛型类型
  class Foo<T extends SomeBaseClass> {...}

  // 可以在函数/方法中使用泛型
  T first<T>(List<T> ts) {
    T tmp ?= ts[0];
    return tmp;
  }
```

这里的 first (<T>) 泛型可以在如下地方使用 参数 T ：
* 函数的返回值类型 (T).
* 参数的类型 (List<T>).
* 局部变量的类型 (T tmp).


### 导入

普通导入
```
  import 'dart:io';
  import 'package:lib1/lib1.dart';
```

指定库前缀 （如果你导入的两个库具有冲突的标识符）
```
  import 'package:lib1/lib1.dart';
  import 'package:lib2/lib2.dart' as lib2;
  
  Element element1 = new Element();           // 使用lib1.
  lib2.Element element2 = new lib2.Element(); // 使用lib2.
```

部分导入
```
  // 只导入 foo
  import 'package:lib1/lib1.dart' show foo;

  // 导入 liab2 但排除 foo
  import 'package:lib2/lib2.dart' hide foo;
```

延迟载入库（）
```
  // 延迟导入库
  import 'package:deferred/hello.dart' deferred as hello;

  // 使用库
  greet() async {

    // 库标识符调用 loadLibrary() 函数来加载库：
    // loadLibrary 返回 Future
    await hello.loadLibrary();

    // 使用
    hello.printGreeting();
  }
```

在一个库上你可以多次调用 loadLibrary() 函数。 但是该库只是载入一次。


### 异步支持

Dart 有一些语言特性来支持 异步编程。 最常见的特性是 `async` 方法和 `await` 表达式。

简单地说，`Future`将返回一个值，而`Stream`将返回多次值。所以`Steam`使用`await for`


Future，基本上等于JS的Promise
```
  checkVersion() async {
    var version = await lookUpVersion();
    if (version == expectedVersion) {
      // ...
    } else {
      // ...
    }
  }
```

当然，Future有类似于 Promise.all([])的方法，
```
  //等待所有 Future 执行完成

  Future.wait([deleteDone, copyDone, checksumDone])
    .then((List values) {
      print('Done with all the long steps');
    });
```

Stream。`await for`会在数据返回完毕后结束，所以别在无尽的数据流（比如DOM事件）中使用`await for`

```
  initData async {
    await for (var request in requestServer) {
      handleRequest(request);
    }
  }
```

使用 `break` 或者 `return` 语句可以 停止接收 `stream` 的数据， 这样就跳出了 `for` 循环并且 从 `stream` 上取消注册了。


### 元数据

元数据，即注解，比如：`@override`

自定义元数据

```
  library todo;

  class todo {
    final String who;
    final String what;

    const todo(this.who, this.what);
  }

  // 使用

  import 'todo.dart';

  @todo('seth', 'make this do something')
  void doSomething() {
    print('do something');
  }
```

不过，Flutter似乎**不支持**`反射`。