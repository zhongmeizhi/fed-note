# dart2 入门

### 简介
* 由Google开发
* 可运行在移动端、浏览器、服务端
* fuchsia && flutter 的亲儿子
* 单进程（isolate隔离区多线程）
* 可以在没有锁的情况下进行对象分配和垃圾回收（像JavaScript一样）
* 拥有虚拟机 DartVM
* 开发时使用：JIT（Just In Time）编译
* 运行时使用：AOT（Ahead Of Time）编译

### 特点
* 强类型语言，支持类型推断
* 所有对象都继承自`Object`类
* 程序有统一的程序入口：`main()`
* 类TypeScript函数
* mixins的实现`with`
* `future`和`async await`
* 在Dart 2中，`new`可选的（类不需要new了）

### 语法

**变量**
  
可以⽤ var 来声明变量， Dart 会⾃推导出数据类型， var实际上是`编译期`的“语法糖”。

Dart 中所有的基础类型、类 等都继承 Object ，默认值是`null`， ⾃带 getter 和 setter，⽽如果是 final 或者 const 的话，那么它只有⼀个 getter ⽅法。其中 const 的值在编译期确定，final 的值要到运⾏时才确定。

Dart是强bool 类型检查，`if(0){code}`内部code会执行

字符串：使用'''或"""包裹定义多行字符串，字符串可以用`'${x}'`来使用变量x

`var x = {};`此时x变量有`length`属性，且x是Map类型

**操作符**

Dart 下 ?? 、 ??= 属于操作符。

如: AA ?? "999" 表示如果 AA 为空，返回999（相当于JS的 AA || "999"）

AA ??= "999" 表示如果 AA 为空，给 AA 设置成 999。

没有 === 操作符号,多了`is`、`as`

**函数**

函数的参数
  * 参数为{}表示名称参数
  * [] 为可选参数
  * 参数采用`:`赋值
  * 可选参数使用`=`赋值

异步函数
```
  ///模拟等待两秒，返回OK
  request() async {
    await Future.delayed(Duration(seconds: 1));
    return "ok!";
  }

  ///得到"ok!"后，将"ok!"修改为"ok from request"
  doSomeThing() async {
    String data = await request();
    data = "ok from request";
    return data;
  }

  ///打印结果
  renderSome() {
    doSomeThing().then((value) {
      print(value);
      ///输出ok from request
    });
  }
```
**多继承**

with 后⾯的会覆盖前⾯的。

```
  class C extends B with A, A2 {
  }
```


* 级联操作符（牛逼的不行）
  ```
  querySelector('#button') // 获取一个对象
    ..text = 'Confirm'   // 使用
    ..classes.add('important')
    ..onClick.listen((e) => window.alert('Confirmed!'));
  ```
  等同于
  ```
  var button = querySelector('#button');
    button.text = 'Confirm';
    button.classes.add('important');
    button.onClick.listen((e) => window.alert('Confirmed!'));
  ```
* 对象操作多了`?. `操作。来确认对象不为空（同样牛逼到不行）
  ```
  obj?.yy = 4;
  ```
* 使用`obj.runtimeType`获取对象类型
  * 如：`obj.runtimeType == List`
* 构造函数
  * 声明一个和类名相同的函数，来作为类的构造器。
  * 构造器不能被子类继承（JS可以 -super）

### [返回主页](/README.md)