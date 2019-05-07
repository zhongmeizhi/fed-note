# Sizzle引擎

jQuery的`$()`语法，在`document.querySelector`时代来临前，是使用Sizzle引擎处理的

例如: `$('#abc .a[name = "zmz"]')`

### Sizzle工作原理：

首先，会将复杂的选择器表达式拆分成一个个块表达式和块间关系，然后进行Dom操作，在Dom操作中会按照性能（ID > Class > Name> Tag）选择对应方案。

代码分割，采用的是一串串的正则，比如这样的
```
  // 是否存在伪类
  /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/
```

然后，一般采用从右向左的查找方式（亮点）。从右向左的查找方式的好处是：对得到的元素集合，肯定包括了最终的元素。这样可以减少查找的操作。
```
if (context) {
    ret = Sizzle.find(parts.pop(), context);
    set = Sizzle.filter(ret.expr, ret.set) ;
    // 一直取最后一个
    while(parts.length) {
        pop = parts.pop();
        ……
        Expr.relative[ cur ]( checkSet, pop );
    }
}
```


如果选择器表达式的最左边存在`#id`选择器，会首先对最左边进行查询。
```
if(parts[0] is #id) {
    context = Sizzle.find(parts.shift(), context)[0];
}
```

Sizzle引擎的以上操作目的都是为了提升性能。

### [返回主页](/README.md)