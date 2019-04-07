# 函数 & 尾递归

以下会讲述
1. 普通函数
2. this的指向问题
3. 箭头函数
4. 尾递归
5. 蹦床函数的实现
6. 尾递归优化
7. 设置必填参数
8. 构造函数和类的区别

### 普通函数

* 函数有变量提升
* 有函数作用域。
* 在运行时指定 this 的指向
* 函数的 this 是可以改变的
* 从ES6开始，函数有尾调用优化

### 函数的调用 与 this指向

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
2. 以方法的形式调用，那么this指向 调用函数的对象
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
3. 以call的形式调用
4. 以构造函数调用
  - 如果在构造函数中 有 return对象，那么new的实例 就是 return 的对象
  - 如果 return 的不是对象。 那么 new的实例 就是 this

### 箭头函数

箭头函数`()=>{}`，关于简洁或省略部分不写。

注意点：
* 箭头函数的的this，就是定义时所在的对象，且不可改变
  ```
    let obj = {
        x () {
            let y = () => {
                console.log(this === obj);
            }

            y();    // true
            y.call(window); // true
        }
    }
  ```
* 由于this指向问题，说以：箭头函数不能当作构造函数，不能使用new命令
* 箭头函数没有arguments，需要手动使用 rest参数代替 (`...args`)
* 箭头函数不能用作 Generator 函数

### 尾递归

// 该段大部分剪辑自阮一峰老师的博客

尾递归就是：函数最后`单纯return函数`

ES6出现的尾递归，可以将复杂度O(n)的调用记录，换为复杂度O(1)的调用记录

**尾递归的重要性**
```
    // 不使用尾递归
    // 斐波拉契数列
    function Fibonacci (n) {
        if ( n <= 1 ) {return 1};
        // return 四则运算
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
    Fibonacci(10) // 89
    Fibonacci(100) // 超时
    Fibonacci(100) // 超时

    // 使用尾递归
    function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
        if( n <= 1 ) {return ac2};
        // 单纯返回函数
        return Fibonacci2 (n - 1, ac2, ac1 + ac2);
    }
    Fibonacci2(100) // 573147844013817200000
    Fibonacci2(1000) // 7.0330367711422765e+208
    Fibonacci2(10000) // Infinity
```

蹦床函数，解决递归栈溢出问题，将函数变成循环
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
            if (!active) {
            // 在第一次进入进入递归优化时激活，关闭后续进入
                active = true;
                // 有参数就执行
                while (accumulated.length) {
                    // 调用f，顺便清除参数
                    value = f.apply(this, accumulated.shift());
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

### 设置必填参数

利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。
```
    function throwIfMissing() {
        throw new Error('Missing parameter');
    }

    // 参数默认赋值给抛异常函数
    function foo(mustBeProvided = throwIfMissing()) {
        return mustBeProvided;
    }

    foo()
    // Error: Missing parameter
```

### 函数 和 类的区别

1. 类没有变量提升
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

## End

> 持续更新中，Github信息更多哦，你的⭐是我最大的支持。[查看详情](https://github.com/zhongmeizhi/)，

### [返回主页](/README.md)