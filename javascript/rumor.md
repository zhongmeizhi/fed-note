# JS 辟谣

> 许多浏览器/JS的BUG都随着时间修复了

.

> 本文会记录远古时代已修复至今依然在前端圈火热的问题

***

### new 和 字面量

网传定义会有性能差别，下面来做个测试。

new Function() 和 function 字面量的比较
```
  var num = 1000; // 1千次

  console.time('test1');
  for (var i = 0; i< num; i++) {
    var x = function(){};
  }
  console.timeEnd('test1');

  console.time('test2');
  for (var i = 0; i< num; i++) {
    var x = new Function();
  }
  console.timeEnd('test2');
  
  // test1: 0.369140625ms
  // test2: 47.99609375ms
```
new Function的性能消耗的非常大的。
  * 因为new Function会有语法解析的的过程
  
Array和Object的字面量，并没有性能差别（10W次定义时间均在10ms左右）
  * 测试浏览器为Chrome 73
  * 测试原因：过往经典书籍提倡 {}代替new Object

**测试结果：**在Chrome 73 中 new Object和{} 的性能是一样的。

### 1px 问题

网传：在高清屏或视网膜屏中，1px的线会变的很宽。

> 在2017年github上阿里flexible宣布废弃flexible1.0

在那个时候。正常浏览器均以实现理想视口viewport或BUG修复

测试：[我的个人网站](https://zhongmeizhi.github.io/) 看看粗细就知道了

### [返回主页](/README.md)