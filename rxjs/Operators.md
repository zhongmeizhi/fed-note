# RXJS 之 Operators

> Operators

要在pipe中使用.

### take、first、skip

take: 取第 N 个值.然后结束
first: 无参时 = take(1), 有函数参数时, 类似于find()
skip: 跳过前 N 个值

```
  interval(1000).pipe(
    skip(3),
    take(4),
    first(val => {
      console.log('first', val);
      if (val == 6) {
        return true
      }
      return false
    })
  )
  .subscribe(console.log);
  // 3秒后依次输出： 3 4 5 6
```

### takeLast、last

takeLast：和take相反，取最后几个
last：和first相反

```
  of(2, 3, 4, 5)
  .pipe(
    takeLast(2),
    last()
  )
  .subscribe(console.log)
```

### concat （目前在RXJS模块，不属于Operators）

为了方便，把concat放这个模块讲述

和原生JS数组的concat方法类似，`concat`可以把多个`observable`实例合并成一个

（concat 和 concatAll 都要等待前一个 observable 完成(complete)，才会继续下一个）

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

### concatAll

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


### takeUntil

takeUntil在某件事情发生时，让一个 observable 直送出 完成(complete)讯息

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
