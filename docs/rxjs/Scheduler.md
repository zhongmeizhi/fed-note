# RXJS学习 之 Scheduler

> Scheduler允许定义Observable将哪些执行上下文传递给其Observer的通知

### 调度器：Scheduler

官网翻译：

什么是调度程序？调度程序控制订阅何时开始以及何时传递通知。它由三个部分组成。
* 调度程序是一种数据结构。它知道如何根据优先级或其他标准存储和排队任务。
* 调度程序是执行上下文。它表示执行任务的位置和时间（例如，立即执行，或者在另一个回调机制中，例如setTimeout或process.nextTick，或动画帧）。
* 调度程序具有（虚拟）时钟。它通过now()调度程序上的getter方法提供了“时间”的概念。在特定调度程序上调度的任务将仅遵循该时钟表示的时间。


### 使用 Scheduler

Scheduler一般在Operators中通过`observeOn(xxx)`使用，或者能接收`Scheduler`参数的方法（例如：of、from、interval、timer、concat、merge 等）中使用。

使用方法：
```
    of(1, 2, 3, 4).pipe(
        observeOn(asyncScheduler), // 异步
    ).subscribe(console.log)
```

* asapScheduler  // 同步
* asyncScheduler // 异步
* animationFrameScheduler // requestAnimationFrame