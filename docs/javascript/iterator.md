# 迭代器

> JavaScript 到了 ES6 才有原生的 Iterator

讲述以下内容
* 什么是迭代器
* 自带迭代器的对象
* 使用迭代器
* 实现迭代器
* 迭代器的使用场景


### 什么是迭代器

迭代器（Iterator）是一种统一的接口。为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）,。`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。

至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，这是一个预定义好的、类型为 Symbol 的特殊值。

Iterator 的作用有三个：
* 一是：为各种数据结构，提供一个统一的、简便的访问接口
* 二是：使得数据结构的成员能够按某种次序排列
  * 对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的
* 三是：ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

为对象实现迭代器
```
  let obj = {
    data: [ 'hello', 'world' ],
    [Symbol.iterator]() {
      const self = this;
      let index = 0;
      return {
        next() {
          if (index < self.data.length) {
            return {
              value: self.data[index++],
              done: false
            };
          } else {
            return { value: undefined, done: true };
          }
        }
      };
    }
  };

  for (let o of obj) {
    console.log(o);
  }
```

### 自带迭代器的对象

* Array()
* Map()
* Set()
* [...document.querySelectorAll('div')] // 类数组
* arguments // 类数组
* String类型 // 类数组

### 使用迭代器

1. 显式使用
  ```
    var arr = [1, 2, 3];
    var iterator = arr[Symbol.iterator]();
    iterator.next(); // { value: 1, done: false }
    iterator.next(); // { value: 2, done: false }
    iterator.next(); // { value: 3, done: false }
    iterator.next(); // { value: undefined, done: true }
  ```
2. 扩展运算符
3. yield*
4. for of 循环
5. Promise.all()
6. Promise.race()
7. Array.from()

生成器（Generator）和迭代器的组合
```
  let myIterable = {
    [Symbol.iterator]: function* () {
      yield {x: 1};
      yield {y: 2};
      yield {z: 3};
    }
  }
  let arr = [...myIterable];
  console.log(arr); 
  // [{…}, {…}, {…}]

  // 或者采用下面的简洁写法

  let obj = {
    * [Symbol.iterator]() {
      yield 'hello';
      yield 'world';
    }
  };

  for (let x of obj) {
    console.log(x);
  }
  // "hello"
  // "world"
```


### 实现数组迭代器

```
  class MyIterator {
    constructor(arr) {
      // protoToString = Object.prototype.toString
      if (protoToString.call(arr) !== "[object Array]") {
        throw new Error("参数不是数组")
      }
      this._array = arr;
      this._cursor = 0;
    }

    next() {
      return this._cursor < this._array.length ?
      { value: this._array[this._cursor++], done: false } :
      { done: true };
    }
  }
```
