# JS 函数

> 整篇文章都与JS的函数相关。

### 从函数的定义开始

1. 每个函数实际上都是一个 `Function` 对象，即： `(function(){}).constructor === Function`
2. 函数是 头等对象/一等公民
    1. 函数可以像任何其他对象一样具有属性和方法
    2. 可以赋值给变量（`函数表达式`）
    3. 可以作为参数传递给函数（`高阶函数`）
    4. 可以作为另一个函数的返回值（`闭包`）

定义函数的方式有 4 种：
1. `new Function(str)`;
2. 函数表达式 `var fn = function() {}`
3. 函数声明 `function fn() {}`
4. 箭头函数 `var fn = () => {}`

PS：`new Function` 声明的对象是在**函数创建时解析**的，故比较低效


### 什么是闭包？

MDN的定义：`函数`与对其状态即`词法环境`的引用共同构成闭包（closure）。也就是说，闭包可以让你**从内部函数访问外部函数作用域**

在JavaScript，函数在每次创建时生成闭包。waht????（[MDN说的...](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)）


小红书上的更好理解一点：`闭包是指有权访问另外一个函数作用域中的变量的函数`

也就是说，这就是闭包：
```
    function saySomething(){
        var name = 'mokou';
        return function () {
            console.log(name);
        }
    }

    var say = saySomething()
    say()
```


### 闭包产生的原因？

根据 JS 的垃圾回收机制（不提新生代和老生代），根据`可达性算法`：不可达就会被回收。

什么是不可达？简单来说：`堆`内存中没有在`栈`内存中存放引用（即：没有指针指向堆）就视为不可达。（不懂堆栈的可以看下上一篇JS基础篇）

上面案例代码中：`saySomething` 方法的返回值的引用存在了 `say` 变量中，所以可达，故：引用不会被销毁，从而产生闭包。


### 说一个闭包的使用场景？

案例一：请求出错的提示框（多个请求同时出错一般都只有一个提示框）

实现思路：使用传说中的设计模式 `单例模式`

以下是单例模式的实现：
```
    const Singleton = (function() {
        var _instance;
        return function(obj) {
            return _instance || (_instance = obj);
        }
    })();

    var a = new Singleton({x: 1});
    var b = new Singleton({y: 2});

    console.log(a === b);
```

PS：上例还有一个优点：`_instance` 是私有的，外部不能更改（保证安全无污染/可信）


案例二：解决 `var` 在 `for` + `setTimeout` 混合场景中的BUG

BUG 展示：
```
    for (var i=1; i<=5; i++) {
        setTimeout(function() {
            console.log(i);
        }, i*300 );
    }
```

上例会打印：`6 6 6 6 6`

因为 `var` 是函数作用域（原因1），而 `setTimeout` 是异步执行（原因2），所以：当 `console.log` 执行的时候 `i` 已经等于 `6` 了（BUG产生）

在没有 `let` 和 `const` 的年代，常用的解决方式就是闭包

```
    for (var i = 1; i <= 5; i++) {
        (function(j) {
            setTimeout(function() {
                console.log(j);
            }, j*300);
        })(i);
    }
```


### 闭包的缺点？

缺点：
1. 性能考量：闭包在处理速度和内存消耗方面对脚本性能具有负面影响（多执行了一个函数，多了一个内存指向）
2. 可能内存溢出。（比如：在闭包中的 `addEventListener` 没有被 `removeEventListener`）


### 函数表达式和函数声明的区别？

主要区别在
1. 函数声明被提升到了`函数定义`（可以在函数声明之前使用）
2. 函数表达式要根据定义的方式进行判断
    * 通过 `var` 定义：有变量声明提升
    * 通过 `let 和 const` 定义：没有变量提升


### 什么是变量提升？

JavaScript 中，函数及变量（通过`var`方式）的`声明`都将被提升到函数的最顶部。

案例：以下会输出什么结果？
```
    var name = 'zmz';

    function say(){
        var name;
        console.log(name);

        var name = 'mokou';
        console.log(name);
    }

    say();
```

答案是：先输出 `undefined` 再输出 `mokou`

因为在函数 `say` 内部也声明了一个 `name`（是通过 `var`）声明的，所以会声明提升，但是未赋值，所以首先输出的是 `undefined`，之后是正常流程，输出 `mokou`

