# Reactive Extensions for JavaScript

> RxJS是一个基于可观测数据流在异步编程应用中的库

### Observable（可观察的）

通知:`next/error/complete`

对于同一个可观察对象进行订阅的多个观察者之间的回调函数是不共享信
息的。

```
    import { Observable } from 'rxjs';
 
    const foo = new Observable(subscriber => {
        console.log('Hello');
        subscriber.next(42);
    });
    
    foo.subscribe(val => {
        console.log(val);
    });

    let y = foo.subscribe(val => {
        console.log(val);
    });

    // 得到结果
    // "Hello" 42 "Hello" 42
```

解决的问题
* 同步和异步的统一
* 可组合的数据变更过程
* 数据和视图的精确绑定
* 条件变更之后的自动重新计算