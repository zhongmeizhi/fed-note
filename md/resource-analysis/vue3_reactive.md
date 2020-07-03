
### vue3 reactive

正式进入正题。

作为 `vue2` 的使用者最想知道的肯定是 `vue3` 的数据劫持和双向绑定了。在 vue3中，双向绑定和可选项，如果需要使用双向绑定的需要通过 `reactive` 方法进行数据劫持。

在这之前呢还需要知道一个函数 `setup`

* `setup` 是使用 `Composition API` 的入口
* `setup` 可以返回一个对象，该对象的属性会被合并到渲染上下文，并可以在模板中直接使用
* `setup` 也可以返回 `render` 函数

现在开始写一个简单的 `vue`

```vue
  <template>
    <div>
      <div>{{ count }}</div>
      <button @click="increment">count++</button>
    </div>
  </template>

  <script>
    import { reactive } from 'vue'

    export default {
      setup() {
        let count = reactive({
          num: 0
        })

        const increment = () => count.num++

        return {
          count,
          increment
        }
      }
    }
  </script>
```

emmm。这样点击按钮就可以动态改变 dom 中的 count 值了。

现在开始解读 `reactive` 源码。

首先找到 `reactivity.esm-browser.js` 文件，找到 `626` 行。

```js
function reactive(target) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (target && target.__v_isReadonly) {
      return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
}
```

上面的 `__v_isReadonly` 其实是一个 typescript 的枚举值

```js
export const enum ReactiveFlags {
  skip = '__v_skip',
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly',
  raw = '__v_raw',
  reactive = '__v_reactive',
  readonly = '__v_readonly'
}
```

不同的枚举值对应了不同的数据劫持方式，例如 `reactive、 shallowReactive 、readonly、 shallowReadonly`


然后进入 `createReactiveObject` 在 `649` 行，意思就是：**创建响应式对象**

```js
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {

    // 略...
    
    // 如果target已经代理了, 返回target
    if (target.__v_raw && !(isReadonly && target.__v_isReactive)) {
        return target;
    }
    // target already has corresponding Proxy
    if (hasOwn(target, isReadonly ? "__v_readonly" /* readonly */ : "__v_reactive" /* reactive */)) {
        return isReadonly ? target.__v_readonly : target.__v_reactive;
    }
    
    if (!canObserve(target)) {
        return target;
    }

    // 重点...
    // collectionHandlers：对引用类型的劫持, 
    // baseHandlers: 对进行基本类型的劫持
    const observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
    def(target, isReadonly ? "__v_readonly" /* readonly */ : "__v_reactive" /* reactive */, observed);
    return observed;
}
```

`createReactiveObject` 做了以下几件事

1. 防止重复劫持
2. 只读劫持
3. 根据不同类型选择不同的劫持方式（`collectionHandlers` 或 `baseHandlers`）

实现劫持的主要方法是通过 `Proxy` 方法，（Proxy 使用可以看看阮老师的博客），顺腾摸瓜找到 `mutableHandlers` 定义的地方。在 `338` 行

```js
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};

// 229行
const get = /*#__PURE__*/ createGetter();

// 251 行
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {

        // 一些 __v_isReactive、__v_isReadonly、__v_raw的处理
        // 略...

        // 数组操作
        const targetIsArray = isArray(target);
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        // 非数组
        const res = Reflect.get(target, key, receiver);
        
        // 其他 调用 track 返回 res 的情况
        // 略...
        
        // 如果可写，那么会调用 track
        !isReadonly && track(target, "get" /* GET */, key);

        // 如果是对象呢。那么递归
        return isObject(res)
            ? isReadonly
                ? // need to lazy access readonly and reactive here to avoid
                    // circular dependency
                    readonly(res)
                : reactive(res)
            : res;
    };
}
```

`mutableHandlers` 主要是一个含有 `Proxy` 各种方法的常量。

get 指向了方法 `createGetter`, **创建 get 劫持**

`createGetter` 主要做了以下事情

