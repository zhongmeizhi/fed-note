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
* 静态作用域、
  * 大括号里面定义的变量就 只能在大括号里面访问

### 特点
* 强类型语言，支持类型推断
* 所有对象都继承自`Object`类
* 程序有统一的程序入口：`main()`
* 类TypeScript函数
* mixins的实现`with`
* `future`和`async await`
* 在Dart 2中，`new`可选的（类不需要new了）

### 语法
  
可以⽤ var 来声明变量， Dart 会⾃推导出数据类型， var实际上是`编译期`的“语法糖”。

Dart 中所有的基础类型、类 等都继承 Object ，默认值是`null`， ⾃带 getter 和 setter，⽽如果是 final 或者 const 的话，那么它只有⼀个 getter ⽅法。其中 const 的值在编译期确定，final 的值要到运⾏时才确定。


支持异步
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

### Dart运行机制

> Dart和Javascript的运行机制类似（都是单线程）

见下图：

![Event_Loop](/md/img/dart_loop.png)

其中：`Future`是微任务（当然，Future几乎就是Promise）