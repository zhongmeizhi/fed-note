# vue3 computed

前面几章已经把从 vite 到 reactive，然后再到手写一个响应式的 vue3。现在开始对上一章完成的 vue3 进行补充。

## ref

使用 reactive 会有一个缺点，那就是，Proxy 只能代理对象，但不能代理基础类型。

如果你调用这段代码 `new Proxy(0, {})`，浏览器会反馈你 `Uncaught TypeError: Cannot create proxy with a non-object as target or handler`

所以，对于基础类型的代理。我们需要一个新的方式，而在 `vue3` 中，对于基础类型的新 api 是 `ref`

```js
<button >{{count}}</button>

export default {
  setup() {
    const count = ref(0);
    return { count };
  }
}
```

那为什么这个 ref 章节会在
