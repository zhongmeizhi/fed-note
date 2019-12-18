# 原型/原型链 && 静态属性/方法

###  __proto__ 和 prototype

对象都有 `__proto__`， 它是一个访问器属性，指向了我们不能直接访问到的内部属性 `[[prototype]]`

函数都有 `prototype`，`Object.prototype`和`Function.prototype`是两个特殊的对象，他们由引擎来创建，所有函数都继承自 `Function.prototype`，所有的对象都继承自 `Object.prototype`

每个实例对象的 `__proto__` 指向它的构造函数的 **原型对象(prototype)**（即： `son.__proto__ === Son.prototype`），该原型对象也有一个自己的原型对象(`__proto__`) ，层层向上直到一个对象的原型对象为 `null`。`null` 没有原型，并作为这个原型链中的最后一个环节。

### 访问原型属性

由于 `__proto__` 的性能问题和兼容性问题，不推荐使用。

推荐
* 使用 `Object.getPrototypeOf` 获取原型属性
* 通过 `Object.setPrototypeOf` 修改原型属性
* 通过 `Object.create()` 继承原型

```
    let arr = [1, 2, 3];

    // 获取原型属性
    Object.getPrototypeOf(arr)
    Reflect.getPrototypeOf(arr)

    // 修改原型属性
    Object.setPrototypeOf(arr, {x: 1})
    Reflect.setPrototypeOf(arr, {x: 1})
```

### 属性的查找过程

属性查找会在原型链上一层一层的寻找属性

查找顺序：
1. son
2. `son.__proto__`
3. `son.__proto__.__proto__`
4. 直到`son.__proto__.__proto__........ === null` 为止

如图

![prototype](/md/img/prototype.png)

举例：
```
    class Parent {
    }
    
    class Son extends Parent{
    }
    
    function log(val) {
        console.log(val);
    }
    
    const son = new Son();
    const parent = new Parent();
    
    /*
        每个对象的`constructor` === 创建该对象的构造函数
        （constructor大部分情况是没用的）
    */
    log(son.constructor === Son)
    log(son.__proto__ === son.constructor.prototype)
    
    // 形成原型链
    log(son.__proto__ === Son.prototype)
    log(Son.prototype.__proto__ === Parent.prototype)
    log(Parent.prototype.__proto__ === Object.prototype)
    log(Object.prototype.__proto__ === null)
    
    // 会在原型链上一层一层的寻找属性
    log(son.__proto__.__proto__.__proto__.__proto__ === null)

    /* 
        对于实例对象来说，都是通过 new 产生的
        无论是 function A() 还是 var a = { x : 1 }
        字面量内部也是使用了 new Object()
    */
    log(Son.constructor === Function)
    log(Son.__proto__ === Parent)
    
    log(Parent.constructor === Function)
    log(Parent.__proto__ === Object.__proto__)
```

```
    // 会在原型链上一层一层的寻找属性

    a.__proto__.__proto__.__proto__...
```

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

### 静态属性/方法

> 静态属性/方法：就是不需要实例化类，就能直接调用的 属性/方法。

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

