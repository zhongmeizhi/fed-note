# 各种手写代码实现

### 实现浅拷贝

如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。针对引用类型我们需要实现数据的拷贝。

1. 用 `...` 实现

```js
const copy = {...{x:1}}
```

2. 用 `Object.assign` 实现

```js
const copy = Object.assign({}, {x:1})
```

3. 用 `slice` 实现

```js
let arr = [1, 3, {
  x: 1
}];

let copy = arr.slice();
```

### 深拷贝

通常浅拷贝就能解决大部分问题，但是只解决了第一层的问题，如果接下去的值中还有对象的话，那么我们需要使用深拷贝。

1. 通过 JSON 转换实现

缺点：
* 对于 function、undefined，会丢失这些属性。
* 对于 RegExp、Error 对象，只会得到空对象
* 对于 date 对象，得到的结果是 string，而不是 date 对象
* 对于 NaN、Infinity、-Infinity，会变成 null
* 无法处理循环引用

```js
const obj = {a: 1, b: {x: 3}}
const copy = JSON.parse(JSON.stringify(obj))
```

2. 乞丐式递归

乞丐版的递归，针对常用的JS类型（基础类型、数组、对象），虽然解决了大部分`JSON.parse(JSON.stringify(oldObj))`的问题，但依然无法解决循环引用的问题。

```js
function deepClone(obj) {
  let copy = obj instanceof Array ? [] : {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      copy[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
    }
  }
  return copy
}
```

3. 改良版深拷贝

参考vuex的deepCopy源码，解决循环引用

```js
function deepCopy (obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ?  [] :   {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}
```

当然： cache 可以使用 `new WeakMap()` 代替

4. 深拷贝再优化

* 深拷贝添加 `Map` 和 `Set` 相关，当然你可以再添加 `Date` 之类的补充
* 使用 `WeakMap` 代替 `[]`

```js
function clone(target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target;
  }

  // 初始化
  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type);
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);

  // 克隆set
  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(clone(value,map));
    });
    return cloneTarget;
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value,map));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target);
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value;
    }
    cloneTarget[key] = clone(target[key], map);
  });

  return cloneTarget;
}
```

5. 各种兼容版本的深拷贝

兼容对象、数组、Symbol、正则、Error、Date、基础类型。

```js
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function forEach(array, iteratee) {
  let index = -1;
  const length = array.length;
  while (++index < length) {
    iteratee(array[index], index);
  }
  return array;
}

function isObject(target) {
  const type = typeof target;
  return target !== null && (type === 'object' || type === 'function');
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

function getInit(target) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}

function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();

  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      if (param) {
        const paramArr = param[0].split(',');
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

function cloneOtherType(targe, type) {
  const Ctor = targe.constructor;
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe);
    case regexpTag:
      return cloneReg(targe);
    case symbolTag:
      return cloneSymbol(targe);
    case funcTag:
      return cloneFunction(targe);
    default:
      return null;
  }
}

function clone(target, map = new WeakMap()) {

  // 克隆原始类型
  if (!isObject(target)) {
    return target;
  }

  // 初始化
  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type);
  } else {
    return cloneOtherType(target, type);
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);

  // 克隆set
  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(clone(value, map));
    });
    return cloneTarget;
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target);
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value;
    }
    cloneTarget[key] = clone(target[key], map);
  });

  return cloneTarget;
}
```

### 实现一个 bind 函数

通过闭包调用 call || apply 可以实现 bind 函数。

1. 乞丐版

```js
Function.prototype.myapply = function (context, ...preArgs) {
    return (...args) => this.call(context, ...preArgs, ...args)
}
```

2. 进阶版，做一些异常处理

```js
Function.prototype.mybind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let _this = this
  let arg = [...arguments].slice(1)
  return function F() {
    // 处理函数使用new的情况
    if (this instanceof F) {
      return new _this(...arg, ...arguments)
    } else {
      return _this.apply(context, arg.concat(...arguments))
    }
  }
}
```

