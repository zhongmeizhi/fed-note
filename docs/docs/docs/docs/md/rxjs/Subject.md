# RXJS学习 之 Subject

> Subject是一种特殊类型的Observable，它允许将值多播到许多观察者。

Subject继承自Observable：`declare class Subject<T> extends Observable<T> implements SubscriptionLike`

Subject和多个Observable订阅不同点：
* 多个Observable订阅，每个Observable都是独立的
* Subject 的状态是统一的


### Subject 实现

Subject实现起来就像EventEmitters。

`Subject`自己实现了`next、error、complete、subscribe、unsubscribe`其他方法都是继承自`Observable`的
```
    var subject = {
        observers: [],
        subscribe: function(observer) {
            this.observers.push(observer)
        },
        next: function(value) {
            this.observers.forEach(o => o.next(value))    
        },
        error: function(error){
            this.observers.forEach(o => o.error(error))
        },
        complete: function() {
            this.observers.forEach(o => o.complete())
        }
    }
```

### Subject

```
    import { Subject, from } from "rxjs";

    const subject = new Subject();

    // 多个订阅
    subject.subscribe({
        next: (v) => console.log('observerA: ' + v)
    })
    subject.subscribe({
        next: (v) => console.log('observerB: ' + v)
    })

    // Observable
    var observable = from([1,2,3]);

    // 使用Subject订阅
    observable.subscribe(subject);
```

### BehaviorSubject

在开始订阅时，就尝试获取并使用最后一次发送的元素。

```
    var subject = new BehaviorSubject(0); // 0 为起始值
    var observerA = {
        ...
    }

    var observerB = {
        ...
    }

    subject.subscribe(observerA);
    subject.next(1);
    subject.next(2);

    setTimeout(() => {
        subject.subscribe(observerB); 
        subject.next(3);
    },3000)

    // 0 1 2
    // 3秒后 2 3 3
```

### ReplaySubject

使用方法同上，`ReplaySubject(bufferSize, windowTime)`，一般用来缓存bufferSize个元素


### AsyncSubject

使用方法同上，AsyncSubject() 只返回最后一个值。类似于`last()`操作符


### Observable转换Subject

* multicast：用来挂载 subject，返回具有connect方法的observable
  * connect() 后才会真的用 subject 订阅
* refCount：可以建立一个只要有订阅就会自动 connect 的 observable
* publish = `multicast(new Rx.Subject())`
* share = `publish + refCount`