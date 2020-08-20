# 好用的新特性

### offsetParent 各种偏移系列

> 能获取到定位父元素，也很方便的获取到偏移值

PS: PC端兼容不错，获取偏移很方便

`HTMLElement.offsetParent` 是一个只读属性，返回一个指向最近的（指包含层级上的最近）`包含该元素的定位元素`或者最近的 table,td,th,body元素。
  * `offsetParent` 是要有定位的父元素 (position不等于static)，或者 table/td/th/body。
  * `offsetParent` 如果自身是 `display: fixed;` 那么其定位父元素为视窗
  * 当元素的 `style.display` 设置为 `none` 时，offsetParent 返回 `null` 
  * `offsetTop` 和 `offsetLeft` 都是相对于其内边距边界的。


### getBoundingClientRect: 获取边界框客户矩形

> Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。

PS: PC端兼容不错，获取相对视口位置很方便

left、top、right、bottom，单位为像素，位置都是**相对于视口的左上角**位置而言的

![bounding](../img/bounding.png)

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)



### getComputedStyle: 获取元素样式

> 方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。（能获取伪元素的值）

PC端兼容不错，优势：可以获取到伪元素。

`let style = window.getComputedStyle(element, [pseudoElt]);` pseudoElt指：伪元素

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)



### IntersectionObserverEntry：交叉点监听条目

> 描述了 目标元素 与其 根元素容器 在某一特定过渡时刻的交叉状态.

PS: 兼容性堪忧

[参考1 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry)
[参考2 阮一峰大佬](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)


### window.requestIdleCallback()  请求懒回调

> 将在浏览器的空闲时段内调用的函数排队.

PS: 兼容性堪忧

这使开发人员能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)


### css 属性 scroll-snap-align

PS：PC端兼容性一般，移动端兼容性很差

滚动的对齐方式，对做轮播图什么的很方便


### MutationObserver

监听DOM的变化，（是个微任务）

ps: 大部分浏览器都能用，包括IE11。。。

[参考](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)


### shadow DOM

> 一个可以隔离样式的 DOM 元素，可以配合 Web Components 使用

原生 input 使用了该属性。

ps: 兼容性就这样吧

[参考](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)


### customElements

> Web Components 标准非常重要的一个特性是，它使开发者能够将HTML页面的功能封装为 custom elements

ps: 兼容性就这样吧

[参考](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)