1. 异常处理
2. 如果是数组且`hasOwn(arrayInstrumentations, key)` 则调用 `arrayInstrumentations` 获取值
3. 调用 `track`
4. 对象迭代 `reactive`

那么数组的 `arrayInstrumentations` 是什么呢？ 我们来到源码的 第 `234` 行。

```js
const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    arrayInstrumentations[key] = function (...args) {
        // 
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get" /* GET */, i + '');
        }
        // we run the method using the original args first (which may be reactive)
        // 我们首先 以原始args 运行该方法（可能是反应性的）
        const res = arr[key](...args);
        if (res === -1 || res === false) {
            // if that didn't work, run it again using raw values.
            // 如果那不起作用，则使用原始值再次运行它。
            return arr[key](...args.map(toRaw));
        }
        else {
            return res;
        }
    };
});
```

通过 `arrayInstrumentations` 得到 `hasOwn(arrayInstrumentations, key)` 就是指 `['includes', 'indexOf', 'lastIndexOf']`

`arrayInstrumentations` 中还是调用了 `track` 方法，那么 `track` 方法就更加神秘了。来看看它的源码吧？ 源码在 `126` 行

```js
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if ( activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            });
        }
    }
}
```

首先 `track` 需要 `shouldTrack` 和 `activeEffect` 为真。

在不考虑 `activeEffect` 的情况下。`track` 所做的事情就是

1. 创建包含自身的 `map`
2. 将 `activeEffect` 塞到 `map` 中
3. 触发 `onTrack`


然后 `activeEffect` 又是什么呢？找到 `3687` 行，这里有个 `createReactiveEffect` 函数。

```js
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect(...args) {
        return run(effect, fn, args);
    };
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
```

`createReactiveEffect` 是在 `effect` 中被调用的

而 `effect` 分别在以下地方被使用了

*  `trigger` 通过 `scheduleRun` 调用 `effect`：源码 `3756` 行
*  `mountComponent` 通过 `setupRenderEffect` 调用 `effect`：源码 6235 行
   *  PS 该阶段在 `createComponentInstance` 之后
*  `doWatch` 通过 `scheduler` 调用 `effect`

先开始讲述 `trigget` 相关的代码（核心哦）

```js
function trigger(target, type, key, extraInfo) {
    const depsMap = targetMap.get(target);
    
    // 略...

    const effects = new Set();
    const computedRunners = new Set();
    if (type === "clear" /* CLEAR */) {
      // collection being cleared, trigger all effects for target
      depsMap.forEach(dep => {
        addRunners(effects, computedRunners, dep);
      });
    }

    // 略... 
    const run = (effect) => {
      scheduleRun(effect, target, type, key, extraInfo);
    };
    
    computedRunners.forEach(run);
    effects.forEach(run);
  }
```

`trigger` 最终是在 `set` 函数中被使用，源码 `3855` 行，这个 `set` 就是数据劫持所用的 `set`

```js
function set(target, key, value, receiver) {
    value = toRaw(value);
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
    }
    const hadKey = hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
        {
        const extraInfo = { oldValue, newValue: value };
        if (!hadKey) {
            trigger(target, "add" /* ADD */, key, extraInfo);
        }
        else if (hasChanged(value, oldValue)) {
            trigger(target, "set" /* SET */, key, extraInfo);
        }
        }
    }
    return result;
}
```

在源码 `3900` 行中，被 `mutableHandlers`、`readonlyHandlers` 等函数中被使用。

还记得吗？ `mutableHandlers` 是什么？ 可以回到文章开头部分 `reactive` 源码讲解之初的 `createReactiveObject` 方法。在通过 `Proxy` 劫持数据的时候用的就是 `mutableHandlers`

### reactive 总结

所以，这里就成环了。

1. 其实 `effect` 才是响应式的核心，在 `mountComponent`、`doWatch`、`reactive` 中被调用。
2. 在 `reactive` 中 通过 `Proxy` 实现劫持。
3. 在 `Proxy` 劫持`set`时调用 `trigger`。
4. 然后在 `targger` 中清除收集并触发目标的所有 `effects`
5. 最终触发 `patch` 游戏结束。