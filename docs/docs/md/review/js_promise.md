# Promise

> Promise 是一个对象，它代表了一个异步操作的最终完成或者失败。

### Promise 概念

一个 Promise有以下几种状态:
* `pending`: 初始状态，既不是成功，也不是失败状态。
* `fulfilled`: 意味着操作成功完成。
* `rejected`: 意味着操作失败。


不同于“老式”的传入回调，在使用 Promise 时，会有以下约定：
* 在 本轮 `Javascript event loop`（事件循环）运行完成 之前，回调函数是不会被调用。
* 通过 `then()` 添加的回调函数总会被调用，即便它是在异步操作完成之后才被添加的函数。
* 通过多次调用 `then()`，可以添加多个回调函数，它们会按照插入顺序一个接一个独立执行。

因为 Promise.prototype.then 和  Promise.prototype.catch 方法返回promise 对象， 所以它们可以被链式调用。


Promise的 4 个方法
1. Promise.all(iterable)
2. Promise.race(iterable)
3. Promise.resolve(value)
4. Promise.reject(reason)

Promise的 prototype
1. Promise.prototype.catch(onRejected)
2. Promise.prototype.then(onFulfilled, onRejected)
3. Promise.prototype.finally(onFinally)

