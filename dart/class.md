### Dart-类 :/

参考：Dart官网

##### 构造函数 :)

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

##### 构造函数不能继承 :o

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

##### 构造函数执行顺序 :/

1. 初始化参数列表
2. 超类的无名构造函数
3. 主类的无名构造函数

##### 初始化列表 :)

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

##### 重定向构造函数 :o

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

##### 编译时常量 :(

两个一样的编译时常量其实是 同一个对象：

```
  var a = const ImmutablePoint(1, 1);
  var b = const ImmutablePoint(1, 1);

  assert(identical(a, b)); // They are the same instance!
```

##### 常量构造函数 :|

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

##### 工厂方法构造函数 :)

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

##### 抽象类 :|

抽象类：一个**不能被实例化**的类，使用 `abstract` 修饰符定义。（在Flutter中用的挺多的。）

# TODO


##### 函数 :|

类中可以定义函数，函数大部分用法和JS类似

可以通过实行 getter 和 setter 来创建新的属性

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

抽象函数，（抽象函数是只定义函数接口但是没有实现的函数，由子类来 实现该函数），抽象类和非抽象类都可以定义抽象函数。

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