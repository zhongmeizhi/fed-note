# JS-数据类型篇

### 基础类型有哪些？

基本类型有七种
1. `null`
2. `undefined`
3. `boolean`
4. `number`
5. `string`
6. `symbol`（较新标准）
7. `BigInt`（新标准）

`NaN` 也属于 `number` 类型，并且 `NaN` 不等于自身


### 基础类型的特性是什么？

1. 基本类型的值是保存在`栈内存`中的简单数据段
2. 基础类型是`不可变的`
    * 即不能强行修改：`Array.prototype.sort.call('abc');`(会报错)
3. 基础类型上没有`__proto__`没有`属性`
4. 基础类型可以通过 `基本包装类型` 访问的属性/方法
    ```js
        // 通过包装类型访问基础类型特性
        let str = 'abc';
        console.log(str.length)

        // 当你调用 `str.length` 时，实际过程是这样的：
        // -> 创建String类型的一个实例
        // -> 在实例上调用指定的方法
        // -> 销毁这个实例

        let _str = new String(str);
        let len = _str.length;
        _str = null;
    ```
5. 基础类型默认先访问 `Symbol.toPrimitive`（在ES6中有），否则调用 `valueOf` 和 `toString`（如果是 String(val) 先调用 toString），当隐式转换出错会提示`Cannot convert object to primitive value`
    ```js
        var o = {
            valueOf : () => {console.log("valueOf"); return {}},
            toString : () => {console.log("toString"); return {}}
        }

        o[Symbol.toPrimitive] = () => {console.log("toPrimitive"); return "hello"}

        console.log(o + "")
        // toPrimitive
        // hello
    ```

### 怎么检测基础类型？

1. 检测基础类型可以用 `typeof`，但是 `typeof null === 'object'`
    * `null` 是基础类型，不是 Object
    * 由于null的历史遗留问题(前三位为000)，所以使用`typeof`检测null会产生BUG
    ```
        // 借鉴 Vue 源码的 object 检测方法
        function isObject (obj: any): Boolean {
            return obj !== null && typeof obj === 'object'
        }
    ```
2. 通过 `Object.prototype.toString.call` （万能方法）
    * 检测 `[[class]]`
    * 在不覆盖 toString 方法前提下，任何一个对象调用 Object 原生的 toString 方法都会返回 `[object type]`
    ```
        // 借鉴 Vue 源码的检测方法

        let _toString = Object.prototype.toString;

        function toRawType (value: any): String {
            // 获取 从第九个到倒数第二个 字符
            // 比如 [object String]  获取 String
            return _toString.call(value).slice(8, -1)
        }
    ```


### 基础类型是如何转换的？

1. 基本类型转换时，首先会调用 `valueOf`，然后调用 `toString`。(这两个方法可以被重写)
2. 在四则运算中，除了 `+` 其他操作都会以数字进行计算，如果是 `+` 运算，如果不是所有字面量**都是**`number`（都是number就是数字的加法咯），那么会转换为字符串(`toString`)进行拼接

ps：类型转换要注意`undefined`、 `null`，具体需要遵循 ES3 的转换规律，比如 `null` 和 `0` 的关系

### 为什么 0.1 + 0.2 为什么不等于 0.3 ？

遵循`IEEE 754  双精度版本（64位）`标准的语言都有的问题。计算机无法识别十进制，JS会将十进制转换为对应的二进制（二进制即：`0` 和 `1`）。

那么 怎么用 `0` 和 `1` 来表示 `0.1` 和 `0.2` 呢？
```
    console.log(0.1.toString(2));
    // -> 0.0001100110011001100110011001100110011001100110011001101

    console.log(0.2.toString(2));
    // -> 0.001100110011001100110011001100110011001100110011001101
```

这样看似没问题啊。为什么会有BUG呢？

别忘了：JS的精确度区间 约为正负 `2^53`，超出限制会截断。所以你看到的 0.1 不是真的 0.1。


### 那么怎么解决 JS 的精确度问题？

1. 目前主流的解决方案是 `先乘再除`
   * 比如精确到小数点后2位
   * 先把需要计算的数字都 乘1000
   * 计算完成后再把结果  除1000
2. 使用新基础类型 `BigInt` (兼容性很差)


### JS的"真"值有哪些？

JS中除了 "假" 值以外就是 "真" 值。

