# redux、mobx、rxjs取舍

> 答案来自 https://www.wengbi.com/thread_50430_1.html

这三个其实并不冲突，甚至可以放到一起用。

* redux for global state：作为全局状态管理
* rxjs for redux-middleware：rxjs 管理所有输入的 input -> redux action 的调度过程
* mobx for component-state：作为组件局部状态管理器来用。


1. 当你的项目数据复杂度很低，用 react 自带的 component-state 就可以
2. 当你的项目数据复杂度一般，lift state 到 root component，然后通过 props 传递来管理
3. 当你的项目数据复杂度较高，mobx + react 是好的选择
4. 当你的项目数据复杂度很高，redux + react 可以帮助你维持可预测性和可维护性的下降曲线不那么陡。所有 state 变化都由 action 规范化。
5. 当你的项目数据复杂度很高且数据来源很杂，rxjs 可以帮助你把所有 input 规范化为 observable/stream，可以用统一的方式处理。


思路其实很简单：
1. 当 UI 变化很复杂时，用 component 归一化处理；
2. 当 state 变化很复杂时，用 action/state 归一化处理；
2. 当 data-input 很复杂时，用 rxjs/observable 归一化处理；


任意问题，只要足够普遍和复杂，就值得抽象出专门化的机制。