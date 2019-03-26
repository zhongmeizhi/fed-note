# dart2 入门

### 简介
* 由Google开发
* 可运行在移动端、浏览器、服务端
* fuchsia && flutter 的亲儿子
* 单进程（isolate隔离区多线程）
* 拥有DartVM

### 特点
* 强类型语言，支持类型推断
* 所有对象都继承自`Object`类
* 程序有统一的程序入口：`main()`
* 类TypeScript函数
* mixins的实现`with`
* `future`和`async await`
* 在Dart 2中，`new` 关键字变成了可选的

### 语法
##### JS开发者易踩的坑
* 未赋值的变量默认为`null`
* 强bool 类型检查，`if(0){code}`内部code会执行
* 使用'''或"""包裹定义多行字符串
* 字符串内使用`$name`使用变量
* 没有array对象，使用list代替
* `var x = {};`此时x变量有`length`属性，且x是Map类型
* 函数的参数的坑
  * 名字参数
  ```
    fn({int xy, bool bol}) {
      // 名字参数可不是对象格式, 但类似
    }
    // 函数调用
    fn(xy: 123, bol: false); // 采用 : 赋值
  ```
  * 可选参数
  ```
    String say(String name, [int age]) {
      // 使用 [] 定义可选参数，放在最后
    }
  ```
  * 默认参数
  ```
    say(String name: 'jc', [int age = 18]){
      // 同样使用: 赋值，可选参数使用 = 赋值
    }
  ```
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
* 构造函数
  * 声明一个和类名相同的函数，来作为类的构造器。
  * 构造器不能被子类继承（JS可以 -super）

### 变量声明
  * var 在第一次赋值时确认类型
  * dynamic 任意类型 -> 动态组合属性和方法
  * Object 任意类型 -> 只能使用Object的属性和方法
  * final 定义后不可改变
  * const
  
## End
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
### [返回主页](/README.md)