"假"值包括 7 个
1. `undefined`
2. `null`
3. `false`
4. `NaN`
5. `''`
6. `0`
7. `-0`

在条件判断的隐式转换中："假" 值会转换为 `false`，"真" 值会转换为 `true`;


### 那说一下引用类型吧？

1. 除了基础类型，都是引用类型。
2. 引用类型正在创建时会分配`两个空间`
    * 一块在`堆`上，储存引用类型本身的数据（当然数据量会比较大）
    * 一块在`栈`上，储存对`堆`上数据的引用（存储堆上的内存地址，也就是指针）
3. 引用类型是可变的：即`let a={}; a.x=1;`
4. function参数是值传递，要注意不能修改引用


### 怎么检测引用类型？

1. 通过 `Object.prototype.toString.call` 检测 `[[class]]`
2. 通过 `instanceof` 判断引用类型
3. 通过 `constructor` 判断引用类型（`constructor`是可写的，慎用）


### instanceof 的原理是什么？

`instanceof` 内部机制是通过**判断对象的原型链中是不是能找到对应的的`prototype`**

所以在验证iframe时会有BUG，因为 `window.Array.prototype !== window.frames[0].Array.prototype`，所以不存在继承关系
  
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


### 如果用 instanceof 判断基础类型会怎么样？

会返回 `false` 因为基础类型没有 `__proto__`

```
    let str = '123';

    console.log(str instanceof String) // -> false
```

但是如果更改了 静态方法`Symbol.hasInstance`就可以判断了

```
    class StringType {
        static [Symbol.hasInstance](val) {
            return typeof val === 'string'
        }
    }
    console.log(str instanceof StringType) // -> true
```


### 说一下数组吧？

数组是一种类列表对象，其数据在内存中也可以不连续

数组应该是一段线性分配的内存，但是JS的Array的检索和更新方式和对象一模一样
* Array它把下标变成**数字**，用其作属性。**它比真正的数组慢**，但用起来更方便。
* Array本质还是对象，其原型继承自`Array.prototype`，向上再继承自`Object.prototype`
* Array的方法是设计为对象通用的，对象也能调用数组的方法
    ```
        let obj = {
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
* 使用`delete arr[2]`，并不能减少length，而只是删除了对应的属性（变成empty）


### 什么是类数组？

1. 类数组不是数组，通过 `Array.isArray()` 会返回 `false`
2. 类数组通过 `Array.from` 可以转换为数组
3. 属性要为索引（数字）属性
4. 必须有length属性

经常遇见的类数组
* 字符串 
    - 唯一的原生类数组
* `arguments`
    - arguments完全可以使用`...args`代替，这样不定参数就是真数组
    - arguments在箭头函数中被移除
* DOM 


### [] == ![] 结果是什么？

类型转换都是先 `valueOf` 再 `toString`;

右边
1. 由于 `!` 优先级比 `==` 高，先执行 `!` 
2. `![]` 得到 false
3. 进行 [相等性判断](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)
4. `false` 转化为数字 `0`

左边
1. 执行 `[].valueOf()` 原始值 还是 []
2. 执行 [].toString() 得到 ''
3. `''` 转化为数字 `0`

所以：`0 == 0` ，答案是 `true`


验证：

```
    let arr1 = [];
    let arr2 = [];

    console.log(arr1 == !arr2) // -> true

    arr1.toString = () => {
        console.log(111)
        return 1
    }

    console.log(arr1 == !arr2) 
    // -> 111
    // -> false
```

### == 和 === 的区别 ？

1. `===` 不进行隐式转换
2. `==` 会进行隐式转换
    * `{a: 1} == "[object Object]"` 左边会执行 `.toString()`


### 如何让 (a == 1 && a == 2)条件成立？

依然是类型转换逻辑：基础类型通过 `valueOf` 进行隐式转换

更改 `valueOf` 方法就可以实现
```
    let a = {
        value: 0,
        valueOf: function() {
            this.value++;
            return this.value;
        }
    };
    console.log(a == 1 && a == 2);
```

### `Object.is` 和 === 的区别 ？

`Object.is(v1, v2)` 修复了 `===` 的一些BUG `(-0和+0, NaN和NaN)`：

```
    // === 案例
    -0 === +0       // -> true
    NaN !== NaN     // -> false

    Object.is(-0, +0)       // -> false
    Object.is(NaN, NaN)     // -> true
```