PS：由于 `var` 的变量提升很不友好，所以在 ES6 中添加了 `let` 和 `const` （本章主要讲函数，暂略。）


### 函数定义和变量同名会怎么样？

在生成执行上下文时，会有两个阶段。
1. 创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，**函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined**
2. 代码执行阶段：我们可以直接提前使用。

在提升的过程中：函数定义优先于变量提升，变量在执行阶段才会被真正赋值。

举例
```
    console.log(typeof a === 'function')

    var a = 1;
    function a() {}

    console.log(a == 1);
```

上例会打印 `true true`


### 说一下箭头函数？

箭头函数式 ES6 标准
1. 箭头函数的的this，就是定义时所在的对象
2. **一旦绑定了上下文，就不可改变**（call、apply、bind 都不能改变箭头函数内部 this 的指向）
```
    let obj = {
        x () {
            let y = () => {
                console.log(this === obj);
            }
            y();    // true
            // call、apply、bind 都不能改变箭头函数内部 this 的指向
            y.call(window); // true
            y.apply(window); // true
            y.bind(window)(); // true
            // 同时，被bind绑定过的方法，也是不可变的，（不会再次被 bind、call、apply改变this的指向）
        }
    }
```
3. 由于this指向问题，所以：**箭头函数不能当作构造函数**，不能使用new命令
4. 箭头函数没有 `arguments`，需要手动使用 `...args` 参数代替
5. 箭头函数不能用作 Generator 函数


### 那其他函数的 this 指向问题呢？

1. 以函数的形式调用（this指向 window）
```
    function fn () {
        console.log(this, 'fn');
        function subFn () {
            console.log(this, 'subFn');
        }
        subFn(); // window
    }
    fn(); // window
```
2. 以方法的形式调用 （this指向 调用函数的对象）
```
    var x = 'abc';
    var obj = {
        x: 123,
        fn: function () {
            console.log(this.x);
        }
    }
    obj.fn(); //  123
    var fn = obj.fn;
    fn(); // abc
```
3. 以`call`、`apply`、`bind` 的形式调用（更改指向，箭头函数除外）
4. 以构造函数调用，（指向实例）
  - **new的实例是 构造函数中return的对象 || this**
```
    // 构造函数中有 return对象 的情况
    function A() {
        return {
            a : 1
        }
    }
    A.prototype.say = function () {
        console.log(this, 'xx')
    }
    var a = new A();
    // a = {a: 1}
    // a.say === undefined
    // 构造函数中 没有return对象 的情况
    function A() {
        // 可以手动 return this
    }
    A.prototype.say = function () {
        console.log(this, 'xx')
    }
    var a = new A();
    a.say();
    // A {} "xx"
```

### call 和 apply 的不同？

1. 入参不同
2. 性能差异（call比apply快很多）

性能测试：以下测试环境为 chrome v73

```
    function work(a, b, c) {}

    for (var j = 0; j < 5; j++) {
        console.time('apply');
        for (var i = 0; i < 1000000; i++) {
            work.apply(this, [1, 2, 3]);
        }
        console.timeEnd('apply');

        console.time('call');
        for (var i = 0; i < 1000000; i++) {
            work.call(this, 1, 2, 3);
        }
        console.timeEnd('call');
    }
    
    /*
        // apply: 69.355224609375ms
        // call: 8.7431640625ms

        // apply: 57.72119140625ms
        // call: 4.146728515625ms

        // apply: 50.552001953125ms
        // call: 4.12890625ms

        // apply: 50.242919921875ms
        // call: 4.720947265625ms

        // apply: 49.669921875ms
        // call: 4.054931640625ms
    */
```

测试结果： call 比 apply快 10倍（大约是这样的）

原因：`.apply` 在运行前要对作为参数的数组进行一系列检验和深拷贝，`.call` 则没有这些步骤


### 怎么实现 call ？

实现思路
1. 前置知识点：
   1. 当函数以方法的形式调用时，this指向被调用的对象
   2. 函数的参数是值传递
   3. 引用类型可写
2. 以 `myCall` 的第一个参数(暂命名为`that`)作为 被调用的对象
3. `that`上添加一个方法（方法名随意，暂命名`fn`）
4. 通过 `that[fn](...args)` 调用方法（此时`this`指向为`that`）
5. 删除掉第3步添加的方法

