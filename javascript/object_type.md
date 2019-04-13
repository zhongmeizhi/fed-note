# 引用类型

### 数组 和 对象

* 数组应该是一段线性分配的内存，就算是JS的Array其实也相当于是类数组`array-like`
  * Array的检索和更新方式和对象一模一样
  * Array本质还是对象，不过其原型继承自`Array.prototype`，然后`Array.prototype`继承自`Object.prototype`
    ```
      [].__proto__ === Array.prototype
      Array.prototype.__proto__ === Object.prototype
    ```
  * Array它把下标变成字符串，用其作属性。**它比真正的数组慢**，但用起来更方便。
  * 不过使用`delete arr[2]`，并不能减少length，而只是删除了对应的属性（变成empty）

借用一个面试题（不知出处）
```
  var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
  }
  obj.push(1)
  obj.push(2)

  console.log(obj);
  // Object(4) [empty × 2, 1, 2, splice: ƒ, push: ƒ]
```

考点：
1. push 方法根据 length 属性来决定从哪里开始插入给定的值
2. 数组的方法是设计为对象通用的
3. 对象有`length`和`splice`后就会变成JS的类数组

再举个栗子

```
  var obj = {
    0: 'x',
    1: 'y',
    2: 'z',
  }
  obj.__proto__ = Array.prototype;
  // 注意： obj现在没有length属性

  obj.push('hh');
  console.log(obj); // ["hh", 1: "y", 2: "z"]
  console.log(obj.length);  // 1
```

然后整理了下类数组：（类数组属性名称可转换为数字时，会映射成为索引下标）

1. 字符串 是类数组
  - 唯一的原生类数组
2. arguments 是类数组
  - arguments完全可以使用`...args`代替，这样不定参数就是真数组
  - 在箭头函数中被移除
3. DOM 是类数组
  - DOM 类数组不可写
4. 对象有`splice`和`splice`后就会变成JS的类数组


**function**

同样function继承自`Function.prototype`和`Object.prototype`

### 引用类型的类型验证

### instanceof

`instanceof` 用来检测对象的类型，内部机制是通过判断对象的原型链中是不是能找到对应的的 prototype，在验证iframe时会有问题

因为 Array.prototype !== window.frames[0].Array.prototype，所以不存在继承关系

```
  // 实现 instanceof

  function instanceof(obj, target) {
      // 获得对象的原型
      obj = obj.__proto__
      // 判断对象的类型是否等于类型的原型
      while (true) {
        // 如果__proto__ === null 说明原型链遍历完毕
        if (obj === null) {
          return false
        }
        // 如果存在 obj.__proto__ === target.prototype
        // 说明对象是该类型的实例
        if (obj === target.prototype) {
          return true
        }
        // 原型链上查找
        obj = obj.__proto__
      }
  }
```

### Object.prototype.toString.call()

在不覆盖 toString 方法前提下，任何一个对象调用 Object 原生的 toString 方法都会返回 "[object type]"，其中 type 是对象的类型。每个类的内部都有一个 [\[Class]] 属性，这个属性中就指定了上述字符串中的 type(构造函数名)

```
  Object.prototype.toString.call('x');  // "[object String]"

  Object.prototype.toString.call(1);  // "[object Number]"

  Object.prototype.toString.call(null); //"[object Null]"

  Object.prototype.toString.call(true); // "[object Boolean]"

  Object.prototype.toString.call();   // "[object Undefined]"

  Object.prototype.toString.call(Symbol('x'));  // "[object Symbol]"

  Object.prototype.toString.call([]);   // "[object Array]"

  Object.prototype.toString.call({});   // "[object Object]"

  Object.prototype.toString.call(console.log);  // "[object Function]"

  Object.prototype.toString.call(new Date()); // "[object Date]"

  Object.prototype.toString.call(/x/);  //"[object RegExp]"
```

### 不一定靠谱的 constructor 

说不一定靠谱是因为 constructor是可写的，而且验证iframe时会有问题（原理同 instanceof）

当然基础类型的构造器也是通过基本包装类型获取的，没有包装类型的基础类型是没有构造器的

```
  'x'.constructor === String

  (1).constructor === Number

  (true).constructor === Boolean

  ([]).constructor === Array

  ({}).constructor === Object

  (console.log).constructor === Function

  (new Date()).constructor === Date

  /s/.constructor === RegExp
  
```

## My Github

> 持续更新中，Github信息更多哦，你的⭐是我最大的支持。[查看详情](https://github.com/zhongmeizhi/)，

### [返回主页](/README.md)