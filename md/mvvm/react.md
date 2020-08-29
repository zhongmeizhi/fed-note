# React 基础

## 生命周期

生命周期主要是：挂载、销毁、更新

```js
  // 用于初始化 state
  constructor() {}

  // 组件挂载后调用
  // 可以在该函数中进行请求或者订阅
  componentDidMount() {}

  // 组件销毁后调用
  componentDidUnMount() {}

  // 判断是否需要更新组件，多用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}

  // 组件更新后调用
  componentDidUpdate() {}

  // 渲染组件函数
  render() {}
```


### 16版本 新生命周期

16版本后，取消与 `componentWill` 相关的生命周期

```js
  /*
    16版本 已取消的组件
  */
  ~~ componentWillReceiveProps ~~ // 将收到父组件的属性
  ~~ componentWillUnmount ~~  // 将销毁
  ~~ componentWillUpdate ~~ // 将更新
```

删除这些生命周期的原因是：因为这些生命周期发生在渲染的 `reconciliation` 阶段，而这阶段是可以被打断的，所以执行的生命周期函数**可能会出现调用多次**的情况。


通过新增组件来代替旧的生命周期

```js
  static getDerivedStateFromProps(nextProps, prevState) {} 

  getSnapshotBeforeUpdate() 
```

1. getDerivedStateFromProps

`getDerivedStateFromProps` 用于替换 `componentWillReceiveProps` 

该函数会在**初始化**和**update**时被调用。（虚拟dom之后，实际dom挂载之前）。它应该返回一个对象来更新状态，或者返回null来表明新属性不需要更新任何状态。

注意，如果父组件导致了组件的重新渲染，即使属性没有更新，这一方法也会被调用。如果你只想处理变化，你可能想去比较新旧值。

调用this.setState() 通常不会触发 getDerivedStateFromProps()。

因为该函数是静态函数，所以取不到 `this`，如果需要对比 `prevProps` 需要单独在 `state` 中维护


2. getSnapshotBeforeUpdate

`getSnapshotBeforeUpdate` 用于替换 `componentWillUpdate` ，该函数会在最新的渲染输出提交给DOM前调用（update 后 DOM 更新前），用于读取最新的 DOM 数据。

代替的原因：由于异步渲染，在“渲染”时期（如componentWillUpdate和render）和“提交”时期（如componentDidUpdate）间可能会存在延迟。如果一个用户在这期间做了像改变浏览器尺寸的事，**从componentWillUpdate中读出的scrollHeight值将是滞后的**。

返回值作为 `componentDidUpdate` 的第三个参数使用


### 异步渲染

**异步渲染**分两个阶段：`reconciliation`（可以打断） 和 `commit`（不能暂停，会一直更新界面直到完成）

Reconciliation 阶段（可译：调和/协调）
* shouldComponentUpdate
* ~~componentWillMount~~
* ~~componentWillReceiveProps~~
* ~~componentWillUpdate~~

Commit 阶段
* componentDidMount
* componentDidUpdate
* ~~componentWillUnmount~~

因为 `reconciliation` 阶段是可以被打断的，所以执行的生命周期函数**可能会出现调用多次**的情况，从而引起 Bug。所以对于 reconciliation 阶段调用的几个函数，除了 shouldComponentUpdate 以外，其他都应该避免去使用。所以在 V16 中删除了shouldComponentUpdate 以外的生命周期，并且引入了新的 生命周期钩子 来解决这个问题。


### setState

setState：是异步的，并且多次调用会合并为一次，（类似于 `Object.assign({}, obj, obj)`）

```
  // this.state.count 初始化为 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 }, console.log)

  console.log(this.state.count === 0);

  setTimeout(() => {
    console.log(this.state.count === 1);
  }, 1)

  // 通过 prevState 参数可以正确的修改
  this.setState((prevState) => ({ count: prevState.count + 1 }))
```

### Component 和 PureComponent

