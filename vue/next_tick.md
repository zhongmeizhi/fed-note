# 异步更新 和 $nextTick

> Vue的$nextTick的实现主要利用了JS的EventLoop

Vue为什么要由$nextTick?
* Vue的Dom更新操作是**异步更新**，调用`queueWatcher`函数
* queueWatcher中，Watch对象并不是立即更新视图，而是被push进了一个队列queue

$nextTick降级策略（由微任务降级到宏任务）
* Promise
* MutationObserver
* setTimeout

为什么$nextTick要降级 ？

根据HTML标准，在每个`task`运行完以后，`UI`都会重渲染，那么在`microtask`中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。

如果新建一个 task 来做数据更新，那么渲染就会进行两次。


### [返回主页](/README.md)