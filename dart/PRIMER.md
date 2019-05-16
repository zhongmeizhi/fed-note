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
##### JS开发者易踩的坑
* 未赋值的变量默认为`null`
* 强bool 类型检查，`if(0){code}`内部code会执行
* 使用'''或"""包裹定义多行字符串
* 字符串内使用`$name`使用变量
* 没有array对象，使用list代替
* `var x = {};`此时x变量有`length`属性，且x是Map类型
* 函数的参数的坑
  * 参数为{}表示名称参数
  * [] 为可选参数
  * 参数采用`:`赋值
  * 可选参数使用`=`赋值
* 没有 === 操作符号
  * 多了`is`、`as`、`??=`、
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