`PureComponent` 和 `Component` 的区别：
* 当props或者state改变时：`PureComponent` 默认在 `shouldComponentUpdate` 中使用浅比较来判断是否需要重新渲染，
* 当props或者state改变时：`Component`的组件会重新渲染。

PureComponent的缺点：一些深层数据的改变可能会产生`shouldComponentUpdate`为false，导致不能更新

方法的不同绑定方式区别

```
  <CommentItem onClick={() => this.clickHandler(id)} />

  // 综合上面的 Component 和 PureComponent 每当 父组件 render更新时，都会触发子组件获取到新的 onClick的 props，导致子组件重新渲染
  // 解决方式：父组件之间传 this.clickHandler ，然后子组件调用 this.props.clickHandler(this.props.id)
```


### React 切片机制 fiber

时间切片实际上是将任务分成不同的优先级，计算任务的运行时间，从而将任务分隔为，能暂停的方法在16ms以内

详情在 Fiber 源码解析 详细介绍

### JSX

只支持表达式

JSX 代码会被 Babel 编译为 `React.createElement` (所以jsx文件必须要引入React，不管React是否有显式使用)


### 受控 & 不受控

受控：通过 onchange 和value来控制

不受控：通过ref来获取

```
  // 正确的 ref使用
    ref={(ele) => this.xxRef = ele};
```

### Router

> `create-react-app`默认使用`react-router-dom`

* `BrowserRouter`需要服务器支持，否则会出现`404`，
* `HashRouter`比较随意（虽然不太好看）

```
  import { HashRouter as Router, Route } from "react-router-dom";

  <Router>
      <Route exact path="/" component={Home} />
      <Route path="/exception" component={Exception} />
      <Route path="/trade-record" component={TradeRecord} />
      <Route path="/trade-interval" component={TradeInterval} />
  </Router>
```

### redux

redux是通过发布订阅者模式实现的：

单向数据流
1. 调用store.dispatch(action)提交`action`。
2. 中间件 处理
3. redux store调用传入的`reducer`函数。把当前的state和action传进去。
4. 根 reducer 应该把多个子 reducer 输出合并成一个单一的 `state` 树。
5. Redux store 保存了根 reducer 返回的完整 state 树。

容器组件就是使用 `store.subscribe() `从 `Redux state` 树中读取部分数据，并通过 `props` 来把这些数据提供给要渲染的组件。你可以手工来开发容器组件，但建议使用 React Redux 库的 `connect()` 方法来生成，这个方法做了性能优化来避免很多不必要的重复渲染。

connect接收两个参数，一个`mapStateToProps`,就是把redux的`state`，转为组件的`Props`，还有一个参数是`mapDispatchToprops`,就是把`actions`的方法，转为`Props`属性函数。


## 个性化配置

> react-create-app 个性化配置

可以修改`react-scripts\config`（很不妥哇）

