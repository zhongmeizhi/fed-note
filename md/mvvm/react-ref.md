# React ref 原来是这样的

最近开始研究React了，这篇文章主要是讲述 Ref 相关的内容，如有错误请指正。

## ref 的由来

在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。但是，在某些情况下，你需要在典型数据流之外强制修改子组件/元素。

适合使用 refs 的情况：

* 管理焦点，文本选择或媒体播放。
* 触发强制动画。
* 集成第三方 DOM 库。

## ref 的四种方式

在 React v16.3 之前，ref 通过字符串（string ref）或者回调函数（callback ref）的形式进行获取。

ref 通过字符获取：

```js
// string ref
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.myRef.focus();
  }

  render() {
    return <input ref="myRef" />;
  }
}
```

ref 通过回调函数获取：

```js
// callback ref
class MyComponent extends React.Component {
  componentDidMount() {
    this.myRef.focus();
  }

  render() {
    return <input ref={(ele) => {
      this.myRef = ele;
    }} />;
  }
}
```

在 v16.3 中，经 [0017-new-create-ref](https://github.com/reactjs/rfcs/blob/master/text/0017-new-create-ref.md) 提案引入了新的 API：`React.createRef`。

ref 通过 React.createRef 获取：

```js
// React.createRef
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.myRef.current.focus();
  }
  
  render() {
    return <input ref={this.myRef} />;
  }
}
```

当然还有最近react大力推崇的 hooks：useRef

```js
function MyComponent() {
  const myRef = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    myRef.current.focus();
  };
  return (
    <>
      <input ref={myRef} type="text" />
      <button onClick={onButtonClick}>聚焦</button>
    </>
  );
}
```

## 将被移除的 string ref

首先来具体说说 `string ref`，string ref 就已被诟病已久，React 官方文档中如此声明：`"如果你目前还在使用 this.refs.textInput 这种方式访问 refs ，我们建议用回调函数或 createRef API 的方式代替。"`，为何如此糟糕？ 

最初由 React 作者之一的 `dan abramov`。发布于[https://news.ycombinator.com/edit?id=12093234](https://news.ycombinator.com/edit?id=12093234)，（该网站需要梯子）。吐槽内容主要有以下几点：

1. string ref 不可组合。 例如一个第三方库的父组件已经给子组件传递了 ref，那么我们就无法在在子组件上添加 ref 了。 另一方面，回调引用没有一个所有者，因此您可以随时编写它们。例如：

```js
/** string ref **/
class Parent extends React.Component {
  componentDidMount() {
    // 可获取到 this.refs.childRef
    console.log(this.refs);
  }
  render() {
    const { children } = this.props;
    return React.cloneElement(children, {
      ref: 'childRef',
    });
  }
}

class App extends React.Component {
  componentDidMount() {
    // this.refs.child 无法获取到
    console.log(this.refs);
  }
  render() {
    return (
      <Parent>
        <Child ref="child" />
      </Parent>
    );
  }
}
```

2. string ref 的所有者由当前执行的组件确定。 这意味着使用通用的“渲染回调”模式（例如react），错误的组件将拥有引用（它将最终在react上而不是您的组件定义renderRow）。

```js
class MyComponent extends Component {
  renderRow = (index) => {
    // string ref 会挂载在 DataTable this 上
    return <input ref={'input-' + index} />;

    // callback ref 会挂载在 MyComponent this 上
    return <input ref={input => this['input-' + index] = input} />;
  }

  render() {
    return <DataTable data={this.props.data} renderRow={this.renderRow} />
  }
}
```

3. string ref 不适用于Flow之类的静态分析。 Flow不能猜测框架可以使字符串ref“出现”在react上的神奇效果，以及它的类型（可能有所不同）。 回调引用比静态分析更友好。
4. string ref 强制React跟踪当前正在执行的组件。 这是有问题的，因为它使react模块处于有状态，并在捆绑中复制react模块时导致奇怪的错误。在 reconciliation 阶段，React Element 创建和更新的过程中，ref 会被封装为一个闭包函数，等待 commit 阶段被执行，这会对 React 的性能产生一些影响。

关于这点可以参考 React 源码 `coerceRef` 的实现：

在调和子节点得过程中，会对 string ref 进行处理，把他转换成一个方法，这个方法主要做的事情就是设置 instance.refs[stringRef] = element，相当于把他转换成了function ref

对于更新得过程中string ref是否变化需要对比得是 current.ref._stringRef，这里记录了上一次渲染得时候如果使用得是string ref他的值是什么

owner是在调用createElement的时候获取的，通过ReactCurrentOwner.current获取，这个值在更新一个组件前会被设置，比如更新ClassComponent的时候，调用render方法之前会设置，然后调用render的时候就可以获取对应的owner了。


## 坚挺的 callback ref

React 将在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null。在 componentDidMount 或 componentDidUpdate 触发前，React 会保证 refs 一定是最新的。

如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素。这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。通过将 ref 的回调函数定义成 class 的绑定函数的方式可以避免上述问题，但是大多数情况下它是无关紧要的。

## 后来的 React.createRef

React.createRef 的优点：

* 相对于 callback ref 而言 React.createRef 显得更加直观，避免了 callback ref 的一些理解问题。

React.createRef 的缺点：

1. 性能略低于 callback ref
2. 能力上仍逊色于 callback ref，例如上一节提到的组合问题，createRef 也是无能为力的。

ref 的值根据节点的类型而有所不同：

* 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性。
* 当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性。
* 默认情况下，你不能在函数组件上使用 ref 属性（可以在函数组件内部使用），因为它们没有实例：
  * 如果要在函数组件中使用 ref，你可以使用 forwardRef（可与 useImperativeHandle 结合使用）
  * 或者可以将该组件转化为 class 组件。

## hooks大家族 useRef

这第四种使用 ref 的方法又有何不同呢？

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。**返回的 ref 对象在组件的整个生命周期内保持不变**。并且 useRef 可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。

正是由于这些特性，`useRef` 和 `createRef` 出现了很大差异。

可以运行下以下代码：

```js
import React, { useState, useRef, useEffect } from "react";

export default function App() {

  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
  });

  function handleAlertclick() {
    setTimeout(() => {
      alert("latestCount.current:" + latestCount.current + '.. count: ' + count);
    }, 2000);
  }
  
  return (
    <div>
      <p>当前count： {count} </p>
      <button onClick={() => setCount(count + 1)}>count + 1</button>
      <button onClick={handleAlertclick}> 提示 </button>
    </div>
  )
}
```

然后按照下面步骤进行操作：

1. 连续点击5次 `count + 1` 按钮
2. 点击 `提示` 按钮
3. 再点击完 `提示` 按钮后2秒内连续点击2次 `count + 1` 按钮
4. 等待 alert 弹窗提示。

然后会你会得到一个有趣的答案：alert 弹窗会提示： `latestCount.current:7.. count: 5`。使用 `useRef` 能获取到最新的值，但是 `useState` 却不能。

具体原因可以参考 react 作者之一 dan 的个人博客。或者查看 [React 函数式组件和类组件的区别，不是只有state和性能！](https://juejin.im/post/6844904049146331150)

那么 useRef 真有那么很好用吗？并不是的。还有由于它上面的那个特性，问题还是不少的。

你可以尝试跑一下下面这段代码，或者 [点击这里查看](https://codesandbox.io/s/1rvwnj71x3)

```js
import React, { useRef, createRef, useState } from "react";
import ReactDOM from "react-dom";

function App() {
  const [renderIndex, setRenderIndex] = useState(1);

  const refFromUseRef = useRef();
  const refFromCreateRef = createRef();

  if (!refFromUseRef.current) {
    // 赋值操作
    refFromUseRef.current = renderIndex;
  }
  if (!refFromCreateRef.current) {
    // 赋值操作
    refFromCreateRef.current = renderIndex;
  }
  return (
    <div className="App">
      Current render index: {renderIndex}
      <br />
      在refFromUseRef.current中记住的第一个渲染索引：
      {refFromUseRef.current}
      <br />
      在refFromCreateRef.current中未能成功记住第一个渲染索引：
      {refFromCreateRef.current}
      <br />
      <button onClick={() => setRenderIndex(prev => prev + 1)}>
        数值 + 1
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

上面的案例中无论如何点击按钮 `refFromUseRef.current` 将始终为 `1`，而 `renderIndex` 和 `refFromCreateRef.current` 会伴随点击事件改变; 意想不到吧？

因为：当 ref 对象内容发生变化时，useRef 并不会通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用 `callback ref` 来实现。

总结下：

1. useRef 可以获取 DOM ref
2. useRef 可以获取最新的值
3. useRef 内容发生改变并不会通知

由于上面的一些问题，起初我也是并不想把 useRef 作为操作 ref 的方法来讲的。

## Refs 转发

#### 是否需要将 DOM Refs 暴露给父组件？

在极少数情况下，你可能希望在父组件中引用子节点的 DOM 节点。通常不建议这样做，因为它会打破组件的封装，但它偶尔可用于触发焦点或测量子 DOM 节点的大小或位置。

#### 如何将 ref 暴露给父组件？

如果你使用 16.3 或更高版本的 React, 这种情况下我们推荐使用 ref 转发。Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref。

什么是 ref 转发？

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

如果在低版本中如何转发？

如果你使用 16.2 或更低版本的 React，或者你需要比 ref 转发更高的灵活性，你可以使用 ref 作为特殊名字的 prop 直接传递。

比如下面这样：

```js
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}
```

以下是对上述示例发生情况的逐步解释：

1. 我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
2. 我们通过指定 ref 为 JSX 属性，将其向下传递给 `<FancyButton ref={ref}>`。
3. React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
4. 我们向下转发该 ref 参数到 `<button ref={ref}>`，将其指定为 JSX 属性。
5. 当 ref 挂载完成，ref.current 将指向 `<button>` DOM 节点。

## 最后

欢迎关注公众号 **[前端进阶课](http://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/292c68443dec4a2ab17208a5d08222fe~tplv-k3u1fbpfcp-zoom-1.image)** 认真学前端，一起进阶。回复 `全栈` 或 `Vue` 有好礼相送哦。