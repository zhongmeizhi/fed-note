# 迭代器

> JavaScript 到了 ES6 才有原生的 Iterator

讲述以下内容
* 什么是迭代器
* 哪些对象有迭代器
* 使用迭代器
* 实现迭代器
* 迭代器的使用场景

### 显式使用迭代器

```
  var arr = [1, 2, 3];

  var iterator = arr[Symbol.iterator]();

  iterator.next();
  // { value: 1, done: false }

  iterator.next();
  // { value: 2, done: false }

  iterator.next();
  // { value: 3, done: false }

  iterator.next();
  // { value: undefined, done: true }
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

### 迭代器的使用场景

例如：

要实现一个支付场景：有多种支付方式，支付方式的流程有很多种，而且以后会接入新的支付方式。

分析：每种支付方式是一个Class，每个Class各自的属性和方法，也有各自的流程。

流程可能有或者没有：绑卡/不绑卡，短信支付/密码支付，查询结果/轮询结果，线下支付/非线下支付，资产支付/银联支付。。。等等

下面使用迭代器来实现一个支付流程：

实现：
```
  // 比如 Class = Unionpay

  // promise1 = 绑卡；promise2 = 密码支付；promise3 = 轮询结果；

  var arr = [ promise1, promise2, promise3];
  var iterator = arr[Symbol.iterator]();

  // 如果 done 为 false
  iterator.next();
```

当然也可以直接指针标记来控制流程。上面的实现迭代器就是用_cursor的哇。

比如
```
  var arr = [ promise1, promise2, promise3];
  var cursor = 0;

  // 如果有 nextProcess
  var nextProcess = arr[cursor];
  nextProcess().then(val => {
    nextProcess = arr[cursor++];
  })

```