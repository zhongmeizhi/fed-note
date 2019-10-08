# Dart-类 :/

参考：Dart官网

### 构造函数 :)

构造函数名字可以为 `ClassName` 或者 `ClassName.identifier`

```
  var jsonData = JSON.decode('{"x":1, "y":2}');
    
  class Point {
    num x;
    num y;

    // 通过 ClassName定义构造函数
    // Point(num x, num y) {
    //   this.x = x;
    //   this.y = y;
    // }

    // 或者 精简方法
    Point(this.x, this.y);

    // 通过ClassName.identifier定义构造函数
    Point.fromJson(Map json) {
      x = json['x'];
      y = json['y'];
    }
  }
  
  // 直接创建Point类
  var p1 = new Point(2, 2);

  // 通过Json创建Point类
  var p2 = new Point.fromJson(jsonData);
```

### 构造函数不能继承 :o

构造函数不能继承，所以超类的命名构造函数 也不会被继承。如果你希望 子类也有超类一样的命名构造函数， 你必须在子类中自己实现该构造函数。

如果超类没有无名无参数构造函数， 则你需要手工的调用超类的其他构造函数。 在构造函数参数后使用冒号 : 可以调用 超类构造函数。

```
  class Person {
    String firstName;

    Person.fromJson(Map data) {
      print('in Person');
    }
  }

  class Employee extends Person {
    
    // Person没有默认的构造函数;
    // 必须 call super.fromJson(data).

    Employee.fromJson(Map data) : super.fromJson(data) {
      print('in Employee');
    }
  }

  main() {
    var emp = new Employee.fromJson({});

    // emp 是 Person
    // emp 是 Employee
    if (emp is Person) {
      emp.firstName = 'Bob';
    }
    (emp as Person).firstName = 'Bob';
  }
```

### 构造函数执行顺序 :/

1. 初始化参数列表
2. 超类的无名构造函数
3. 主类的无名构造函数

### 初始化列表 :)

```
  class Point {
    num x;
    num y;

    Point(this.x, this.y);

    Point.fromJson(Map jsonMap)
        : x = jsonMap['x'],
          y = jsonMap['y'] {
      print('In Point.fromJson(): ($x, $y)');
    }
  }
```

注意：初始化表达式等号右边的部分`不能访问 this`。

初始化列表非常适合用来设置 `final` 变量的值。

```
  import 'dart:math';

  class Point {
    final num x;
    final num y;
    final num distanceFromOrigin;

    Point(x, y)
        : x = x,
          y = y,
          distanceFromOrigin = sqrt(x * x + y * y);
  }

```

### 重定向构造函数 :o

一个重定向构造函数是没有代码的，在构造函数声明后，使用` : `调用其他构造函数。

```
  class Point {
    num x;
    num y;

    Point(this.x, this.y);

    // 重定向
    Point.alongXAxis(num x) : this(x, 0);
  }
```

### 编译时常量 :(

两个一样的编译时常量其实是 同一个对象：

```
  var a = const ImmutablePoint(1, 1);
  var b = const ImmutablePoint(1, 1);

  assert(identical(a, b)); // They are the same instance!
```

### 常量构造函数 :|

如果你的类提供一个状态不变的对象，你可以把这些对象 定义为编译时常量。要实现这个功能，需要定义一个 `const` 构造函数， 并且声明所有类的变量为 `final`。

```
  class ImmutablePoint {
    final num x;
    final num y;
    const ImmutablePoint(this.x, this.y);
    static final ImmutablePoint origin =
        const ImmutablePoint(0, 0);
  }
```

### 工厂方法构造函数 :)

如果一个构造函数并不总是返回一个新的对象，则使用 `factory` 来定义 这个构造函数。(**工厂构造函数无法访问 this。**)

下面代码演示工厂构造函数 如何从缓存中返回对象。

```
  class Logger {
    final String name;
    bool mute = false;

    // 缓存池
    static final Map<String, Logger> _cache =
        <String, Logger>{};

    // 工厂函数
    factory Logger(String name) {
      if (_cache.containsKey(name)) {
        return _cache[name];
      } else {
        final logger = new Logger._internal(name);
        _cache[name] = logger;
        return logger;
      }
    }
    
    Logger._internal(this.name);

    void log(String msg) {
      if (!mute) {
        print(msg);
      }
    }
  }
```