### 实现一个 apply 函数

实现 `bind` 需要调用 apply || call，那么如何实现？

思路：将要改变this指向的方法挂到目标this上执行并返回

```js
Function.prototype.myapply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('not funciton')
  }

  context = context || window
  context.fn = this
  let result

  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn

  return result
}
```

### 实现防抖函数

滚动事件、resize事件、input事件等： 需要做个复杂计算或者实现一个按钮的防二次点击操作。这些需求都可以通过函数防抖动来实现。

1. 乞丐版

缺点：这个防抖只能在最后调用。一般的防抖会有immediate选项，表示是否立即调用。

```js
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = 0
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
```

2. 改良版

```js
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

### 实现一个节流函数

节流的本质和防抖差不多。

1. 乞丐版

缺点：这个节流函数缺少首尾调用的开关

```js
/**
 * 函数节流方法
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @param Number atleast 至少多长时间触发一次
 * @return Function 延迟执行的方法
 */
var throttle = function (fn, delay, atleast) {
  var timer = null;
  var previous = null;

  return function () {
    var now = Date.now();

    if ( !previous ) previous = now;

    if ( now - previous > atleast ) {
      fn();
      // 重置上一次开始时间为本次结束时间
      previous = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn();
      }, delay);
    }
  }
};
```

2. 改良版：参考 `lodash` 经典的节流函数 

```js
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  function   func      回调函数
 * @param  number     wait      表示时间窗口的间隔
 * @param  object     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return function             返回客户调用函数
 */
const throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  // 之前的时间戳
  var previous = 0;
  // 如果 options 没传则设为空对象
  if (!options) options = {};

  // 定时器回调函数
  var later = function() {
    // 如果设置了 leading，就将 previous 设为 0
    // 用于下面函数的第一个 if 判断
    previous = options.leading === false ? 0 : Date.now();
    // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function() {
    // 获得当前时间戳
    var now = Date.now();
    // 首次进入前者肯定为 true
    // 如果需要第一次不执行函数
    // 就将上次时间戳设为当前的
    // 这样在接下来计算 remaining 的值时会大于0
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    // 如果当前调用已经大于上次调用时间 + wait
    // 或者用户手动调了时间
    // 如果设置了 trailing，只会进入这个条件
    // 如果没有设置 leading，那么第一次会进入这个条件
    // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
    // 其实还是会进入的，因为定时器的延时
    // 并不是准确的时间，很可能你设置了2秒
    // 但是他需要2.2秒才触发，这时候就会进入这个条件
    if (remaining <= 0 || remaining > wait) {
      // 如果存在定时器就清理掉否则会调用二次回调
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // 判断是否设置了定时器和 trailing
    // 没有的话就开启一个定时器
      // 并且不能不能同时设置 leading 和 trailing
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
```

### 柯里化函数的实现

柯里化：
* 把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数
* 并且返回接受余下的参数且返回结果的新函数

实现柯里化

1. 固定传入参数，参数够了才执行

```js
/**
 * 实现要点：柯里化函数接收到足够参数后，就会执行原函数，那么我们如何去确定何时达到足够的参数呢？
 * 柯里化函数需要记住你已经给过他的参数，如果没给的话，则默认为一个空数组。
 * 接下来每次调用的时候，需要检查参数是否给够，如果够了，则执行fn，没有的话则返回一个新的 curry 函数，将现有的参数塞给他。
 * 
 */
// 待柯里化处理的函数
let sum = (a, b, c, d) => {
  return a + b + c + d
}

// 柯里化函数，返回一个被处理过的函数 
// 柯里化函数，返回一个被处理过的函数 
let curry = (fn, ...arr) => { // arr 记录已有参数
  var len = fn.length; //计算期望函数的参数长度
  return (...args) => { // args 接收新参数
    const combArg = [...arr, ...args];
    if (len <= combArg.length) { // 参数够时，触发执行
      return fn(...combArg)
    } else { // 继续添加参数
      return curry(fn, ...combArg)
    }
  }
}

var sumPlus = curry(sum)
sumPlus(1)(2)(3)(4)
sumPlus(1, 2)(3)(4)
sumPlus(1, 2, 3)(4)
```

2. 不固定传入参数，随时执行

```js
/**
 * 当然了，柯里化函数的主要作用还是延迟执行，执行的触发条件不一定是参数个数相等，也可以是其他的条件。
 * 例如参数个为0的情况，那么我们需要对上面curry函数稍微做修改
 */
// 待柯里化处理的函数
let sum = arr => {
  return arr.reduce((a, b) => {
    return a + b
  })
}

let curry = (fn, ...arr) => {  // arr 记录已有参数
  return (...args) => {  // args 接收新参数
    if (args.length === 0) {  // 参数为空时，触发执行
      return fn(...arr, ...args)
    } else {  // 继续添加参数
      return curry(fn, ...arr, ...args)
    }
  }
}

var sumPlus = curry(sum)
sumPlus(1)(2)(3)(4)()
sumPlus(1, 2)(3)(4)()
sumPlus(1, 2, 3)(4)()
```

### 数组扁平化

```js
const flattenDeep = (arr) => Array.isArray(arr)
  ? arr.reduce( (a, b) => [...a, ...flattenDeep(b)] , [])
  : [arr]

flattenDeep([1, [[2], [3, [4]], 5]])
```

### 实现一个new操作符

new操作符做了这些事：
1. 创建了一个全新的对象。
2. 被执行[[Prototype]]（也就是__proto__）链接。
3. 使this指向新创建的对象。。
4. 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
5. 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。

```js
function New(func) {
  var res = {};
  if (func.prototype !== null) {
    res.__proto__ = func.prototype;
  }
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
  if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
    return ret;
  }
  return res;
}

var obj = New(A, 1, 2);
```

### 实现一个 instanceOf

`instanceOf` 的内部机制是通过判断对象的原型链中是不是能找到该类型的 `prototype`

```js
function instanceOf(left,right) {
  let proto = left.__proto__;
  let prototype = right.prototype
  while(true) {
    if(proto === null) return false
    if(proto === prototype) return true
    proto = proto.__proto__;
  }
}
```

### Promise 实现

Promise 有3个状态 `pending`、 `resolve` 和 `reject`。因为状态的的确定，所以Promise的结果是可靠的。

Promise 还能解决回调地狱的问题。

1. 乞丐版

实现了 `Promise` 的主要功能，缺少异步处理等其他情况

```js
class Promise {
  constructor (fn) {
    // 三个状态
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined

    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
      }
    }
    let reject = value => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = value
      }
    }
    // 自动执行函数
    try {
      fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  // then
  then(onFulfilled, onRejected) {
    switch (this.state) {
      case 'fulfilled':
        onFulfilled(this.value)
        break
      case 'rejected':
        onRejected(this.value)
        break
      default:
    }
  }
}
```

2. 改良版：yck 小册里面实现的了Promise的主要功能（没有catch、finally、静态调用等）

```js
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED;
        _this.value = reason;
        _this.rejectedCallbacks.forEach(cb => cb());
      }
    })
  }
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r};

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};

// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === "function") {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}
```

3. 补充版

```js
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => {
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => {
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED;
        _this.value = reason;
        _this.rejectedCallbacks.forEach(cb => cb());
      }
    })
  }
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var promise2;
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r};

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};

// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  let called = false;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// catch方法
MyPromise.prototype.catch = function (rejectFn) {
  return this.then(undefined, rejectFn)
}

//finally方法
MyPromise.prototype.finally = function (callback) {
  return this.then(
    value => MyPromise.resolve(callback()).then(() => value),
    reason => MyPromise.resolve(callback()).then(() => { throw reason })
  )
}

