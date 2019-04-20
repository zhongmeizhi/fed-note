# 基础类型 详解

> 夯实Javascript基础。

会讲述以下内容
1. 基础类型的特点
2. 基础类型的转换

基本类型有六种： null，undefined，boolean，number，string，symbol。

基本类型的值是保存在`栈内存`中的简单数据段

### 基础类型特性

基础类型最重要的特性

- **基础类型是不变的**
  -  因此：基础类型没有splice，sort之类的直接改变变量的方法
  -  尝试更改基础类型是无效的
  ```
    var num = 1;
    function addTwo(num) {
      num += 2;
    }

    addTwo(num);

    // 依旧是 1
    console.log(num); // -> 1
  ```
  -  强行改变基础类型会报错
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
- 基础类型没有`__proto__`没有`属性`
  ```
    str.x = 1;
    console.log(str.x); // undefined
  ```
- 所有对基础类型属性的访问都是访问的`基本包装类型 `(String、Number、Boolean)
  ```
    当你调用 `str.length` 时，实际过程是这样的：
    -> 创建String类型的一个实例
    -> 在实例上调用指定的方法
    -> 销毁这个实例

    var str = 'abc';
    var _str = new String(str);
    var len = _str.length;
    _str = null;
    console.log(len);
  ```


其他特性

*  typeof null === 'object'
   -  (历史遗留问题，因为000开头表示对象，而null全是0)
*  条件判断时 `undefined` `null` `false` `NaN` `''` `0` `-0` 为 false，其他都为 true
   -  条件判断时会隐式转换为Boolean()
*  JS只有浮点类型（double），没有整型
   -  `1 === 1.0`
*  NaN 也属于 number 类型，并且 NaN 不等于自身。
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


### [返回主页](/README.md)