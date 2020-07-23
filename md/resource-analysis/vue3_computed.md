# vue3 computed

前面几章已经把从 vite 到 reactive，然后再到手写一个响应式的 vue3。现在开始对上一章完成的 vue3 进行补充。

### ref

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

实现 ref 其实非常简单：利用 js 对象自带的 getter 就可以实现

举个栗子：

```js
let v = 0;
let ref = {
    get value() {
        console.log('get')
        return v;
    },
    set value(val) {
        console.log('set', val)
        v= val;
    }
}

ref.value; // 打印 get
ref.value = 3; // 打印 set
```

那么通过前面几章实现的 `track` 和 `trigger` 可以轻松实现 `ref`

直接上完成的代码

```js
function ref(target) {
  let value = target

  const obj = {
    get value() {
      track(obj, 'value');
      return value;
    },
    set value(newVal) {
      if (newVal !== value) {
        value = newVal;
        trigger(obj, 'value');
      }
    }
  }

  return obj;
}
```

### computed

那么该怎么实现 `computed`？

首先：参考 `vue3` 的 `computed` 使用方式

```js
let sum = computed(() => {
  return count.num + num.value + '!'
})
```

盲猜可以得到一个想法，通过改造下 `effect` 可以实现，即在 `effect` 调用的那一刻不执行 `run` 方法。所以我们可以加一个 `lazy` 参数。

```js
function effect(fn, options = {}) {
  const _effect = function(...args) {
    activeEffect = _effect;
    return fn(...args);
  };

  // 添加这段代码
  if (!options.lazy) {
    _effect();
  }

  return _effect;
}
```

那么 `computed` 可以这么写

1. 内部执行 `effect(fn, {lazy: true})` 保证 `computed` 执行的时候不触发回调。
2. 通过对象的 `getter` 属性，在 `computed` 被使用的时候执行回调。
3. 通过 `dirty` 防止出现内存溢出。

优秀的代码呼之欲出：

```js
function computed(fn) {
  let dirty = true;
  let value;
  let _computed;

  const runner = effect(fn, {
    lazy: true
  });
  
  _computed = {
    get value() {
      if (dirty) {
        value = runner();
        dirty = false;
      }
      return value;
    }
  }
  return _computed;
}
```

那么问题来了 `dirty` 在第一次执行后就被设置为 `false` 如何重置？

此时 `vue3` 的解决方法是，给 `effect` 添加一个 `scheduler` 用来处理副作用。

```js
function effect(fn, options = {}) {
  const _effect = function(...args) {
    activeEffect = _effect;
    return fn(...args);
  };
  if (!options.lazy) {
    _effect();
  }

  // 添加这行
  _effect.options = options;

  return _effect;
}
```

既然有了 `scheduler` 那就需要更改 `trigger` 来处理新的 `scheduler`。

```js
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set()
  depsMap.get(key).forEach(e => effects.add(e))

  // 更改这一行
  effects.forEach(e => scheduleRun(e))
}

// 添加一个方法
function scheduleRun(effect) {
  if (effect.options.scheduler !== void 0) {
    effect.options.scheduler(effect);
  } else {
    effect();
  }
}
```

然后，把上面代码合并一下，`computed` 就完成了

```js
function computed(fn) {
  let dirty = true;
  let value;
  let _computed;

  const runner = effect(fn, {
    lazy: true,
    scheduler: (e) => {
      if (!dirty) {
        dirty = true;
        trigger(_computed, 'value');
      }
    }
  });
  
  _computed = {
    get value() {
      if (dirty) {
        value = runner();
        dirty = false;
      }
      track(_computed, 'value');
      return value;
    }
  }
  return _computed;
}
```

### 总结

源码请看 [uuz](https://github.com/zhongmeizhi/uuz)

1. ref 是通过对象自有的 `getter` 和 `setter` 配合 `track` + `trigger` 实现的
2. computed 其实是一个在 `effect` 基础上的改进

下章内容：`vue3` 该怎么结合 `jsx`？
