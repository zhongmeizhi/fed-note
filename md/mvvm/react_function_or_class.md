# 函数式组件与类组件有何不同？

与React类组件相比，React函数式组件究竟有何不同？

[参考1:作者github](https://github.com/ryardley/hooks-perf-issues/pull/2)

[参考2：官网：](https://zh-hans.reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render)

一般的回答都是：
1. 类组件比函数式组件多了更多的特性，比如 `state`，那如果有 `Hooks` 之后呢？
2. 函数组件性能比类组件好，**但是在现代浏览器中，闭包和类的原始性能只有在极端场景下才会有明显的差别。** 
   1. 性能主要取决于代码的作用，而不是选择函数式还是类组件。尽管优化策略有差别，但性能差异可以忽略不计。

而下面会重点讲述：React的函数式组件和类组件之间根本的区别： 在**心智模型**上。


### 简单的案例

函数式组件以经常被忽略的点：**函数式组件捕获了渲染所用的值。（Function components capture the rendered values.）**

思考这个组件:

```jsx
function ProfilePage(props) {
  const showMessage = () => alert('你好 ' + props.user);

  const handleClick = () => setTimeout(showMessage, 3000);

  return <button onClick={handleClick}>Follow</button>
}
```

上述组件：如果 `props.user`是 `Dan`，它会在三秒后显示 `你好 Dan`。


如果是类组件我们怎么写？一个简单的重构可能就象这样：

```jsx
class ProfilePage extends React.Component {
  showMessage = () => alert('Followed ' + this.props.user);

  handleClick = () => setTimeout(this.showMessage, 3000);

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

通常我们认为，这两个代码片段是等效的。人们经常在这两种模式中自由的重构代码，但是很少注意到它们的含义：

**我们通过 React 应用程序中的一个常见错误来说明其中的不同。**

我们添加一个父组件，用一个下拉框来更改传递给子组件(`ProfilePage`)，的 `props.user`，实例地址：(https://codesandbox.io/s/pjqnl16lm7) 。

按步骤完成以下操作：
1. **点击** 其中某一个 Follow 按钮。
2. 在3秒内 **切换** 选中的账号。
3. **查看** 弹出的文本。

这时会得到一个奇怪的结果：

* 当使用 **函数式组件** 实现的 `ProfilePage`, 当前账号是 Dan 时点击 Follow 按钮，然后立马切换当前账号到 Sophie，弹出的文本将依旧是 `'Followed Dan'`。
* 当使用 **类组件** 实现的 `ProfilePage`, 弹出的文本将是 `'Followed Sophie'`：

在这个例子中，函数组件是正确的。 **如果我关注一个人，然后导航到另一个人的账号，我的组件不应该混淆我关注了谁。** ，而类组件的实现很明显是错误的。


### 案例解析

所以为什么我们的例子中类组件会有这样的表现？ 让我们仔细看看类组件中的 `showMessage` 方法：

```jsx
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };
```

这个类方法从 `this.props.user` 中读取数据。
1. 在 React 中 Props 是 不可变(immutable)的，所以他们永远不会改变。
2. 而 `this` 是而且永远是 可变(mutable)的。**

这也是类组件 `this` 存在的意义：能在渲染方法以及生命周期方法中得到最新的实例。

所以如果在请求已经发出的情况下我们的组件进行了重新渲染， `this.props`将会改变。 `showMessage`方法从一个"过于新"的 `props`中得到了 `user`。

从 this 中读取数据的这种行为，调用一个回调函数读取 `this.props` 的 timeout 会让 `showMessage` 回调并没有与任何一个特定的渲染"绑定"在一起，所以它"失去"了正确的 props。。


### 如何用类组件解决上述BUG？（假设函数式组件不存在）


我们想要以某种方式"修复"拥有正确 props 的渲染与读取这些 props 的 `showMessage`回调之间的联系。在某个地方 `props`被弄丢了。

#####  方法一：在调用事件之前读取 `this.props`，然后显式地传递到timeout回调函数中：

```jsx
class ProfilePage extends React.Component {
  showMessage = (user) => alert('Followed ' + user);

  handleClick = () => {
    const {user} = this.props;
    setTimeout(() => this.showMessage(user), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Followbutton>;
  }
}
```

然而，这种方法使得代码明显变得更加冗长。如果我们需要的不止是一个props 该怎么办？ 如果我们还需要访问state 又该怎么办？ **如果 `showMessage` 调用了另一个方法，然后那个方法中读取了 `this.props.something` 或者 `this.state.something` ，我们又将遇到同样的问题。**然后我们不得不将 `this.props`和 `this.state`以函数参数的形式在被 `showMessage`调用的每个方法中一路传递下去。

这样的做法破坏了类提供的工程学。同时这也很难让人去记住传递的变量或者强制执行，这也是为什么人们总是在解决bugs。


这个问题可以在任何一个将数据放入类似 `this` 这样的可变对象中的UI库中重现它（不仅只存在 React 中）


##### 方法二：如果我们能利用JavaScript闭包的话问题将迎刃而解。*

如果你在一次特定的渲染中捕获那一次渲染所用的props或者state，你会发现他们总是会保持一致，就如同你的预期那样：

```jsx
class ProfilePage extends React.Component {
  render() {
    const props = this.props;

    const showMessage = () => {
      alert('Followed ' + props.user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Follow</button>;
  }
}
```

**你在渲染的时候就已经"捕获"了props：**。这样，在它内部的任何代码（包括 `showMessage`）都保证可以得到这一次特定渲染所使用的props。


### Hooks 的由来

但是：如果你在 `render`方法中定义各种函数，而不是使用class的方法，那么使用类的意义在哪里？

事实上，我们可以通过删除类的"包裹"来简化代码：

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```

就像上面这样， `props`仍旧被捕获了 —— React将它们作为参数传递。 **不同于 `this` ， `props` 对象本身永远不会被React改变。**


当父组件使用不同的props来渲染 `ProfilePage`时，React会再次调用 `ProfilePage`函数。但是我们点击的事件处理函数，"属于"具有自己的 `user`值的上一次渲染，并且 `showMessage`回调函数也能读取到这个值。它们都保持完好无损。

这就是为什么，在上面那个的函数式版本中，点击关注账号1，然后改变选择为账号2，仍旧会弹出 `'Followed 账号1'`：


> **函数式组件捕获了渲染所使用的值。**

**使用Hooks，同样的原则也适用于state。** 看这个例子：

```jsx
function MessageThread() {
  const [message, setMessage] = useState('');

  const showMessage = () => {
    alert('You said: ' + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return <>
    <input value={message} onChange={handleMessageChange} />
    <button onClick={handleSendClick}>Send</button>
  </>;
}
```

如果我发送一条特定的消息，组件不应该对实际发送的是哪条消息感到困惑。这个函数组件的 `message`变量捕获了"属于"返回了被浏览器调用的单击处理函数的那一次渲染。所以当我点击"发送"时 `message`被设置为那一刻在input中输入的内容。


### 读取最新的状态

因此我们知道，在默认情况下React中的函数会捕获props和state。 **但是如果我们想要读取并不属于这一次特定渲染的，最新的props和state呢？**如果我们想要["从未来读取他们"]呢？

在类中，你通过读取 `this.props`或者 `this.state`来实现，因为 `this`本身时可变的。React改变了它。在函数式组件中，你也可以拥有一个在所有的组件渲染帧中共享的可变变量。它被成为"ref"：

```jsx
function MyComponent() {
  const ref = useRef(null);

}
```

但是，你必须自己管理它。

一个ref与一个实例字段扮演同样的角色。这是进入可变的命令式的世界的后门。你可能熟悉'DOM refs'，但是ref在概念上更为广泛通用。它只是一个你可以放东西进去的盒子。

甚至在视觉上， `this.something`就像是 `something.current`的一个镜像。他们代表了同样的概念。

默认情况下，React不会在函数式组件中为最新的props和state创造refs。在很多情况下，你并不需要它们，并且分配它们将是一种浪费。但是，如果你愿意，你可以这样手动地来追踪这些值：

```jsx
function MessageThread() {
  const [message, setMessage] = useState('');
  const latestMessage = useRef('');
  const showMessage = () => {
    alert('You said: ' + latestMessage.current);  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    latestMessage.current = e.target.value;  };
```

如果我们在 `showMessage`中读取 `message`，我们将得到在我们按下发送按钮那一刻的信息。但是当我们读取 `latestMessage.current`，我们将得到最新的值 —— 即使我们在按下发送按钮后继续输入。

ref是一种"选择退出"渲染一致性的方法，在某些情况下会十分方便。

通常情况下，你应该避免在渲染期间读取或者设置refs，因为它们是可变得。我们希望保持渲染的可预测性。 **然而，如果我们想要特定props或者state的最新值，那么手动更新ref会有些烦人。**我们可以通过使用一个effect来自动化实现它：

```jsx
function MessageThread() {
  const [message, setMessage] = useState('');

  const latestMessage = useRef('');
  useEffect(() => {
    latestMessage.current = message;
  });
  const showMessage = () => {
    alert('You said: ' + latestMessage.current);
  };
```


我们在一个effect 内部执行赋值操作以便让ref的值只会在DOM被更新后才会改变。这确保了我们的变量突变不会破坏依赖于可中断渲染的时间切片和 Suspense 等特性。

通常来说使用这样的ref并不是非常地必要。 **捕获props和state通常是更好的默认值。** 然而，在处理类似于intervals和订阅这样的命令式API时，ref会十分便利。你可以像这样跟踪 任何值 —— 一个prop，一个state变量，整个props对象，或者甚至一个函数。

这种模式对于优化来说也很方便 —— 例如当 `useCallback`本身经常改变时。然而，使用一个reducer 通常是一个更好的解决方式

闭包帮我们解决了很难注意到的细微问题。同样，它们也使得在并发模式下能更轻松地编写能够正确运行的代码。这是可行的，因为组件内部的逻辑在渲染它时捕获并包含了正确的props和state。


函数捕获了他们的props和state —— 因此它们的标识也同样重要。这不是一个bug，而是一个函数式组件的特性。例如，对于 `useEffect`或者 `useCallback`来说，函数不应该被排除在"依赖数组"之外。（正确的解决方案通常是使用上面说过的 `useReducer`或者 `useRef` ）

当我们用函数来编写大部分的React代码时，我们需要调整关于[优化代码](https://github.com/ryardley/hooks-perf-issues/pull/3)和[什么变量会随着时间改变](https://github.com/facebook/react/issues/14920)的认知与直觉。


> 到目前为止，我发现的有关于hooks的最好的心里规则是"写代码时要认为任何值都可以随时更改"。

React函数总是捕获他们的值 —— 现在我们也知道这是为什么了。

文章参考：React作者 Dan Abramov 的github

