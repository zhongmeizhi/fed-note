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

## Css Module

> CSS Modules 会转换 `class` 和 `id` 相关的样式。

#### 默认局部样式 && 全局样式
```
  .normal {
    color: green;
  }

  /* 以上与下面等价 */
  :local(.normal) {
    color: green; 
  }

  /* 定义全局样式 */
  :global(.btn) {
    color: red;
  }

  /* 定义多个全局样式 */
  :global {
    .link {
      color: green;
    }
    .box {
      color: yellow;
    }
  }
```

#### composes 组合样式
```
  /* components/Button.css */
  .base { /* 所有通用的样式 */ }

  .normal {
    composes: base;
    /* normal 其它样式 */
  }

  .disabled {
    composes: base;
    /* disabled 其它样式 */
  }
```

```
  <button class=${styles.normal}>Submit</button>

  // 编译成
  <button class="button--base-daf62 button--normal-abc53">Submit</button>
```

#### CSS Modules 结合 React 实践

```
  import classNames from 'classnames';
  import styles from './dialog.css';

  export default class Dialog extends React.Component {
    render() {

      // 用 classnames 库来操作 class 名
      const cx = classNames({
        [styles.confirm]: !this.state.disabled,
        [styles.disabledConfirm]: this.state.disabled
      });

      return <div className={styles.root}>
        <a className={cx}>Confirm</a>
        ...
      </div>
    }
  }
```

`- -!` 还能使用 `react-css-modules` 通过高阶函数的形式来避免重复输入 `styles.**`。

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


