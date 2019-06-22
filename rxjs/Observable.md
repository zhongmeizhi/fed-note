# RXJS 之 Observable

> Observable 是RXJS的核心

Observable顾名思义:可观察的,用来给Observer订阅.

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

**更方便的使用方法**

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

与时间有关的
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

