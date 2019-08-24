### Dart-类 :/

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

# TODO

`- -.` 休息


##### 编译时常量 :|

两个一样的编译时常量其实是 同一个对象：

```
  var a = const ImmutablePoint(1, 1);
  var b = const ImmutablePoint(1, 1);

  assert(identical(a, b)); // They are the same instance!
```

