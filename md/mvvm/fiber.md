# fiber

本人系一个惯用Vue的菜鸡，恰巧周末和大佬扯蛋，峰回路转谈到了fiber，被大佬疯狂鄙视，今日做一个笔记。

### 为什么要用 fiber

旧版本React同步更新：当React决定要加载或者更新组件树时，会做很多事，比如调用各个组件的生命周期函数，计算和比对Virtual DOM，最后更新DOM树。假如更新一个组件需要1毫秒，如果有200个组件要更新，那就需要200毫秒，在这200毫秒的更新过程中，主线程都在专心运行更新操作，这就会出现界面卡顿，造成很不好的用户体验。

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

##### 在reconciliation期间：

来自render方法返回的每个React元素的数据被合并到fiber node树中，React为每个React元素创建了一个fiber node。与React元素不同，每次渲染过程，不会再重新创建fiber。随后的更新中，React重用fiber节点，并使用来自相应React元素的数据来更新必要的属性。

可以这样认为：fiber作为一种数据结构，用于代表某些worker，换句话说，就是一个work单元，通过Fiber的架构，提供了一种跟踪，调度，暂停和中止工作的便捷方式。

##### Render阶段

这里用的是 `深度优先搜索(DFS)`

循环处理，先处理子节点，再处理兄弟节点，直到循环完成。


### 时间切片为什么不用 requestIdleCallback

`requestIdleCallback` 实际上有点过于严格，并且执行频率不足以实现流畅的UI呈现，

而且我们希望可以随时停止遍历并稍后再恢复。

因此React团队不得不实现自己的版本。


### 时间切片为什么不用微任务？

```
  1. 宏任务
  2. 微任务
  4. requestAnimationFrame
  5. IntersectionObserver
  6. 更新界面
  7. requestIdleCallback
  8. 下一帧
```

设想：采用的 微任务 + 宏任务的双任务队列去实现的时间切片。

但实际上有微任务，只要不是小组件，就很容易超过16ms，而微任务不能中断，就一定会阻塞UI的。

而fiber，就是说你更新这个组件时如果超过了16毫秒，我可以中途打断他，比如说他渲染了他有六个元素，那渲染到第三个的时候，他需要被打断了，然后下一次我继续渲染剩下那三个。

### vue 为什么不用 时间切片

为何？

ps：Vue3.0，（vue-next）曾使用双任务（微任务 + 宏任务）来实现时间切片，不过已经被废除了

