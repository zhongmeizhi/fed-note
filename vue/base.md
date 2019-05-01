# Vue 概览

> Vue (读音 /vjuː/，类似于 view)是一套用于构建用户界面的渐进式框架。

渐进式：可以在已有的系统中部分页面先使用Vue，先只使用Vue的部分功能，然后再慢慢扩展Vue的全家桶

在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了 shouldComponentUpdate。

附：
* (在React 16- 版本前当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树)

Vue 运行：
* 使用依赖收集实现双向绑定
* render不存在的时候会去编译template
* template编译会被解析成对象形式的树结构（抽象语法树（abstract syntax tree或者缩写为AST））
* AST会经过generate得到render函数，render的返回值是VNode，也就是虚拟DOM
* 虚拟Dom的在更新时会经过patch。patch的核心时diff算法（通过同层的树节点进行比较），会涉及sameVnode的概念

Vue 主要模块：
* 四个事件（$on，$once，$off，$emit）实现方式类似EventBus
* 生命周期（创建，挂载，更新，销毁）
* nextTick （有多种降级策略）
* keep-alive 和 instance（基于VNode节点），还有activated与deactivated