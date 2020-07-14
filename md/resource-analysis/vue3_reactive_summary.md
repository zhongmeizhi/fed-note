# vue3 响应式小结

回顾下前几章的内容，在前几章中主要讲述了以下内容。

1. 新构建工具 `vite` 的原理和从零开始实现
2. 新api：`reactive` 使用和源码解析
3. 追踪收集 `track` 实现和源码解析
4. 追踪触发器 `trigger` 实现和源码解析
5. 响应式核心 `effect` 与 `track、trigger` 工作原理和源码解析


还记得那些API都怎么使用吗？还记得上面每个点的源码都干了啥吗？有没有感觉有点小遗忘？这章我们就来把以前学过的东西做个总结，顺便造个轮子吧？

好的，这章的目标：从零开始完成一个 Vue3 ！

## 手摸手实现 Vue3

首先。我们2个全局变量，用来存放和定位追踪的依赖。优秀的代码呼之欲出。

```js
let targetMap = new WeakMap();
let activeEffect;
```

然后优秀的打工仔一号出来了，那就是 `effect`，还记得该打工仔的api在vue3中是如何调用的吗？

```js
effect(() => {
  console.log('run cb')
})
```

该打工仔接收一个回调函数，然后会被送给 `track`干苦力。所以我们可以这么完成 `effect`

1. 定义一个内部函数 `_effect`，并执行。
2. 返回一个闭包

而内部 `_effect` 也做了两件事

1. 将自身赋值给 `activeEffect`
2. 执行 `effect` 回调函数

优秀的代码呼之欲出。

```js
function effect(fn) {
  // 定义一个内部 _effect 
  const _effect = function(...args) {
    // 在执行是将自身赋值给 activeEffect
    activeEffect = _effect;
    // 执行回调
    return fn(...args);
  };
  _effect();
  // 返回闭包
  return _effect;
}
```

然后出现的是另一个优秀的打工仔 `track`，还记得该`track`在vue3是如何调用的吗？

```js
track(obj, 'get', 'x');
```

该打工仔会去找 `obj.x` 是否被追踪，如果没找到就将obj.x放入`targetMap`（完成追踪任务），然后让当前最优秀的打工仔 `activeEffect` 制定工期（将obj.x作为map的key将activeEffect作为map的value）。

优秀的代码呼之欲出。

```js
function track(target, key) {
  // 首先找 obj 是否有被追踪
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // 如果没有被追踪，那么添加一个
		targetMap.set(target, (depsMap = new Map()));
  }
  // 然后寻找 obj.x 是否被追踪
  let dep = depsMap.get(key);
	if (!dep) {
    // 如果没有被追踪，那么添加一个
    depsMap.set(key, (dep = new Set()));
  }
  // 如果没有添加 activeEffect 那么添加一个
  if (!dep.has(activeEffect)) {
		dep.add(activeEffect);
	}
}
```

然后出现的是最后一个优秀的打工仔 `trigger`，还记得`trigger`在vue是如何调用的吗？

```js
trigger(obj, 'set', 'x')
```

其实该打工仔只会去 `targetMap` 中寻找`obj.x`的追踪任务，如果找到了就去重，然后执行任务。

优秀的代码呼之欲出。

```js
function trigger(target, key) {
  // 寻找追踪项
  const depsMap = targetMap.get(target);
  // 没找到就什么都不干
  if (!depsMap) return;
  // 去重
  const effects = new Set()
  depsMap.get(key).forEach(e => effects.add(e))
  // 执行
  effects.forEach(e => e())
}
```

打工仔都就绪了。然后出现了优秀的包工头 `reactive`，也就是对象式响应式的api。还记得vue3中如何使用 `reactive` 吗？

```html
<template>
  <button @click="appendName">{{author.name}}</button>
</template>

setup() {
  const author = reactive({
    name: 'mokou',
  })

  const appendName = () => author.name += '优秀';

  return { author, appendName };
}
```

通过上面的的优秀代码，很轻易的实现了vue3的响应式操作。通过回顾前几章的内容，我们知道 `reactive` 是通过 Proxy 代理数据实现的，而优秀的包工头只需要看看工地，然后让优秀的打工仔干活就可以了。

优秀的代码呼之欲出。

```js
export function reactive(target) {
  // 代理数据
  return new Proxy(target, {
    get(target, prop) {
      // 执行追踪
      track(target, prop);
      return Reflect.get(target, prop);
    },
    set(target, prop, newVal) {
      Reflect.set(target, prop, newVal);
      // 触发effect
      trigger(target, prop);
      return true;
    }
  })
}
```

好了。一切就绪，那么我们挂载下我们的 `fake vue3` 吧

```js
export function mount(instance, el) {
  effect(function() {
    instance.$data && update(el, instance);
  })
  instance.$data = instance.setup();
  update(el, instance);
}

function update(el, instance) {
  el.innerHTML = instance.render()
}
```

测试一下。参照 vue3 的写法。定义个 `setup` 和 `render`。

```js
const App = {
  $data: null,
  setup () {
    let count = reactive({ num: 0 })

    setInterval(() => {
      count.num += 1;
    }, 1000);

    return {
      count
    };
  },
  render() {
    return `<button>${this.$data.count.num}</button>`
  }
}

mount(App, document.body)
```

执行一下，果然是优秀的代码。响应式正常执行，每次 `setInterval` 执行后，页面都重写刷新了 `count.num` 的数据。

以上通过 `50+`行代码，轻轻松松的实现了 `vue3`的响应式。但这就结束了吗？

还有以下问题

1. `Proxy` 一定需要传入对象
2. `render` 函数 和 `h` 函数并正确（Vue3的h函数现在是2个不是以前的`createElement`了）
3. 虚拟 dom 的递归
4. 别再说了`- -!`，我不听。

## 后续完善

首先
  