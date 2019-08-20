# React 基础

# TODO

* (在React 16- 版本前当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树)
* React 16.4+ 版本 新的生命周期钩子(getDerivedStateFromProps)完成Bugfix。

组件实例化后和接受新属性时将会调用getDerivedStateFromProps。它应该返回一个对象来更新状态，或者返回null来表明新属性不需要更新任何状态。

注意，如果父组件导致了组件的重新渲染，即使属性没有更新，这一方法也会被调用。如果你只想处理变化，你可能想去比较新旧值。

调用this.setState() 通常不会触发 getDerivedStateFromProps()。


渲染改为 -> 异步渲染

异步渲染的逻辑和

由于异步渲染，在“渲染”时期（如componentWillUpdate和render）和“提交”时期（如getSnapshotBeforeUpdate和componentDidUpdate）间可能会存在延迟。如果一个用户在这期间做了像改变浏览器尺寸的事，从componentWillUpdate中读出的scrollHeight值将是滞后的。

因为是异步渲染，所以需要新的生命周期钩子：getSnapshotBeforeUpdate
  * `getSnapshotBeforeUpdate()`在最新的渲染输出提交给DOM前将会立即调用。

### React 切片机制

fiber
