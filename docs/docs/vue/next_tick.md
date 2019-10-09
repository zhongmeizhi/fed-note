# 异步更新 和 $nextTick

> Vue的$nextTick的实现主要利用了JS的EventLoop

### Vue为什么要由$nextTick ？
* Vue的Dom更新操作是**异步更新**，调用`queueWatcher`函数
* queueWatcher中，Watch对象并不是立即更新视图，而是`queue.push(watcher)`(被push进了一个队列queue)

### $nextTick降级策略（由微任务降级到宏任务）

$nextTick方法内部有timerFunc函数
```
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      //在有问题的UIWebViews中，Promise.then并没有完全破坏，但是
      //它可能会陷入一种奇怪的状态，其中回调被推入
      //微任务队列但是队列没有被刷新，直到浏览器
      //需要做一些其他工作，例如处理计时器。因此我们可以
      //通过添加空计时器“强制”刷新微任务队列。
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    // 当Promise不可用时，使用MutationObserver
    // 例如PhantomJS，iOS7，Android 4.4
    //（＃6466 MutationObserver在IE11中不可靠）
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Techinically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    // 尽管setImmediate是宏任务，但是比setTimeout更好。尤大？why？
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }
```

所以：$nextTick的降级顺序是
* Promise
* MutationObserver (copy源码来自 Vue.js v2.6.10)
* setImmediate
* setTimeout

顾轶灵在知乎上（2017-11-12）说：Vue 的 nextTick 实现移除了 MutationObserver 的方式（兼容性原因），取而代之的是使用 MessageChannel。但是在源码中并没有看到（2019-05-05 v2.6.10）

### 为什么$nextTick要降级 ？

根据HTML标准，在每个`task`运行完以后，`UI`都会重渲染，那么在`microtask`中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。
* 如果新建一个 task 来做数据更新，那么渲染就会进行两次。
* 并且setTimeout的间隔时间比较久

### 为什么要异步更新 ？

和节流、防抖差不多吧。如果没有异步更新操作，那么连续的改动都会直接操作DOM更新视图，这是非常消耗性能的。

而且`queueWatcher`中有`watcher.id`防重复
```
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 检验id是否存在，已经存在则直接跳过
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      // 如果没有flush，直接push到队列中
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

