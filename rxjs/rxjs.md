# RXJS 简介

> RXJS = Reactive Extensions Of Javascript（Javascript的响应式扩展）

会涉及到函数式编程 和 响应式编程。

讲述的是RXJS 6.x版本

### 基本概念

RxJS提供了一个核心类型 Observable，附属类型 (Observer、 Schedulers、 Subjects) 和操作符 (map、filter、take 等等)，这些数组操作符可以把异步事件作为集合来处理。

* Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
  * Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
* Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
* Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
* Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。


在Vue中使用RxJs，推荐使用官方库[vue-rx](https://github.com/vuejs/vue-rx/blob/master/README-CN.md)


在React中，使用起来随意很多，毕竟React容易扩展。

### 解决的问题
* 同步和异步的统一
* 可组合的数据变更过程
* 数据和视图的精确绑定
* 条件变更之后的自动重新计算
