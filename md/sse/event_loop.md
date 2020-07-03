# Javascript运行机制

> Javascript是一种单线程开发语言。理解Javascript的运行机制是日常编码必须要掌握的技能。

会讲述以下内容
1. JS单进程的优缺点
2. Event Loop
3. 宏任务和微任务
4. 实例讲解

### 为什么是单线程？

JavaScript的主要用途是与用户交互，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。
- 假设：如果JavaScript支持多线程，一个线程在某个DOM节点上添加内容，另外一个线程删除了这个节点，那么浏览器该以哪个线程为准呢？

单线程也避免了多线程的线程创建、线程上下文切换的开销。（Nginx 也是单线程的）

### 单线程的缺点

单线程就意味着容易发生线程等待资源，cpu空闲，而其他任务一直等待的问题。

### 什么是Event Loop（事件循环）

为了协调事件、用户交互、脚本、UI 渲染和网络处理等行为，防止主线程阻塞。于是Javascript设计者将所有任务分为两种，一种是同步任务，一种是异步任务
- 同步任务指的是，在`主线程`上排队执行的任务
  - 同步任务只有前一个任务执行完毕，才能执行下一个任务。
  - 同步任务都在主线程上执行，形成一个`执行栈`
    - 每次执行栈执行的代码就是一个宏任务
- 异步任务指的是，不进入主线程，而进入`任务队列`的任务。
  - 只要指定过回调函数，这些事件发生时就会进入"任务队列"（比如鼠标点击...等）
  - 一旦`执行栈中的所有同步任务执行完毕`，系统就会读取“任务队列”。
  - 任务队列是一个先进先出的数据结构，排在前面的事件，优先被主线程读取。

"主线程"从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）。

### 宏任务和微任务

根据规范：每个任务都有一个任务源(task source)，源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列，所以有了宏任务(macro)task和微任务(micro)task。

浏览器为了能够使得JS内部(macro)task与DOM任务能够有序的执行，会在**一个task执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染**，

**每次执行完一个宏任务之后，会去检查是否存在微任务**；如果有，则执行微任务直至**清空微任务队列**（如果在微任务执行期间微任务队列加入了新的微任务，会将新的微任务加入队列尾部，之后也会被执行）。

根据上述总结流程为：

![流程图](../img/event_loop.jpg)

附（宏/微任务清单）：

- 宏任务(macro)task主要有： script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境)
- 微任务(micro)task主要有： Promise.then、MutaionObserver、process.nextTick(Node.js 环境)
- `requestAnimationFrame` 既不属于宏任务, 也不属于微任务

~~目前宏任务和微任务在各浏览器执行都有差异，最后提议promise为微任务~~

### 实例分析
```
    console.log(1)

    Promise.resolve(2).then(console.log)

    requestIdleCallback(() => {
        console.log(3);
        Promise.resolve(4).then(console.log)
    })

    setTimeout(() => {
        console.log(6)
        Promise.resolve(7).then(console.log)
    }, 0)

    requestAnimationFrame(() => {
        console.log(8)
        Promise.resolve(9).then(console.log)
    })

    var intersectionObserver = new IntersectionObserver(function(entries) {
     	if (entries[0].intersectionRatio <= 0) return;
      	console.log('LoadedNewItems');
      	Promise.resolve('doSomething').then(console.log)
    });
    // 开始监听
    intersectionObserver.observe(document.querySelector('div'));

    new Promise(reslove => reslove(5)).then(console.log)

    console.log(10)
```
以上案例会打印 `1 10 2 5` -> undefined -> `8 9 LoadedNewItems doSomething 6 7 3 4`
如果没有 `intersectionObserver` 会打印  `1 10 2 5` -> undefined -> `8 9 3 4 6 7`

结果解析：
1. JavaScript执行主线程任务：`打印 1 10`
   - 附：Promise构造器内部是同步任务
2. 执行微任务队列：`打印 2 5`
3. 宏任务和微任务都执行完成：`打印 undefined`
4. 执行`requestAnimationFrame` ，`打印 8`
5. 执行`requestAnimationFrame`的微任务，`打印  9`
6. 执行`IntersectionObserver`，`打印 LoadedNewItems`
7. 执行`IntersectionObserver`的微任务，`打印 doSomething`
8. **更新界面**
9. 如果浏览器空闲，调用`requestIdleCallback`，`打印 3`
    * 如果`requestIdleCallback`被调用，那么会继续执行微任务，`打印 4`
10. 一帧结束：
11. 下一帧开始：执行`settimeout`，`打印 6`
12. 执行`settimeout`的微任务，`打印 7`

### 结论

1. 宏任务
2. 微任务
4. requestAnimationFrame
5. IntersectionObserver
6. 更新界面
7. requestIdleCallback
8. 下一帧
