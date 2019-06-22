# RXJS 之 Operators

> Operators

要在pipe中使用.

### take && first

take: 取第 N 个值.然后结束
first: 无参时 = take(1), 有函数参数时, 类似于find()

```
  interval(1000).pipe(
    take(3),
    first(val => {
      console.log('first', val);
      if (val == 2) {
        return true
      }
      return false
    })
  )
  .subscribe(console.log)
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