具体代码

```
    Function.prototype.myCall = function(that, ...args) {
        let func = this;
        let fn = Symbol("fn");

        that[fn] = func;
        let res = that[fn](...args);
        delete that[fn];

        return res;
    }
```

测试一下

```
    function say(x,y,z) {
        console.log(this.name, x, y, z)
    }
    
    say.myCall({name: 'mokou'}, 1, 2, 3)

    // 打印 mokou 1 2 3
```

### 怎么实现一个 bind ？

实现思路
1. `bind` 只改变 `this` 指向，不执行函数，那么可以用闭包来实现
2. 具体更改 `this`指向的问题可以借用 `call` 实现

```
    Function.prototype.myBind = function(that) {
        if (typeof this !== 'function') {
            throw new TypeError('Error')
        }
        const _fn = this;
        return function(...args) {
            _fn.call(that, ...args)
        }
    }
```

测试一下：

```
    function say(x,y,z) {
        console.log(this.name, x, y, z)
    }

    const testFn = say.myBind({name: 'mokou'})
    testFn(1, 2, 3);

    // 打印 mokou 1 2 3
```


### 说一下尾递归？

PS: 这个小题是半搬运的 @阮一峰 老师的博客

尾递归就是：函数最后`单纯return函数`，尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。

ES6出现的尾递归，可以将复杂度O(n)的调用记录，换为复杂度O(1)的调用记录

测试：不使用尾递归

```
    function Fibonacci (n) {
        if ( n <= 1 ) {return 1};
        // return 四则运算
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
    Fibonacci(10) // 89
    Fibonacci(100) // 超时
    Fibonacci(100) // 超时
```

测试：使用尾递归

```
    function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
        if( n <= 1 ) {return ac2};
        return Fibonacci2 (n - 1, ac2, ac1 + ac2);
    }
    Fibonacci2(100) // 573147844013817200000
    Fibonacci2(1000) // 7.0330367711422765e+208
    Fibonacci2(10000) // Infinity
```

蹦床函数（协程）：解决递归栈溢出问题，将函数变成循环

```
    function trampoline(f) {
        while (f && f instanceof Function) {
            f = f();
        }
        return f;
    }
```

尾递归的优化：

```
    function tco(f) {
        var value;
        var active = false;
        var accumulated = [];

        return function accumulator() {
            accumulated.push(arguments);
            // 除了第一次执行，其他的执行都是为了传参
            if (!active) { // 很重要，如果不使用 active关闭后续进入， sum函数超过会溢出
                // 在第一次进入进入递归优化时激活，关闭后续进入
                active = true;
                // 有参数就执行
                while (accumulated.length) {
                    // 调用f，顺便清除参数
                    value = f.apply(this, accumulated.shift());
                    // 由于while中又调用 f，f调用sum，然后sum在执行时给accumulated塞了一个参数
                    // 所以 while循环会在sum返回结果前一种执行，直到递归完成
                }
                active = false;
                return value;
            }
        };
    }

    var sum = tco(function(x, y) {
        if (y > 0) {
            // 此时的sum是accumulator
            // 执行sum等于给accumulator传参
            return sum(x + 1, y - 1)
        }
        else {
            return x
        }
    });

    sum(1, 100000)
```


### for in、 for of、forEach 各自的特点是什么？

1. `for in` 遍历的是对象的可枚举属性
2. `for of` 遍历的是对象的迭代器属性
3. `forEach` 只能遍历数组，且不能中断（break等无效）



### 手写一个防抖函数？

防抖函数：

```
    function debounce(fn, wait) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, wait);
        }
    }
```

使用场景：输入框校验


### 手写一个节流函数

节流函数

```
    function throttle(fn, wait = 300) {
        let flag = true;
        return (...args) => {
            if (!flag) return;
            flag = false;
            setTimeout(() => {
                fn.apply(this, args);
                flag = true;
            }, wait);
        }
    }
```

使用场景：
1. 延迟防抖函数：`onscroll` 时触发的事件
2. 立即执行防抖函数：按钮的点击事件（某种情况下 `once`函数 更合适）


### 说一下 Class ？

ES6 的 `class` 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。


### Class 和 function 有什么不同

