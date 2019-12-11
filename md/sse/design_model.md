# JS 设计模式

### 1. 构造器模式

> 无非就是继承来实现的啦 - -!

思考：为什么ES5的继承要写在 `prototype` 中，而不是直接写在构造方法里？

写在构造器中，无法做到数据共享（会造成资源浪费）
* 所以 `prototype` 中会存放需要共享数据的方法和属性（基本上都是方法）
* 而构造器中会存放不需要共享的属性和方法

构造器模式案例省略...


### 2. 模块化模式

> 模块化嘛：AMD/UMD/CommonJS/Module 都是模块化，对象、闭包也是模块化

在JS中，模块化模式其实是模拟了"类"的概念。好处是有私密空间，不会造成全局污染。

虽然JS没有私有属性。但**闭包能很好的实现私有属性的概念**

简单的模块化模式：（闭包 - -.!）
```
    var module = (function () {
        var num = 0;

        return {
            getNum: function () {
                return num;
            },
            addNum: function () {
                return num++;
            }
        };

    })();

    console.log(module)
    
    module.addNum()

    console.log(module.getNum())
```


### 3. 单例模式

> 单例：就是限制一个类只能有一个实例化对象

最简单的单例：：闭包 + Flag 来实现
```
    const mySingleton = (function () {
        let _instance;

        return function () {
            if (!_instance) {
                _instance = {
                    x: 1,
                    setX: (arg) => {
                        _instance.x = arg;
                    }
                };
            }
            return _instance;
        }
        
    })()

    const instanceA = mySingleton();
    const instanceB = mySingleton();

    console.log(instanceA === instanceB);
```

封装一下：（PS: ES5的new如果有return使用return的值）
```
    const Singleton = (function() {
        var _instance;
        return function(obj) {
            return _instance || (_instance = obj);
        }
    })();

    var a = new Singleton({x: 1});
    var b = new Singleton({y: 2});

    console.log(a === b);
```


### 观察者模式

> 由被观察者 Observer 和观察者 Watcher 组成。通过观察者调用被观察者的实例。

观察者模式是：观察者对象和被观察者对象 之间的订阅和触发事件

简单的观察者模式: （仿 `Vue` 实现）
```
    // 观察者
    class Dep {
        constructor() {
            this.subs = []
        }
        
        addSub(sub) {
            this.subs.push(sub)
        }
        
        depend() {
            if (Dep.target) { 
                Dep.target.addDep(this);
            }
        }
        
        notify() {
            this.subs.forEach(sub => sub.update())
        }
    }
    
    // 被观察者
    class Watcher {
        constructor(vm, expOrFn) {
            this.vm = vm;
            this.getter = expOrFn;
            this.value;
        }

        get() {
            Dep.target = this;
            
            var vm = this.vm;
            var value = this.getter.call(vm, vm);
            return value;
        }

        evaluate() {
            this.value = this.get();
        }

        addDep(dep) {
            dep.addSub(this);
        }
        
        update() {
            console.log('更新, value:', this.value)
        }
    }
    
    // 观察者实例
    var dep = new Dep();
    
    //  被观察者实例
    var watcher = new Watcher({x: 1}, (val) => val);
    watcher.evaluate();
    
    // 观察者监听被观察对象
    dep.depend()
    
    dep.notify()
```


### 发布/订阅者模式

> 由订阅者 Subscriber 和发布者 Publisher 组成。

发布/订阅者模式：是观察者模式的变体，比观察者模式多了一个调度中心
* 发布者发布信息到调度中心
* 调度中心和订阅者直接完成订阅和触发事件事件


一个简单的发布/订阅者模式实现：（仿 `EventBus` 实现）
```
    // EventTarget 就是一个调度中心

    class EventTarget {
        constructor() {
            this.dep = {}
        }
        
        on(key, fn) {
            this.dep[key] = fn;
        }
        
        emit(key) {
            typeof this.dep[key] === 'function' ? this.dep[key]() : ''
        }
    }
    
    let eventTarget = new EventTarget()
    
    eventTarget.on('click', function() {console.log(1)})
    eventTarget.emit('click')
```


### 中介者模式


