# keep alive

Vue中Keep-alive是一个组件：
* 在create中创建cache对象
* 在destroyed时销毁cache

缓存的是Vnode的componentInstance（组件实例），而且在创建之初会`getFirstComponentChild(this.$slots.default)`
```
  if (this.cache[key]) {
      vnode.componentInstance = this.cache[key].componentInstance
  } else {
      this.cache[key] = vnode
  }
```

include 和 exclude 属性允许组件有条件地缓存
```
  // 允许使用字符串和正则

  function matches (pattern: string | RegExp, name: string): boolean {
    if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    return false
  }
```

并且会监视`include`和`exclude`，在被修改的时候对cache进行修正
```
  watch: {
    include (val: string | RegExp) {
        pruneCache(this.cache, this._vnode, name => matches(val, name))
    },
    exclude (val: string | RegExp) {
        pruneCache(this.cache, this._vnode, name => !matches(val, name))
    }
  },
```

keep-alive有2个新的生命周期`activated`和`deactivated`，在进入/退出时触发。

触发顺序：created-> mounted-> activated

### [返回主页](/README.md)
