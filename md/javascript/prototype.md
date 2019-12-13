# 原型

### prototype 和 __proto__

对象都有 `__proto__` 函数都有 `prototype`,

每个实例对象的 `__proto__` 指向它的构造函数的 **原型对象(prototype)**。该原型对象也有一个自己的原型对象(`__proto__`) ，层层向上直到一个对象的原型对象为 `null`。`null` 没有原型，并作为这个原型链中的最后一个环节。


PS：`__proto__`不是真正的规范属性，他指向了 `[[prototype]]`，但是 `[[prototype]]` 是内部属性，我们并不能访问到，所以使用 `__proto__` 来访问。


### 属性的查找过程


`Object.prototype`和`Function.prototype`是两个特殊的对象，他们由引擎来创建，所有函数都继承自 `Function.__prototype`，所有的对象都继承自 `Object.prototype`

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

![prototype](/md/img/prototype.png)

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

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