### 抽象类 :|

抽象类：一个**不能被实例化**的类，使用 `abstract` 修饰符定义。（在Flutter中用的挺多的。）

抽象类通常用来定义接口， 以及部分实现。如果你希望你的抽象类 是可示例化的，则定义一个 工厂 构造函数。

```
  // 抽象类 - 不能被实例化
  abstract class AbstractContainer {
    // ...Define constructors, fields, methods...

    void updateChildren(); // 抽象函数

    void myPrint() {
      print('一个普通函数');
    }
  }
```

### 隐式接口 :o

每个类都隐式的定义了一个包含所有实例成员的接口，并且这个类实现了这个接口。如果你想 创建类 A 来支持 类 B 的 api，而不想继承 B 的实现， 则类 A 应该实现 B 的接口。

一个类可以通过 `implements` 关键字来实现一个或者多个接口， 并实现每个接口定义的 API。

通俗的讲：使用`implements`**就意味着要重写接口的API**

使用场景：比如Flutter的`Provider`以接口来实现`dispose`的重写操作

`-_-!` 比起抽象函数，接口重写的更多，但是提供接口方是可以被实例化的。

```
  class Point implements Comparable, Location {
    // ...
  }
```

### 继承 :)

继承是最基础的啦（基本上大家都懂，就Mark一下）

Dart的继承使用 `extends` 定义子类， `supper` 引用 超类。子类可以覆写父类的函数，（可加`@override`注解，来表示你的函数想覆盖父类函数）

```
  class Television {
    void turnOn() {
      _illuminateDisplay();
      _activateIrSensor();
    }
    // ...
  }

  class SmartTelevision extends Television {
    void turnOn() {
      super.turnOn();
      _bootNetworkInterface();
      _initializeMemory();
      _upgradeApps();
    }
    // ...
  }
```

### mixin

mixin：提供了一种多继承机制，使用和class类似，只不过没有构造方法。

通过`on`关键字可以限定mixin允许被哪些类使用，除非希望mixin可以像普通类一样使用，否则使用`mixin`关键字而不是`class`。

在mixin中，后`with`的函数会覆盖前面的函数。

```
  mixin Dog on Animal{
    bool isDog = true;

    void eat() {
      // ...
    }
  }

  mixin Cat {
    // ...
  }

  class A extends Animal with Dog, Cat {
    // ...
  }
```

### 函数 :|

类中可以定义函数，函数大部分用法和JS类似

可以通过实行 `getter` 和 `setter` 来创建新的属性

```
  class Rectangle {
    num left;
    num top;
    num width;
    num height;

    Rectangle(this.left, this.top, this.width, this.height);

    num get right             => left + width;
        set right(num value)  => left = value - width;
    num get bottom            => top + height;
        set bottom(num value) => top = value - height;
  }
```

抽象函数：没有函数体的函数，抽象类和非抽象类都可以定义抽象函数。

```
  abstract class Doer {
    
    // 抽象函数
    void doSomething(); 
  }

  class EffectiveDoer extends Doer {

    // 重写
    void doSomething() {
      // some...
    }
  }
```

可以通过`operator`来复写操作符

```
  class Vector {
    final int x;
    final int y;
    const Vector(this.x, this.y);

    // 重写 +
    Vector operator +(Vector v) {
      return new Vector(x + v.x, y + v.y);
    }

    // 重写 -
    Vector operator -(Vector v) {
      return new Vector(x - v.x, y - v.y);
    }
  }
```

### 静态变量/函数 :)

使用 static 关键字来实现类级别的 静态变量和函数。

不同点
* 可以不用new，直接执行。`Point.distanceBetween(a, b)`
* 静态变量在第一次使用的时候才被初始化。
* 静态函数不再类实例上执行，(所以无法访问 `this`)

### call()

如果 Dart 类实现了 `call()` 函数则 可以当做方法来调用。

```
  class ClassFunction {
  call(String a, String b, String c) => '$a $b $c!';
}

main() {
  var cf = new ClassFunction();
    var out = cf("wangxiaojian","is","talent");
    print('$out');
    print(cf.runtimeType);
    print(out.runtimeType);
    print(cf is Function);
  }
  
  // 运行结果：
  // wangxiaojian is talent!
  // ClassFunction
  // String
  // false
```


### End :(

结束啦