/* 
  静态方法添加
 */

// resolve方法
MyPromise.resolve = function(val){
  return new MyPromise((resolve,reject)=>{
    resolve(val)
  });
}

//reject方法
MyPromise.reject = function(val){
  return new MyPromise((resolve,reject)=>{
    reject(val)
  });
}

//race方法 
MyPromise.race = function(promises){
  return new MyPromise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(resolve, reject)
    };
  })
}

//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
MyPromise.all = function(promises){
  let arr = [];
  let i = 0;

  function processData(index,data){
    arr[index] = data;
    i++;
    if(i == promises.length){
      resolve(arr);
    };
  };

  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(data=>{
        processData(i,data);
      },reject);
    };
  });
}
```

### 实现 EventBus 

1. 乞丐版

实现了主要功能，但不处理异常场景，也不实现 `remove`

```js
class EventEmitter {
  constructor () {
    // 存储事件
    this.events = this.events || new Map()
  }

  // 监听事件
  addListener (type, fn) {
    if (!this.events.get(type)) {
      this.events.set(type, fn)
    }
  }

  // 触发事件
  emit (type) {
    let handle = this.events.get(type)
    handle.apply(this, [...arguments].slice(1))
  }
}
```

2. 进阶版

```js
class EventEmitter{
  constructor(){
    if(this._events === undefined){
      this._events = Object.create(null);//定义事件对象
      this._eventsCount = 0;
    }
  }

  emit(type,...args){
    const events=this._events;
    const handler=events[type];
    //判断相应type的执行函数是否为一个函数还是一个数组
    if(typeof handler==='function'){
      Reflect.apply(handler,this,args);
    }else{
      const len=handler.length;
      for(var i=0;li<len;i++){
        Reflect.apply(handler[i],this,args);
      }
    }
    return true;
  }

  on(type,listener,prepend){
    var m;
    var events;
    var existing;
    events=this._events;
    //添加事件的
    if(events.newListener!==undefined){
       this.emit('namelessListener',type,listener);
       events=target._events;
    }
    existing=events[type];
    //判断相应的type的方法是否存在
    if(existing===undefined){
      //如果相应的type的方法不存在，这新增一个相应type的事件
      existing=events[type]=listener;
      ++this._eventsCount;
    }else{
      //如果存在相应的type的方法,判断相应的type的方法是一个数组还是仅仅只是一个方法
      //如果仅仅是
      if(typeof existing==='function'){
        //如果仅仅是一个方法，则添加
        existing=events[type]=prepend?[listener,existing]:[existing,listener];
      }else if(prepend){
        existing.unshift(listener);
      }else{
        existing.push(listener);
      }
    }
    //链式调用
    return this;
  }

  removeListener(type,listener){
    var list,events,position,i,originalListener;
    events=this._events;
    list=events[type];
    //如果相应的事件对象的属性值是一个函数，也就是说事件只被一个函数监听
    if(list===listener){
      if(--this._eventsCount===0){
        this._events=Object.create(null);
      }else{
        delete events[type];
        //如果存在对移除事件removeListener的监听函数，则触发removeListener
        if(events.removeListener)
          this.emit('removeListener',type,listener);
      }
    }else if(typeof list!=='function'){
      //如果相应的事件对象属性值是一个函数数组
      //遍历这个数组，找出listener对应的那个函数，在数组中的位置
      for(i=list.length-1;i>=0;i--){
        if(list[i]===listener){
          position=i;
          break;
        }
      }
      //没有找到这个函数，则返回不做任何改动的对象
      if(position){
        return this;
      }
      //如果数组的第一个函数才是所需要删除的对应listener函数，则直接移除
      if(position===0){
        list.shift();
      }else{
        list.splice(position,1);
      }
      if(list.length===1)
        events[type]=list[0];
      if(events.removeListener!==undefined)
        this.emit('removeListener',type,listener);
    }
    return this;
  }
}
```