所以啊，可以使用 [react-app-rewired](https://github.com/timarney/react-app-rewired) 来解决

### 设置别名 alias
1. 安装 react-app-rewired
2. 配置启动项 `"start": "react-app-rewired start"`
3. 添加`config-overrides.js`文件
4. 添加代码
  ```
    const path = require('path');

    function resolve(dir) {
        return path.join(__dirname, '.', dir)
    }
    
    module.exports = function override(config, env) {
        config.resolve.alias = {
            '@': resolve('src')
        }
        return config;
    }
  ```


### 更改打包后静态文件路径

在`package.json`文件添加 `"homepage": "/路径"`


### 代理：`http-proxy-middleware`插件

```
  const proxy = require('http-proxy-middleware');

  module.exports = function (app) {
      app.use(
          proxy(
              '/xyz',
              {
                  target: 'http://www.zmz.com/xyz',
                  changeOrigin: true,
                  pathRewrite: {
                      '^/xyz': '/'   //重写接口
                  }
              }
          )
      );
  }
```

### React Hook

> `Hook` 可以在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

使用 Hook 的目的
1. 解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。
2. 功能的复用

注意点：
1. **Hook 在 class 内部是不起作用的。但可以用它取代 class**
2. **只在最顶层使用 Hook。不要在循环，条件或嵌套函数中调用 Hook**
3. **只在 React 函数中调用 Hook**
4. **Hook 的调用顺序在每次渲染中都是相同的**
   * 由于是顺序调用，如果Hook不放在顶层，比如放在if中，会导致顺序后面的hook被提前调用

##### 状态相关：useState

懒惰的 state：useState传入一个函数，然后返回初始化的值。类似于cached
```
  const [state, setState] = useState(() => {
    const initialState = someExpensiveComputation(props);
    return initialState;
  });

```

##### 副作用相关：useEffect

> 数据获取、设置订阅以及手动更改组件的 DOM 都属于副作用

* `useEffect`默认：第一次渲染之后和每次更新之后都会执行
  * 每次运行 effect 的同时，DOM 都已经更新完毕
* `effect`可以在一个组件中声明多个，将按照声明的顺序依次调用组件中的每一个 `effect`
* `useEffect`也可看做 `componentDidMount`、`componentDidUpdate`、`componentWillUnmount`的组合
  * 而class中副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中
* 可选**清除机制**：如果在 `useEffect` 返回函数，`React` 将会在执行清除操作时调用该函数
* 可选**跳过effect**：`useEffect`的第二个参数可以传数组
  * 在组件重新渲染的时候会比较数组中的每个值是否和以前相等，（相等就会跳过）
  * 该参数对 清除机制 同样有效
  * 如果第二个参数为 空数组[]，那么该`effect`只会执行一次
* 不能在 `useEffect` 中做有副作用的事情


##### 自定义 Hook

定义：自定义的hook 其实就是以命名以 use开头的 function，里面正常使用 hook，然后返回state。

使用：使用和正常的function一致。

注意：**两个相同的Hook状态是不共享的**

其他Hook方法：
* `useContext`：接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。
  * 当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定
  * 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染
* `useReducer`：useState 的替代方案，用在逻辑较为复杂且多个子值的情况，类型于`redux`
* `useCallback`：依赖项改变时更新，类似于Vue的 计算属性，（useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。）
* `useMemo`：依赖项改变时更新，在渲染阶段执行，（可以把 useMemo 作为性能优化的手段）
* `useRef`：对于一个可变的DOM元素，无论该节点如何改变 ref 会一直对应 useRef(null)的`.current`属性
* `useImperativeHandle`：可以将使用ref时自定义暴露给父组件
* `useLayoutEffect`：在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。
* `useDebugValue`：在hook的debugger中使用


## 在React中使用 Typescript

### 在 `Ts/Tsx` 文件中引入 `js` 文件/库

需要在`.d.ts` 的声明文件中，然后用`三斜线指令引入`

以`create-react-app`为例：在`react-app-env.d.ts`文件中添加需要引入的 `.js`文件位置

```
    /// <reference types="react-scripts" />
    /// <reference path="./utils/throttle.js" />
```

或引入 `.d.ts` 文件

例如：
```
    // jquery.d.ts 文件
    declare let $: (selector: string) => any;

    // main.ts 文件
    /// <reference path="./jquery.d.ts" />

    $('body').html('hello world');
```

三斜线指令中需要注意的是 path 类型和 types 类型的区别：
* `types` 类型声明的是对 `node_modules/@types` 文件夹下的类型的依赖，不包含路径信息
* `path` 类型声明的是对本地文件的依赖，包含路径信息

## 学习路上的小技巧

### 为children注入样式/数据

```jsx
{
  React.Children.map(children, (child) => {
    const childTs = child as React.DetailedReactHTMLElement<any, HTMLElement>;
    return React.cloneElement(childTs,
        {
            className:  `${childTs.props.className} self-style`,
        },
    )
  })
}
```
