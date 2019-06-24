# RXJS 之 Operators 学习

> Operators

所有的Operators来自`rxjs/operators`，**要在pipe中使用.**

### 取值

* take: 取第 N 个值.然后结束
* first: 无参时 = take(1), 有函数参数时, 类似于find()
* skip: 跳过前 N 个值
* takeLast：和take相反，取最后几个
* last：和first相反

### takeUntil

takeUntil：取值，直到...为止

在某件事情发生时，让一个 observable 直送出 完成(complete)讯息

```
  let stopInteval = fromEvent(document, 'click');  

  interval(1000)
  .pipe(
    takeUntil(stopInteval)
  )
  .subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
  });
```

### startWith

startWith：在 observable 最前面塞入要发送的元素

```
  interval(1000).pipe(startWith('一', '二')).subscribe(console.log)

  // 一 二 1 2 3
```

### 扁平列阵

concatAll: 将二维阵列的子列阵摊平成一维阵列.

（concat 和 concatAll 都要等待前一个 observable 完成(complete)，才会继续下一个）

```
  const clicks = fromEvent(document, 'click');
  const higherOrder = clicks.pipe(
    map(ev => interval(1000).pipe(take(4))),
  );
  // 此时 higherOrder 是二维列阵: 一维列阵 = click, 二维列阵 = 1, 2, 3, 4

  higherOrder.subscribe(console.log)
  // Observable {_isSca...
  // 订阅的是一维列阵

  const firstOrder = higherOrder.pipe(concatAll());
  firstOrder.subscribe(x => console.log(x));
  // 0 -> 1 -> 2 -> 3
  // 订阅了二维列阵
```

### scan

scan: 相当于原生的 reduce，在使用时能保存状态


### 延迟

* delay： 延迟 N 毫秒后发送元素
* delayWhen：在delay的基础上可以定义每个元素的延迟方式

```
  from([1, 2, 3, 4, 5]).pipe(
    delayWhen(e => {
      return interval(e * 1000)
    }),
  ).subscribe(console.log)
```

### 防抖

* debounce：根据是否传入新值防抖
* debounceTime：根据时间防抖

```
  fromEvent(document, 'click')
  .pipe(debounceTime(300))
  .subscribe(x => console.log(x));
```

### 节流

* throttle: 参考防抖
* throttleTime: 参考防抖

### 剔重

distinct([keySelector])： 剔重
distinctUntilChanged([keySelector])：剔重，直到改变为止

### 缓存

缓存observable的元素，触发时输出缓存数组

* buffer(ob)， 在接受到ob参数前。先将observer的数据缓存起来
* bufferTime(时间毫秒数)，根据缓存队列的时间是否到达来触发observable
* bufferCount(num)，根据缓存队列的数量是否到达来触发observable
  * 如果是2个参数： bufferSize: number, startBufferEvery

```
  const clicks = fromEvent(document, 'click');
  const buffered = clicks.pipe(bufferCount(2));
  buffered.subscribe(x => console.log(x));
```

### 捕获

catchError(fn)：捕获错误的回调

### withLatestFrom

withLatestFrom： 主从关系，等待observable发送事件

```
  const itv = interval(1000);
  
  fromEvent(document, 'click')
  .pipe(
    withLatestFrom(itv)
  )
  .subscribe(x => console.log(x));

  // interval一直在执行
  // 等点击一次，就输出一次
```