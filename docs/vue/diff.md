# diff算法

> patch的核心是diff算法

diff算法是通过`同层的树节点比较`而非对树进行逐层搜索遍历，时间复杂度为O(n)

diff算法主要为2种：
1. 值得比较(sameVnode)
2. 不值得比较

什么是sameVnode ? 源码如下：
```
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}
```
判断两个VNode节点是否是同一个节点，需要满足以下条件
* key相同
* tag（当前节点的标签名）相同
* isComment（是否为注释节点）相同
* 是否data
* 当标签是`<input>`的时候，type必须相同


如果不值得比较，那么会移除旧的DOM，创建新的DOM

如果值得比较：
* 判断是否新老节点只有文本  -> 替换文本
* 新节点有子节点，老节点没有子节点  -> 清空老节点文本，为当前节点添加子节点
* 新节点没有子节点，老节点有子节点  -> 清空老节点的子节点
* 新老节点都有子节点：调用updateChildren方法

`updateChildren`方法源码如下：（遍历过程中这几个变量都向中间靠拢）
```
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if...
    ++oldStartIdx
    ++newStartIdx
  if...
    --oldEndIdx
    --newEndIdx
}
```
Vue会逐级递归对children件进行diff，单每个组件的diff是独立的


