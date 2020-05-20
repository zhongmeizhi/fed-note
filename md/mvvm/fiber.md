# fiber

本人系一个惯用Vue的菜鸡，恰巧周末和大佬扯蛋，峰回路转谈到了fiber，被大佬疯狂鄙视，今日做一个笔记。

### 为什么要用 fiber

旧版本React同步更新：当React决定要加载或者更新组件树时，会做很多事，比如调用各个组件的生命周期函数，计算和比对Virtual DOM，最后更新DOM树。

举个栗子：更新一个组件需要1毫秒，如果有200个组件要更新，那就需要200毫秒，在这200毫秒的更新过程中，主线程都在专心运行更新操作。

而浏览器每间隔一定的时间重新绘制一下当前页面。一般来说这个频率是每秒60次。也就是说每16毫秒（ 1 / 60 ≈ 0.0167 ）浏览器会有一个周期性地重绘行为，这每16毫秒我们称为一帧。这一帧的时间里面浏览器做些什么事情呢：

1. 执行JS。
2. 计算Style。
3. 构建布局模型(Layout)。
4. 绘制图层样式(Paint)。
5. 组合计算渲染呈现结果(Composite)。

如果这六个步骤中，任意一个步骤所占用的时间过长，总时间超过 16ms 了之后，用户也许就能看到卡顿。而上述栗子中组件同步更新耗时 200ms。

因为JavaScript单线程的特点，每个同步任务不能耗时太长，不然就会让程序不会对其他输入作出相应，React的更新过程就是犯了这个禁忌，而React Fiber就是要改变现状。

解决同步更新的方案就是时间切片：把更新过程碎片化，把一个耗时长的任务分成很多小片。执行非阻塞渲染，基于优先级应用更新以及在后台预渲染内容。

### 什么是 fiber

Fiber的体系结构分为两个主要阶段：`reconciliation`（协调）/`render 和 commit`

* `reconciliation`：可以打断
* `render` 和 `commit`：不能暂停，会一直更新界面直到完成

Reconciliation 阶段

* shouldComponentUpdate
* ~~componentWillMount~~
* ~~componentWillReceiveProps~~
* ~~componentWillUpdate~~

Commit 阶段
* componentDidMount
* componentDidUpdate
* ~~componentWillUnmount~~

Fiber 对象是一个链表结构，通过以下属性组成一个链表

* return 存储当前节点的父节点
* child 存储第一个子节点
* sibling 存储右边第一个的兄弟节点

来自render方法返回的每个React元素的数据被合并到fiber node树中，React为每个React元素创建了一个fiber node。与React元素不同，每次渲染过程，不会再重新创建fiber。随后的更新中，React重用fiber节点，并使用来自相应React元素的数据来更新必要的属性。


对于UI来说还需要考虑以下问题：

并不是所有的state更新都需要立即显示出来，比如:

* 屏幕之外的部分的更新并不是所有的更新优先级都是一样的
* 用户输入的响应优先级要比通过请求填充内容的响应优先级更高
* 理想情况下，对于某些高优先级的操作，应该是可以打断低优先级的操作执行的

React 会维护一个 `workInProgressTree` 用于计算更新，完成 reconciliation 过程。这里用的是 `深度优先搜索(DFS)`，循环处理，先处理子节点，再处理兄弟节点，直到循环完成。

当有更新任务来的时候，不会马上去做 Diff 操作，而是先把当前的更新送入一个 Update Queue 中，然后交给 `Scheduler` 去处理，Scheduler 会根据当前主线程的使用情况去处理这次 Update。

可以这样认为：fiber作为一种数据结构，用于代表某些worker，换句话说，就是一个work单元，通过Fiber的架构，提供了一种跟踪，调度，暂停和中止工作的便捷方式。


### Fiber 为什么要使用链表

我们在遍历 dom 树 diff 的时候，即使中断了，我们只需要记住中断时候的那么一个节点，就可以在下个时间片恢复继续遍历并 diff。这就是 fiber 数据结构选用链表的一大好处。

下文讲述如何通过链表实现时间切片的中断和恢复。


### 时间切片为什么不用 requestIdleCallback

浏览器个周期执行的事件

```
  1. 宏任务
  2. 微任务
  4. requestAnimationFrame
  5. IntersectionObserver
  6. 更新界面
  7. requestIdleCallback
  8. 下一帧
```

根据[官方]([requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback))描述: 

> `window.requestIdleCallback()` 方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 `timeout`，则有可能为了在超时前执行函数而打乱执行顺序。
> 你可以在空闲回调函数中调用 `requestIdleCallback()`，以便在下一次通过事件循环之前调度另一个回调。


看似完美契合时间切片的思想，但实际上 `requestIdleCallback`  有点过于严格，并且执行频率不足以实现流畅的UI呈现。

而且我们希望通过Fiber 架构，让 `reconcilation` 过程变成可被中断。 '适时'地让出 CPU 执行权。因此React团队不得不实现自己的版本。

Fiber 的思想和协程的概念是契合的。举个栗子：

普通函数: （无法被中断和恢复）

```js
const tasks = []
function run() {
  let task
  while (task = tasks.shift()) {
    execute(task)
  }
}
```

如果使用 `Generator` 语法:

```js
const tasks = []
function * run() {
  let task

  while (task = tasks.shift()) {
    // 判断是否有高优先级事件需要处理, 有的话让出控制权
    if (hasHighPriorityEvent()) {
      yield
    }

    // 处理完高优先级事件后，恢复函数调用栈，继续执行...
    execute(task)
  }
}
```

### 时间切片为什么不用双任务？

设想：采用的 微任务 + 宏任务的双任务队列去实现的时间切片。

`anu.js` 使用的就是 双任务模式。

但实际上有微任务，只要不是小组件，就很容易超过16ms，而微任务不能中断，就一定会阻塞UI的。

而fiber，就是说你更新这个组件时如果超过了16毫秒，我可以中途打断他，比如说他渲染了他有六个元素，那渲染到第三个的时候，他需要被打断了，然后下一次我继续渲染剩下那三个。


ps：Vue3.0，（vue-next）曾使用双任务（微任务 + 宏任务）来实现时间切片，不过已经被废除了
