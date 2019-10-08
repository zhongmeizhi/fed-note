# React 基础

## JSX

只支持表达式

## 生命周期

update、mount。

v16版本新属性

## setState

setState：异步 & 同步 & 回调

## 受控 & 不受控

受控：通过 onchange 和value来控制

不受控：通过ref来获取

## Router

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

## redux

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

可以修改`react-scripts\config`，但是其他人怎么办呢？

所以啊，可以使用 [react-app-rewired](https://github.com/timarney/react-app-rewired) 来解决

比如：设置`alias`
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


更改打包后静态文件路径

在`package.json`文件添加 `"homepage": "/路径"`


## 代理

`http-proxy-middleware`插件

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

### React Hooks


