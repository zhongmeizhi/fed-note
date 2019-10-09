# RXJS学习 之 Observable

> Observable 是RXJS的核心

Observable顾名思义:可观察的,用来给Observer订阅.

Observable必须要被订阅后才会进行运算

最简单的例子: (一般不这么用)
```
  // 创建可观察对象
  Observable.create(subscriber => {
    subscriber.next('abc');
    subscriber.complete();
  })
  // .map(v => v)
  // .filter(v => true)
  .subscribe(
      v => { console.log(v) },
      e => { console.log(e) },
      () => { console.log('complete') }
  );
```

观察者有3个方法：（上述例子已使用）
1. next
2. error: 主动调用error方法会使用观察者的error方法,后续的观察者的方法会失效（原生JS可以执行）
   * throw new Error 也能触发 error事件
3. complete： 使用后，后续的观察者的方法会失效（原生JS可以执行）


### 转换为Observer对象

一般使用` from, of, fromEvent `将数组、事件、Promise转换为Observer对象

```
  of('abc', '123') // 打印 abc -> 123
  // of([1, 2, 3]) // 打印 [1, 2, 3]
  // from([1, 2, 3]) // 打印 1  ->  2  ->  3
  // from(Promise.resolve('123')) // 类似于then
  // fromEvent(document, 'click', true)
  // fromEventPattern( // 同时具有注册监听及移除监听两种行为
  //     (handler) => { // 监听
  //         document.addEventListener('click', handler);
  //     }, 
  //     (handler) => { // 移除
  //         document.removeEventListener('click', handler);
  //     }
  // )
  .subscribe(
      console.log,
      console.log,
      () => console.log('完成')
  )
```


### 与时间有关的

`interval` 和 `timer`

```
  interval(1000).subscribe(console.log);
  // 0  1   2   3 .... 每秒加一

  timer(3000, 1000).subscribe(console.log);
  // 等待 3秒, 然后每秒加一

  timer(3000).subscribe(console.log)
  // 3秒后执行(仅一次)

  // 都会返回 subscription
  // 通过 subscription.unsubscribe释放

  // 除了unsubscribe,也可以使用operators的takeUntil来完成操作
```


### 合并Observer对象

**concat**

和原生JS数组的concat方法类似，`concat`可以把多个`observable`实例合并成一个

**要等待前一个 observable 完成(complete)，才会继续下一个**

```
  let source = of(0, 1);
  let source2 = interval(1000).pipe(
      skip(2),
      take(2),
    );
  let source3 = from([4, 5]);
  let example = concat(source, source2, source3)

  example.subscribe(console.log)
```

**merge**

作用和concat类似。可以把多个`observable`实例合并成一个

不同：**执行下一个任务时，不需要等待前一个observable完成**

```
  let source = of(0, 1);
  let source2 = interval(1000).pipe(
      skip(2),
      take(2),
    );
  let source3 = from([4, 5]);

  let mergeExample = merge(source, source2, source3)
  mergeExample.subscribe(console.log)
```


### 合并元素

zip：取每个 observable 相对位的元素

```
  let x = of(1, 2, 3);
  let y = of('a', 'b', 'c');
  
  zip(x, y, (x,y) => {return [x, y]}).subscribe(console.log)

  // [1, "a"]
  // [2, "b"]
  // [3, "c"]
```

### 组合 Observable

combineLatest： 组合最后一个元素，不匹配空的最后项。

可以用在运算多个因子的结果

```
  let ct1 = timer(0, 1000).pipe(take(3));
  let ct2 = timer(500, 1000).pipe(take(5));
  let ct3 = of('a', 'b');

  combineLatest(ct1, ct2, ct3).subscribe(console.log)

  // [0, 0, 'b']
  // [1, 0, 'b']
  // [1, 1, 'b']
  // [2, 1, 'b']
  // [2, 2, 'b']
  // [2, 3, 'b']
  // [2, 4, 'b']
```

### 其他

* race(a, b, c) 竞速，类似于Promise.race()
* range(num1, num2) 取范围num1-num2的值。

