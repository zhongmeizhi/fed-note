# 函数 & 类


### 函数的调用 方式
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