1. 类没有变量提升，
```
    new B();
    class B {}
    // Uncaught ReferenceError: B is not defined
```
2. 类的所有方法，都不可枚举
```
    class A {
        constructor() {
            this.x = 1;
        }
        static say() {
            return 'zmz';
        }
        print() {
            console.log(this.x);
        }
    }
    Object.keys(A); // []
    Object.keys(A.prototype); // []
```
3. 类的的所有方法，没有原型对象`prototype`
```
    接例2
    console.log(A.say.prototype); // undefined
    console.log(new A().print.prototype); // undefined
```
4. 类不能直接使用，必须使用 new 调用。
```
    接例2
    A();
    // Uncaught TypeError: Class constructor A cannot be invoked without 'new'
```
5. 类内部启用严格模式
```
    class B {
        x = 1
    }
    // Uncaught SyntaxError: Identifier 'B' has already been declared
```


### ES5 怎么实现继承？

需要完成功能
1. 继承 构造属性
2. 继承 原型方法
3. 纠正构造器

主流继承方案

```
    function Parent () {
        this.name = 'mokou';
    }
    
    function Child() {
        Parent5.call(this);
        this.age = '18';
    }

    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
```

继承优化（参考 `Babel` 的降级方案）

```
    function inherits(subClass, superClass) {
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf(subClass, superClass);
    }
```

### 说一下 new 的过程？

1. 创建一个空对象
2. 新对象的`__proto__`指向构造函数的 `prototype`
3. 绑定 `this`，指向构造方法
4. 返回新对象

详细代码
```
    function myNew() {
        var obj = new Object()
        var Con = [].shift.call(arguments)
        obj.__proto__ = Con.prototype
        var result = Con.apply(obj, arguments)
        return typeof result === 'object' ? result : obj
    }
```


### 说一下原型链吧？

1. 对象都有 `__proto__`， 它是一个访问器属性，指向了我们不能直接访问到的内部属性 `[[prototype]]`
2. 函数都有 `prototype`，每个实例对象的 `__proto__` 指向它的构造函数的 `prototype`
    * `son.__proto__ === Son.prototype`
3. 属性查找会在原型链上一层一层的寻找属性
    * `Son.prototype.__proto__ === Parent.prototype`
4. 层层向上直到一个对象的原型对象为 `null`。`null` 没有原型，并作为这个原型链中的最后一个环节。
    * `son.__proto__.__proto__........ === null`



举例：

```
    class Parent {}
    class Son extends Parent{}
    
    const log = console.log;
    
    const son = new Son();
    const parent = new Parent();
    
    log(son.constructor === Son)
    log(son.__proto__ === son.constructor.prototype)
    
    log(son.__proto__ === Son.prototype)
    log(Son.prototype.__proto__ === Parent.prototype)
    log(Parent.prototype.__proto__ === Object.prototype)
    log(Object.prototype.__proto__ === null)
    
    log(son.__proto__.__proto__.__proto__.__proto__ === null)

    log(Son.constructor === Function)
    log(Son.__proto__ === Parent)
    
    log(Parent.constructor === Function)
    log(Parent.__proto__ === Object.__proto__)
```

PS：由于 `__proto__` 的性能问题和兼容性问题，不推荐使用。

推荐
* 使用 `Object.getPrototypeOf` 获取原型属性
* 通过 `Object.setPrototypeOf` 修改原型属性
* 通过 `Object.create()` 继承原型

PS： `for in` 和 `Object.keys` 会调用原型 属性
  - 不调用不可枚举属性
  - isPrototypeOf 和 hasOwnProperty


### 说一下 静态属性/方法 ？

静态属性/方法：就是不需要实例化类，就能直接调用的 属性/方法。

综合上面`Parent`和`Son`的例子

不管是 `son`、`Son`还是`Parent`，它们都是对象，所以都可以直接赋值，也能在`__proto__`上赋值

所以静态属性/方式直接赋值就可以了

```
    Parent.x = 1
    Parent.__proto__.x =2

    console.log(Parent.x)  // 1
    console.log(Parent.__proto__.x) // 2
```

如果使用 ES6的 `Class` 定义一个类

```
    class A {
        constructor() {
            this.x = 1;
        }
        static say() {
            console.log('zmz');
        }
        print() {
            console.log(this.x);
        }
    }

    A.say()
```

