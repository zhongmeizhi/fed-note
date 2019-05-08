# Vuex源码实现

### Vuex的install实现
1. 通过`applyMixin(Vue)`在Vue的`beforeCreate`时注入
2. 为了回去同一份store，会尝试从`options.store`（root节点）和`options.parent.$store`获取store

### 双向绑定实现

```
  // 一
  // 通过 new Vue实现$$state的双向绑定
  store._vm = new Vue({
      data: {
        $$state: state
      },
      computed: computed
  });

  // 二
  // 当获取state时，返回以双向绑定的$$sate
  var prototypeAccessors$1 = { state: { configurable: true } };

  prototypeAccessors$1.state.get = function () {
    return this._vm._data.$$state
  };

  // 三
  // 将state定义在原型中
  Object.defineProperties( Store.prototype, prototypeAccessors$1 );
```

### 修改state

在严格模式中：会调用`store._vm.$watch(...)`，监听state的改动，如果`!_committing`则会抛出错误。

只能使用mutation更改state
```
_withCommit (fn) {
  const committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
}
```

### action

action是异步的，使用的是Promise。 - -没啥好说的。

### [返回主页](/README.md)