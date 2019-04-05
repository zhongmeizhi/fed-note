# 原型

Javascript的继承是原型`prototype`继承，函数都有`prototype`属性
```
    function a () {}
    console.log(typeof a.prototype); // object
```
但是`Function.prototype.bind()`没有`prototype`
```
    var fn = Function.prototype.bind();
    console.log(typeof fn); // function
    console.log(fn.prototype); // undefined
```

为什么`Function.prototype.bind()`没有`prototype`
```
    console.log(Object.prototype);
    // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}

    console.log(Function.prototype);
    // ƒ () { [native code] }
```
所以：`Function.prototype` 和 `Object.prototype` 是两个特殊的对象，他们由引擎来创建

而：所以的函数都继承自 `Function.__prototype`，所以的对象都继承自 `Object.prototype`


每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型`prototype`，通过`_proto_`将对象和原型联系起来组成原型链，得以让对象可以访问到不属于自己的属性。
```
    var obj = {};
    obj.__proto__ === Object.prototype; // true

    function A () {}
    var a = new A();
    a.__proto__ === A.prototype; // true
```
其实这个属性指向了 [[prototype]]，但是 [[prototype]] 是内部属性，我们并不能访问到，所以使用 _proto_ 来访问。



每个对象的`constructor` === 创建该对象的构造函数（constructor大部分情况是没用的）
```
    function A () {}
    a = new A();

    a.constructor === A; // true
    a.constructor === a.__proto__.constructor; // true
```

对于实例对象来说，都是通过 new 产生的，无论是 function A() 还是 var a = { x : 1 } , 字面量内部也是使用了 new Object()

new的过程
1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

```
    function myNew() {
        // 创建一个空的对象
        var obj = new Object()
        // 获得构造函数
        var Con = [].shift.call(arguments)
        // 链接到原型
        obj.__proto__ = Con.prototype
        // 绑定 this，执行构造函数
        var result = Con.apply(obj, arguments)
        // 确保 new 出来的是个对象
        return typeof result === 'object' ? result : obj
    }
```

- delete 不会删除 原型的属性
    - 但是可以删除字面量属性，让原型属性暴露出来

- for in 会调用原型 属性
  - 不调用不可枚举属性

isPrototypeOf 和 hasOwnProperty

函数的调用方法
- 以函数的形式调用，那么this指向 window
- 以方法的形式调用，那么this指向 调用函数的对象
- 以call的形式调用
- 以构造函数调用
  - 如果在构造函数中 有 return对象，那么new的实例 就是 return 的对象
  - 如果 return 的不是对象。 那么 new的实例 就是 this

函数 和 类的区别