# 原型

### prototype
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

    // why ? 看下文
```

`Object.prototype`和`Function.prototype`是两个特殊的对象，他们由引擎来创建
```
    console.log(Object.prototype);
    // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}

    console.log(Function.prototype);
    // ƒ () { [native code] }
    
```

所有函数都继承自 `Function.__prototype`，所有的对象都继承自 `Object.prototype`
```
    var obj = {};
    obj.__proto__ === Object.prototype; // true

    function A () {}
    var a = new A();
    a.__proto__ === A.prototype; // true
    A.__proto__ === Function.prototype; // true
```

每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型`prototype`，通过`_proto_`将对象和原型联系起来组成原型链，得以让对象可以访问到不属于自己的属性。

其实`__proto__`不是真正的规范属性，他指向了 [[prototype]]，但是 [[prototype]] 是内部属性，我们并不能访问到，所以使用 `__proto__` 来访问。

原型链的终点
```
    Function.__proto__ === Function.prototype;
    Object.__proto__ === Function.prototype;

    Function.prototype.__proto__ === Object.prototype;
    Object.prototype.__proto__ === null;
```


每个对象的`constructor` === 创建该对象的构造函数（constructor大部分情况是没用的）
```
    function A () {}
    a = new A();

    a.constructor === A; // true
    a.constructor === a.__proto__.constructor; // true
```

对于实例对象来说，都是通过 new 产生的，无论是 function A() 还是 var a = { x : 1 } , 字面量内部也是使用了 new Object()

### new的过程
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

附：
- delete 不会删除 原型的属性
    - 但是可以删除字面量属性，让原型属性暴露出来

- for in 会调用原型 属性
  - 不调用不可枚举属性
  - isPrototypeOf 和 hasOwnProperty

## End

> 持续更新中，Github信息更多哦，你的⭐是我最大的支持。[查看详情](https://github.com/zhongmeizhi/)，

### [返回主页](/README.md)