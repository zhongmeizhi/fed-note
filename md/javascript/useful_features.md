# 好用的新特性

### getBoundingClientRect：获取边界框客户矩形

> Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。

left、top、right、bottom，单位为像素，位置都是**相对于视口的左上角**位置而言的

![bounding](/md/img/bounding.png)

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)



### IntersectionObserverEntry：交叉点监听条目

> 描述了 目标元素 与其 根元素容器 在某一特定过渡时刻的交叉状态.（兼容性堪忧）

[参考1 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry)
[参考2 阮一峰大佬](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)


### window.requestIdleCallback()  请求懒回调

> 将在浏览器的空闲时段内调用的函数排队

这使开发人员能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

### getComputedStyle：获取元素样式

> 方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。（能获取伪元素的值）

`let style = window.getComputedStyle(element, [pseudoElt]);` pseudoElt指：伪元素

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)
