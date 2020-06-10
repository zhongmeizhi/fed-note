# Vue3 源码解析

vue3 出来有一段时间了。今天正式开始记录一下 `vue 3.0.0-beta` 源码学习心得。

> 本文编写于 `2020-06-10`，脚手架使用 `vite-app` 版本 `0.20.0`，内置 `vue 3.0.0-beta.14`。

ps: 可能大部分人都不清楚 `vue3` 的开发api，将源码之前先讲述 使用方法

### 环境搭建

最容易搭建 `vue3` 的方式就是使用作者的 [vite](https://github.com/vitejs/vite)

通过 `npm` 安装

```
  $ npm init vite-app <project-name>
  $ cd <project-name>
  $ npm install
  $ npm run dev
```

也可以通过 `yarn` 安装

```
  $ yarn create vite-app <project-name>
  $ cd <project-name>
  $ yarn
  $ yarn dev
```

安装的过程中你可能遇到以下问题（反正本菜遇到了） 

* 异常1：`No valid exports main found for' C:\xxx\xxx\node_ modules\@rollup\pluginutils'`
* 异常2：`The engine "node" is incompatible with this module. Expected version ">= 10.16.0". Got "10.15.3`

异常1：本菜翻阅了 `vite` 的 issue，然后 google + baidu 一无所获， 最后发现是因为本菜 `node` 版本为 `13.5.0`导致的（版本过高），

异常2：很明显啦，`node` 版本太低了。

最后的解决方式是：本菜通过 `nvm` 将 node 版本切换到 `12.12.0`，至于 `nvm` 没使用过的童鞋们可以去尝试下哦。特别好用


### reactive

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

```js
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    const effects = new Set();
    const computedRunners = new Set();
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect || !shouldTrack) {
                    if (effect.options.computed) {
                        computedRunners.add(effect);
                    }
                    else {
                        effects.add(effect);
                    }
                }
            });
        }
    };
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        const isAddOrDelete = type === "add" /* ADD */ ||
            (type === "delete" /* DELETE */ && !isArray(target));
        if (isAddOrDelete ||
            (type === "set" /* SET */ && target instanceof Map)) {
            add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY));
        }
        if (isAddOrDelete && target instanceof Map) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY));
        }
    }
    const run = (effect) => {
        if ( effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    // Important: computed effects must be run first so that computed getters
    // can be invalidated before any normal effects that depend on them are run.
    computedRunners.forEach(run);
    effects.forEach(run);
}
```