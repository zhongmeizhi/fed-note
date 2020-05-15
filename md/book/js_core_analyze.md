# JavaScript核心原理解析

> 学习要“知味”，你一旦从这个过程中得到了收获，你就如同食髓，乐此不疲了。所以，不要气馁，放松心态，坚持就好了。

语言最核心的部分也有两个，第一个是语言的构成，第二个是如何构成。

### 赋值案例分析

> JavaScript 总是严格按照从左至右的顺序来计算表达式 by.《JavaScript 权威指南》

以下代码分析，为何 `a.x == undefined`

```js
  var a = {n:1};
  a.x = a = {n:2};
  alert(a.x); // --> undefined
```

包含知识点

1.  JS 表达式严格按照从左往右的顺序进行计算
2.  `a.x` 在 JS 中属于表达式（中 a 中获取 x）
3.  `a` 是引用类型

运算过程

1. 因为是 `a.x` 所以先获取到 `a` 的引用，
2. 通过 `a` 取值，获取到 `a.x`
3. 通过赋值覆盖原始变量 `a`
4. 因为 `a.x` 已经取值，将 `a` 原始值覆盖后，已被取值的 `a` 被**空悬**
5. 而赋值 `a.x` 其实是无意义的


### 水平一般？

> 什么叫“水平一般”呢？ by. 周爱民

因为他学的东西，别人也都学；会的东西，别人也都会；他强的东西，别人一样也强。即使别人今天不如他学得多、会得多，又或者不比他强多少，但是只要花点时间、下点功夫，也就一样儿也不会比他差。他十几年的一线开发，把自己做成了熟手、熟练工，东西会得再多，技巧再熟练，也不过是卖油翁的“但手熟尔”。

我在面试里面，确实问了他几个偏向核心的问题，他也确实知道，很清晰、很准确。但再进一步问原理时，他却是一无所知。所以，我又引导、设问，说：“如果现在让你来考虑这个问题，你会从哪儿入手呢？”那位候选人想了好几个招数，中规中矩，然而无一可用。这就是关键所在。

“核心原理”不是一些招数技法，不是拿来多练多用就行了的。所谓“核心”呢，不见得是大家都知道的——一眼望去，万千条路径之中，找到最正确的那一条，才是核心。但是这个东西可以教，也可以记，下次看见这个路，照着走就是了。所以，大公司里有所谓的“核心团队”，新人进去，不消半年工夫，功力就大增了，出来能带一个团队了。咦，带团队做什么呢？冲锋陷阵啊，杀敌交人头啊！反正，和上面说的“吃”一样，还是劳力活。

所以，就算是在“核心团队”里，他们也只是帮你指出核心之所在，最多教你会一些套路，让人净增功力。但是这样的核心只是“死东西”，不懂得核心的原理，就如同上面说过的那位面试候选人一样，出的都是些中规中矩的招数。