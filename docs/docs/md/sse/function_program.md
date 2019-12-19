# 轻量级函数式编程

会讲述以下内容
* 什么是函数式编程
* 纯函数
* 高阶函数
* 柯里化
* 可缓存的纯函数
* 函数式编程的缺点

### 什么是函数式编程

我们在维护代码过程中大部分时间其实都是在维护别人的代码。当我们在设计应用程序的时候，我们应该考虑是否遵守了以下的设计原则。
* 可扩展性--我是否需要不断地重构代码来支持额外的功能？
* 易模块化--如果我更改了一个文件，另一个文件是否会受到影响？
* 可重用性--是否有很多重复的代码？
* 可测性--给这些函数添加单元测试是否让我纠结？
* 易推理性--我写的代码是否非结构化严重并难以推理？

函数式编程就像砌砖块，就像这样

```
    // 命令式 变成 声明式

    var compose = function(f,g) {
        return function(x) {
            return f(g(x));
        };
    };

    var initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '));

    initials("hunter stockton thompson");
    // 'H. S. T'
```

### 函数式编程的特性之一：纯函数

纯粹的函数式编程中：只有常量没有变量。因此，任意一个函数**只要输入是确定的，输出就是确定的**，这种纯函数我们称之为没有副作用。而允许使用变量的程序设计语言，由于函数内部的变量状态不确定，同样的输入，可能得到不同的输出，因此，这种函数是有副作用的。

纯函数是完全自给自足的，它需要的所有东西都能轻易获得。

```
    // 纯函数: 只要输入是确定的，输出就是确定的

    // 纯函数
    function add(num1, num2) {
        // 不改变参数内容
        return num1 + num2;
    }

    // 不纯函数
    function pushPropertie(list, val) {
        Array.isArray(list) {
            // 改变了参数的值
            list.push(val);
        }
    }

    // 不纯函数
    let flag = false;
    function changeFlag() {
        flag = true;
    }

    // 纯函数是完全自给自足的，它需要的所有东西都能轻易获得。

    // 不纯的
    var signUp = function(attrs) {
        var user = saveUser(attrs);
        welcomeUser(user);
    };

    var saveUser = function(attrs) {
        var user = Db.save(attrs);
        ...
    };

    var welcomeUser = function(user) {
        Email(user, ...);
        ...
    };

    // 纯的
    var signUp = function(Db, Email, attrs) {
        return function() {
            var user = saveUser(Db, attrs);
            welcomeUser(Email, user);
        };
    };

    var saveUser = function(Db, attrs) {
        ...
    };

    var welcomeUser = function(Email, user) {
        ...
    };
```


### 函数式编程的特性之二：高阶函数

函数式编程的一个特点就是，允许把函数本身作为参数传入另一个函数，还允许返回一个函数。

JavaScript的函数其实都指向某个变量。

高阶函数就是以函数为参数或者返回函数,那么就是高阶函数.

```
    // 高阶函数

    let arr = [2, 3, 4];
    
    // 以函数为参数
    arr.sort(function(a, b) {
        return b - a;
    })
```

### 高阶函数之：柯里化

柯里化就是将接受多个参数的函数转化成接受一个参数的函数。

```
    // 普通的add函数
    function add(x, y) {
        return x + y
    }

    // Currying后
    function curryingAdd(x) {
        return function (y) {
            return x + y
        }
    }

    add(1, 2)           // 3
    curryingAdd(1)(2)   // 3
```

柯里化的好处：延迟参数传递，参数复用，当然`bind`函数就算通过柯里化实现的。

### 可缓存的纯函数

```
    // 不处理异常情况的简洁版本
    var memoize = function(f) {
        var cache = {};

        return function() {
            var arg_str = JSON.stringify(arguments);
            cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
            return cache[arg_str];
        };
    };

    // 使用
    var squareNumber  = memoize(function(x){ return x*x; });

    squareNumber(4);
    //=> 16

    squareNumber(4); // 从缓存中读取输入值为 4 的结果
```


### 函数式编程的缺点

就是越低级的语言，越贴近计算机，抽象程度低，执行效率高，比如C语言；越高级的语言，越贴近计算，抽象程度高，执行效率低，比如Lisp语言。而函数式编程是一种抽象程度很高的编程范式。



## redux、mobx、rxjs取舍

> 答案来自 https://www.wengbi.com/thread_50430_1.html

这三个其实并不冲突，甚至可以放到一起用。

* redux for global state：作为全局状态管理
* rxjs for redux-middleware：rxjs 管理所有输入的 input -> redux action 的调度过程
* mobx for component-state：作为组件局部状态管理器来用。


1. 当你的项目数据复杂度很低，用 react 自带的 component-state 就可以
2. 当你的项目数据复杂度一般，lift state 到 root component，然后通过 props 传递来管理
3. 当你的项目数据复杂度较高，mobx + react 是好的选择
4. 当你的项目数据复杂度很高，redux + react 可以帮助你维持可预测性和可维护性的下降曲线不那么陡。所有 state 变化都由 action 规范化。
5. 当你的项目数据复杂度很高且数据来源很杂，rxjs 可以帮助你把所有 input 规范化为 observable/stream，可以用统一的方式处理。


思路其实很简单：
1. 当 UI 变化很复杂时，用 component 归一化处理；
2. 当 state 变化很复杂时，用 action/state 归一化处理；
2. 当 data-input 很复杂时，用 rxjs/observable 归一化处理；


任意问题，只要足够普遍和复杂，就值得抽象出专门化的机制。

## RXJS

> RXJS = Reactive Extensions Of Javascript（Javascript的响应式扩展）

会涉及到函数式编程 和 响应式编程。

讲述的是RXJS 6.x版本

### 基本概念

RxJS提供了一个核心类型 Observable，附属类型 (Observer、 Schedulers、 Subjects) 和操作符 (map、filter、take 等等)，这些数组操作符可以把异步事件作为集合来处理。

* Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
  * Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
* Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
* Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
* Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。


在Vue中使用RxJs，推荐使用官方库[vue-rx](https://github.com/vuejs/vue-rx/blob/master/README-CN.md)


在React中，使用起来随意很多，毕竟React容易扩展。

### 解决的问题
* 同步和异步的统一
* 可组合的数据变更过程
* 数据和视图的精确绑定
* 条件变更之后的自动重新计算
