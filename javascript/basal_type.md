# 基础数据类型

> 夯实Javascript基础。

基本类型有六种： null，undefined，boolean，number，string，symbol。

### 基础类型特性

*  **基础类型是不变的**
   -  (详情请看Javascript高级程序设计)
*  typeof null === 'object'
   -  (历史遗留问题，因为000开头表示对象，而null全是0)
*  条件判断时 `undefined` `null` `false` `NaN` `''` `0` `-0` 为 false，其他都为 true
   -  (条件判断时会隐式转换为Boolean)
*  JS只有浮点类型，没有整型
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

在四则运算中，除了'+' 其他操作都会以数字进行计算

## End

> 持续更新中 [来Github 点颗⭐吧](https://github.com/zhongmeizhi/Interview-Knowledge-FED)

### [返回主页](/README.md)