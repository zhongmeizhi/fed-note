# JS 数据类型

> 夯实Javascript基础。

## 基础类型

基本类型有六种： `null`、`undefined`、`boolean`、`number`、`string`、`symbol`。

基本类型的值是保存在`栈内存`中的简单数据段


### 最重要的特性：基础类型是不变的

*  尝试更改基础类型是无效的
   ```
     // 例如：
     var num = 1;
     function addTwo(num) {
       num += 2;
     }

     addTwo(num);

     // 依旧是 1
     console.log(num); // -> 1
   ```
*  因为不变：所以没有`splice`，`sort`之类的直接改变变量的方法
   * 而且：强行改变基础类型会报错(`read only`)
     ```
       // str 不能调用 Array的 sort 和 splice

       Array.prototype.sort.call('strxyz');
       // Uncaught TypeError: Cannot assign to read only property '2' of object '[object String]'

       Array.prototype.splice.call('strxyz');
       // Uncaught TypeError: Cannot assign to read only property 'length' of object '[object String]'


       // object 可以使用 Array的sort 和 splice

       Array.prototype.sort.call({x: 1, y: 2});
       // {x: 1, y: 2}

       Array.prototype.splice.call({x: 1, y: 2});
       // []
     ```

### 基础类型是通过 基本包装类型 访问的

* 基础类型没有`__proto__`没有`属性`，所有对基础类型属性的访问都是访问的`基本包装类型 `(String、Number、Boolean)
  ```
    str.x = 1;
    console.log(str.x); // undefined

    // 当你调用 `str.length` 时，实际过程是这样的：
    // -> 创建String类型的一个实例
    // -> 在实例上调用指定的方法
    // -> 销毁这个实例

    var str = 'abc';
    
    var _str = new String(str);
    var len = _str.length;
    _str = null;

    console.log(len);
  ```

### 其他基础类型特性

*  typeof null === 'object'
   -  (历史遗留问题，因为000开头表示对象，而null全是0)
*  条件判断时 `undefined` `null` `false` `NaN` `''` `0` `-0` 为 false，其他都为 true
   -  条件判断时会隐式转换为Boolean()
*  JS只有浮点类型（double），没有整型
   -  `1 === 1.0`
*  NaN 也属于 number 类型，并且 NaN 不等于自身
   *  `var a = NaN; a !== a;`
*  `String` 类型是类数组，具有`iterator`
   *  `typeof String('x')[Symbol.iterator] === 'function'`

### 基础类型检测

检测基础类型用 `typeof`

```
  // typeof 只适合检测 基础类型

  typeof new Date() // 'object'
  typeof [] // 'object'
  typeof {} // 'object'
  typeof console.log // 'function'
```

也可以使用`Object.prototype.toString.call`来检测基础类型的`[[class]]`

### 基础类型转换

基本类型转换时，首先会调用 `valueOf`，然后调用 `toString`。并且这两个方法可以重写。

```
  var a = 1;

  var obj = {x: 1};
  obj.toString === '[object Object]';

  var arr = [2, 3];
  arr.toString() === '2,3';

  a + obj === '1[object Object]';
  a + arr === '12,3';
```

`Symbol.toPrimitive`该方法在转基本类型时调用优先级最高。

```
  let a = {
    valueOf() {
      return 1;
    },
    toString() {
      return '2';
    },
    [Symbol.toPrimitive]() {
      return 3;
    }
  }

  1 + a // => 4
```

### 四则运算
- 在四则运算中，除了'+' 其他操作都会以数字进行计算
- 如果是 + 运算，如果不是所有字面量都是`number`，那么会转换为字符串(`toString`)进行拼接


## 引用类型


### new和字面量

对象使用new和字面量定义在使用时据说有区别，但是在chrome 72版本中体验了下，一点性能影响都没有。


### 数组 和 对象

* 数组应该是一段线性分配的内存，但是JS的Array其实也相当于是类数组`array-like`
  * Array的检索和更新方式和对象一模一样
  * **Array本质还是对象**，其原型继承自`Array.prototype`，向上再继承自`Object.prototype`
    ```
      [].__proto__ === Array.prototype
      Array.prototype.__proto__ === Object.prototype
    ```
  * Array它把下标变成**字符串**，用其作属性。**它比真正的数组慢**，但用起来更方便。
  * 不过使用`delete arr[2]`，并不能减少length，而只是删除了对应的属性（变成empty）

借用网上JS问题
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

因为JS的数组就是对象啊，对象也可以转换成数组
1. push 方法根据 length 属性来决定从哪里开始插入给定的值
2. 数组的方法是设计为对象通用的
3. 对象有`length`和`splice`后就会变成JS的类数组


然后整理了下类数组：（类数组属性名称可转换为数字时，会映射成为索引下标）

* 字符串 是类数组
    - 唯一的原生类数组
* `arguments` 是类数组
    - arguments完全可以使用`...args`代替，这样不定参数就是真数组
    - arguments在箭头函数中被移除
* DOM 是类数组
    - DOM 类数组不可写
* 对象有`splice`和`splice`后就会变成JS的类数组

### 引用类型的验证

### instanceof机制和实现

`instanceof` 用来检测对象的类型，内部机制是通过**判断对象的原型链中是不是能找到对应的的`prototype`**。

`instanceof` 在验证iframe时会有问题，因为 `window.Array.prototype !== window.frames[0].Array.prototype`，所以不存在继承关系

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

### 不一定靠谱的 constructor 

说不一定靠谱是因为 constructor是可写的，而且验证iframe时会有问题（原理同 instanceof）

当然基础类型的构造器也是通过基本包装类型获取的，没有包装类型的基础类型是没有构造器的

```
  // null 没有包赚类，所以没有构造器
  // undefined 同理
  // Symbol 同上

  'x'.constructor === String
  (1).constructor === Number
  (true).constructor === Boolean
  ([]).constructor === Array
  ({}).constructor === Object
  (console.log).constructor === Function
  (new Date()).constructor === Date
  /s/.constructor === RegExp
```

### Object.prototype.toString.call()

在不覆盖 toString 方法前提下，任何一个对象调用 Object 原生的 toString 方法都会返回 "[object type]"，其中 type 是对象的类型。每个类的内部都有一个 [\[Class]] 属性，这个属性中就指定了上述字符串中的 type(构造函数名)

```
  var toString = Object.prototype.toString;

  toString.call('x');  // "[object String]"
  toString.call(1);  // "[object Number]"
  toString.call(null); //"[object Null]"
  toString.call(true); // "[object Boolean]"
  toString.call();   // "[object Undefined]"
  toString.call(Symbol('x'));  // "[object Symbol]"
  toString.call([]);   // "[object Array]"
  toString.call({});   // "[object Object]"
  toString.call(console.log);  // "[object Function]"
  toString.call(new Date()); // "[object Date]"
  toString.call(/x/);  //"[object RegExp]"
```

**function**

同样function继承自`Function.prototype`和`Object.prototype`

具体function内容。见本人github "函数&尾递归"章节