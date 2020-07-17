# effect

> 其实 effect 才是 vue3 响应式的核心

先回顾下上一篇关于`vite`的原理解析和`reactive`的文章（文章发布在公众号：`前端进阶课`）：

1. 响应式的核心是 `effect`，其会在 `mountComponent`、`doWatch`、`reactive`、`computed` 时被调用。
2. 在调用 `effect` 时会触发 `track` 开启响应式追踪，将追踪数据放入 `targetMap`
3. 执行 `reactive` 时，通过 `Proxy` 类劫持对象
   1. 劫持 `getter` 执行 `track`
   2. 劫持 `setter` 执行 `trigger`
4. 劫持的对象放在一个叫 `targetMap` 的 `WeakMap` 中
   1. `targetMap` 的结构大概是这样的 `targetMap<WeakMap> -> target<Map> -> key<Set>`
   2. `key<Set>` 会存放 `activeEffect` 也就是当前的 `effect`
   3. 同时 `key<Set>` 也会塞入至 `effect.deps`

ps：这一章虽然主要是 `effect` 相关，但是不会牵扯 `setupRenderEffect`，其他内容请看下一章

以一个小栗子来测试上面的内容回顾 [demo链接](https://github.com/zhongmeizhi/fed-note/tree/master/vue3-example)

```js
import { reactive, effect } from '../vue3.js'

/* 
  场景 1
*/
const obj = reactive({ x: 1 })

effect(() => {
  patch()
})

setTimeout(() => {
  obj.x = 2
}, 1000)

function patch() {
  document.body.innerText = obj.x
}
```

上面的栗子在一秒后会将浏览器内容从 `1` 替换为 `2`，哦，这就是传说中的 mvvm 吗？ 这验证了再 `reactive` 劫持 `setter` 方法的时候触发的 `trigger` 会执行 `effect`

想不想看看 `targetMap`？想不想知道如果不用 `reactive` 能不能实现响应式？ 再举一个小李子，[demo链接](https://github.com/zhongmeizhi/fed-note/tree/master/vue3-example)

```js
import { effect, track, trigger, targetMap } from '../vue3.js'
/* 
  场景 2
*/
var obj = {
  x: 1
}

var obj2 = {
  y: 1
}

effect(() => {
  patch();
  track(obj, 'get', 'x');
  track(obj2, 'get', 'y');
  console.log(targetMap, 'targetMap')
})

setTimeout(() => {
  obj.x = 2;
  trigger(obj, 'set', 'x')
}, 1000)

function patch() {
  document.body.innerText = obj.x
}
```

上栗的结果和 `reactive` 案例的结果是一样的，浏览器的内容将会在一秒后替换为 `2`，不过... 你如果是正常搭建的 `vue3` 项目，`vue3` 可不会暴露 `effect, track, trigger, targetMap` 这些哦。


### 源码逐行解析

现在来到重头戏：`vue3` -> `effect` 源码解析！真逐行解析哦。

```js
const EMPTY_OBJ = Object.freeze({})

var targetMap = new WeakMap();
var effectStack = [];
let shouldTrack = true;
var activeEffect;

/* 
  标记是否被 effect 过
*/
function isEffect(fn) {
	return fn != null && fn._isEffect === true;
}
```

首先是一些小方法和全局变量，这里是定义了 `var targetMap = new WeakMap();`

开始进入正式场合：`effect` 方法，该方法会在 `watch、trigger、computed、mountComponent` 中被调用。

```js
/* 
	在 watch、trigger、computed、mountComponent 中被调用
*/
function effect(fn, options = EMPTY_OBJ) {
	console.log('effect')
	if (isEffect(fn)) { // 第一次不会走这段代码
		/* 
			当第二次走这个代码的时候
			fn 其实就是
		*/
		fn = fn.raw;
	}
	/* 
		对于基础不好的童鞋，可能不太理解这个语法
		其实函数内部effect属于私有变量
		内部effect并不会改变外部effect的实际属性
		- -。只是内部定义一个和函数名称一样的变量好奇怪啊
	*/
	/*
		举个栗子
		function effect () {
			const effect = 1;
		}
		effect();
		console.log(effect);

		// 执行的结果effect依然是一个函数
		ƒ effect () {
			const effect = 1;
		}
	*/
	const effect = createReactiveEffect(fn, options);
	if (!options.lazy) {
		/* 
			其实 computed 就是一个 lazy effect
			当遇到 lazy 的时候就不执行 effect()
		*/

		/* 
			因为 effect = createReactiveEffect(fn, options);
			所以执行 effect() 其实就是执行 run(effect, fn, args);
		*/
		effect();
	}
	return effect;
}
```

上面的`effect`源码内部的变量有点...居然和函数名一个名称。对于基础不好的童鞋，可能不太理解这个语法，其实函数内部 effect 属于私有变量，并不会改变外部effect的实际属性- -。只是内部定义一个和函数名称一样的变量好奇怪啊

举个栗子
```js
function effect () {
  const effect = 1;
}
effect();
console.log(effect);

// 执行的结果effect依然是一个函数
ƒ effect () {
  const effect = 1;
}
```

这里面还会涉及到一个小东西 `options.lazy`，后面会讲述（这是关于 `computed`的），那这个内部的 `effect` 从哪来呢？ - -。它来自 `createReactiveEffect`，

执行 `createReactiveEffect` 后得到的是一个 function 即 reactiveEffect，

```js
/* 
	执行createReactiveEffect后得到的是一个 function 即 reactiveEffect

*/
function createReactiveEffect(fn, options) {
	console.log('createReactiveEffect')
	const effect = function reactiveEffect(...args) {
		/*
			此时：内部effect 是一个 function，
			执行内部effect后，会返回一个将自身作为参数后调用run函数的执行结果
		*/

		/* 
			参考栗子：
			let effect = function() {
				console.log(effect)
			}
			effect();

			执行结果为：
			ƒ () {
					console.log(effect)
			}
		*/
		return run(effect, fn, args);
	};

	/* 
		顺便给该 effect塞了一下值
		_isEffect: 是否有经历过 effect
		raw：effect 参数函数
		active: 如果是 !active 会在 run 中执行 return fn(...args);
		deps: 在 track 时收集 dep，
				dep 就是在追踪列表中对应的 key
						即 targetMap.get(target).get(key)
		options： 就是参数啦
	*/
	effect._isEffect = true;
	effect.active = true;
	effect.raw = fn;
	effect.deps = [];
	effect.options = options;
	return effect;
}
```

上面的源码又有一个小细节：`reactiveEffect`，执行后会返回一个将自身作为参数后调用 `run` 函数的执行结果，如何把自己作为参数？

```js
// 参考栗子：
let effect = function() {
  console.log(effect)
}
effect();

// 执行结果为：
// ƒ () {
//    console.log(effect)
// }
```

然后里面会调用 `run` 方法

```js
function run(effect, fn, args) {
	console.log('run')
	if (!effect.active) {
		/* 
			刚执行完 createReactiveEffect 时 active = true
		*/
		return fn(...args);
	}
	if (!effectStack.includes(effect)) {
		cleanup(effect);
		try {
			console.log('push effect')
			effectStack.push(effect);
			activeEffect = effect;
			/* 
				执行effect回调
			*/
			return fn(...args);
		} finally {
			console.log('effectStack pop')
			/* 
				即使在 try 中 return fn(...args); 
				依然会执行 finally
			*/

			/* 
				举个栗子：
				var x = function() {
					try {
						return 1111;
					} finally {
						console.log(2222222)
					}
				}

				y = x();

				此时依旧会打印 2222222，
				而且 y 此时 === 1111
			*/
			effectStack.pop();
			activeEffect = effectStack[effectStack.length - 1];
		}
	}
}

/* 
	将 effect.deps 清空
*/
function cleanup(effect) {
	const {
		deps
	} = effect;
	if (deps.length) {
		for (let i = 0; i < deps.length; i++) {
			deps[i].delete(effect);
		}
		deps.length = 0;
	}
}
```

run 源码就是执行在 effect 的时候用户塞入的回调函数。

上面的源码又有一个小细节，try 在 return 后到底会不会执行 finally ？

```js
// 举个栗子：
var x = function() {
  try {
    return 1111;
  } finally {
    console.log(2222222)
  }
}

y = x();

// 此时依旧会打印 2222222，
// 而且 y 此时 === 1111
```

然后到了最关键的函数：`track`，track 的目的是追踪响应，如何追踪？可以通过Map的键可以是对象的特性，将需要被追踪的对象作为键塞入到全局的 `targetMap` 中即可

```js

/* 
	追踪
	track（目标，类型，键值）
	使用方法 track(obj, 'get', 'x');

	在 computed、reactive（Proxy-> createGetter）、ref 中被调用
*/
function track(target, type, key) {
	if (!shouldTrack || activeEffect === undefined) {
		/* 
			如果在执行 effect 方法的时候 options 没有传入 lazy = true
			那一定会执行 run 方法。
			在经过run方法之后 activeEffect 会赋值给 reactiveEffect的effect变量
			如果没有被 effect 过，activeEffect 就会 === undefined

			而且 shouldTrack 默认为 true
		*/
		return;
	}
	let depsMap = targetMap.get(target);
	if (!depsMap) {
		/* 
			如果没有被追踪 - -。
			那么将 target（也就是需要被追踪的部门）set 到 targetMap 中
			而 target 在 targetMap 对应的值是 depsMap（初始化时是 new Map()）
		 */
		targetMap.set(target, (depsMap = new Map()));
	}
	/* 
		此时经过上面的判断，depsMap 必定有值了。
		然后尝试在 depsMap 中获取 key
	*/
	let dep = depsMap.get(key);
	if (!dep) {
		/* 
			如果没有获取到dep，说明 target.key 并没有被追踪
			此时就在 depsMap 中塞一个值
		*/

		/* 
			此时需要注意：
			当执行了 depsMap.set(key, (dep = new Set())); 后
			targetMap.get(target) 的值也会相应的改变
		*/
		depsMap.set(key, (dep = new Set()));
	}

	if (!dep.has(activeEffect)) {
		/* 
			这个 activeEffect 就是在 effect执行的时候的那个 activeEffect
		*/
		dep.add(activeEffect);
		activeEffect.deps.push(dep);

		/* 
			目前跑的源码还没到 onTrack
		*/
		if (activeEffect.options.onTrack) {
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

然后到了触发器，`trigger` 从 `targetMap` 中取值就可以了，然后执行已经对应的 `effect`。

其实这里隐藏和一个非常非常细节的东西。先看看源码吧

```js
/* 
	触发器

	在 reactive（Proxy -> createSetter）、ref、triggerRef、computed、updateProps 中被触发

	也在 deleteProperty、deleteEntry、add、clear、中处理 delete、add、等方法
*/
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		/* 
			如果没有经过 track，那么什么都触发不了
		*/
		return;
	}
	/* 
		这里effects也是内部变量
	*/
	const effects = new Set();

	/* 
		将 effectsToAdd 数组中的值 add 到 effects Set里面
	*/
	const add = (effectsToAdd) => {
		if (effectsToAdd) {
			effectsToAdd.forEach(effect => {
				if (effect !== activeEffect || !shouldTrack) {
					effects.add(effect);
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
			/* 
				因为 key === 'x'
				当执行 trigger(obj, 'set', 'x', 2) 时会进入这一段
				而 depsMap.get(key) 为 Set 类型
			 */
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
		if (effect.options.onTrigger) {
			/* 
				目前跑的源码还没到 onTrigger
			*/
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
			console.log('trigger effect')
			/* 
				当执行 trigger(obj, 'set', 'x', 2) 时会进入这一段
				实际上是遍历 targetMap.get(target)
				执行对应 key的run方法
			*/
			effect();
		}
	};

	/* 
		一定会将所有的 都执行内部 run 方法
	*/
	effects.forEach(run);
}
```

上面的 `trigger` 为什么会那么好使？虽然说 `track` 是把 `target` 塞入到了 `targetMap`，可如果始终执行一个方法是不可能做到数据更新的，除非又有一个全局变量。

那么 vue3 是如何实现的？？那就是将变量自己作为自己内部的参数传递 -> 不妨再看看上文的 `createReactiveEffect` 和上文的小栗子吧？ -

