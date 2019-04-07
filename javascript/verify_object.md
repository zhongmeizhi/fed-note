# 检测对象类型

### instanceof

`instanceof` 用来检测对象的类型，内部机制是通过判断对象的原型链中是不是能找到对应的的 prototype

```
  // 实现 instanceof

  function instanceof(obj, target) {
      // 获得对象的原型
      obj = obj.__proto__
      // 判断对象的类型是否等于类型的原型
      while (true) {
        // 如果__proto__ === null 说明原型链遍历完毕
        if (obj === null) {
          return false
        }
        // 如果存在 obj.__proto__ === target.prototype
        // 说明对象是该类型的实例
        if (obj === target.prototype) {
          return true
        }
        // 原型链上查找
        obj = obj.__proto__
      }
  }
```