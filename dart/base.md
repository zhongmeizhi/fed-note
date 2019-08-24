# Dart官网翻译 & 浓缩


###  :/

* Dart是强类型语音。
* 静态作用域、
  * 大括号里面定义的变量就 只能在大括号里面访问

final 变量只能赋值一次


实例变量可以为 final 但是不能是 const 。

```
  // const 赋值后的变量也是不可被修改的

  List constantList = const [1, 2, 3];
  // constantList[1] = 1; // Uncommenting this causes an error.
```


### 内置类型 :/

> Dart中，所有的变量都是对象(包括基础类型)。默认为`null`。

##### 数字 num :)

int(整数) 和 double(浮点数) 都是 num 的子类。定义了 `abs()`、 `ceil()`、和 `floor()` 等 函数。

更多操作参考`dart:math`库,

##### 字符串 String :*

字符串拼接推荐使用： `'${x}嘿嘿嘿'`

定义多行字符串推荐使用：
```
  String s1 = '''
      You can create
      multi-line strings like this one.
    ''';
```

##### 布尔 bool :|

Dart是强类型语音，在条件判断中，只支持`true`和`false`

```
  // 检查变量是否是空字符串
  var fullName = '';
  assert(fullName.isEmpty);

  // 检查对象是否为 0
  var hitPoints = 0;
  assert(hitPoints == 0);

  // 检查对象是否为 null
  var unicorn;
  assert(unicorn == null);

  // 检查是否 NaN
  var iMeantToDoThis = 0 / 0;
  assert(iMeantToDoThis.isNaN);
```

##### 字符串和数字间的转换 :)

```
  // String -> int  => 1
  int one = int.parse('1');

  // String -> double   => 1.1
  double onePointOne = double.parse('1.1');

  // int -> String  => '1'
  String oneAsString = 1.toString();

  // double -> String  => '3.14'
  String piAsString = 3.14159.toStringAsFixed(2);
```

##### List :s

List的用法和JS类似，但是`.forEach(fn)`和`.map(fn)`的参数只有value，没有index，`-_-!` 炒鸡难受。

```
  List list = [1, 2, 3];
  // list.length == 3;
  // list[1] == 2;
```

##### Map :|

Map的用法和JS类似

```
  Map gifts = {
    // Keys      Values
    'first' : 'partridge',
    'second': 'turtledoves',
    'fifth' : 'golden rings'
  };

  // 取值
  print(gifts['first'] == 'partridge');
  
  // 赋值
  nobleGases[2] = 'helium';
```

```
  // Map可以获取长度
  print(gifts.length == 2);
```

##### Runes :@

在 Dart 中，runes 代表字符串的 UTF-32 code points。

Unicode 为每一个字符、标点符号、表情符号等都定义了 一个唯一的数值。 由于 Dart 字符串是 UTF-16 code units 字符序列， 所以在字符串中表达 32-bit Unicode 值就需要 新的语法了。

`- -.!` 一脸懵逼


##### Symbol :|

唯一标识符，同JS。`const Symbol("unary-")`

##### Function :/

Dart的Function类似JS的函数。

函数是一等公民对象，可以作为参数使用，也可以赋值给变量。也支持闭包的写法。

如果只有一个表达式， 可以使用`=>`箭头函数

```
  // => expr 语法是 { return expr; } 的缩写

  bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

函数的参数有
* 命名参数
  ```
    // 定义
    enableFlags({bool bold, bool hidden}) {
      // ...
    }

    // 使用
    enableFlags(bold: true, hidden: false);
  ```
* 可选位置参数
  ```
    String say(String from, String msg, [String device]) {
      var result = '$from says $msg';
      if (device != null) {
        result = '$result with a $device';
      }
      return result;
    }

    // 使用
    // say('Bob', 'Howdy') == 'Bob says Howdy'
    // say('Bob', 'Howdy', 'dog') == 'Bob says Howdy with a dog'
  ```
* 默认参数
  ```
    void enableFlags({bool bold = false, bool hidden = false}) {
      // ...
    }
  ```

##### 操作符 :o

|操作符|解释|举例|
|--|--|--|
|is |如果对象是指定的类型返回 True|`emp is Person`，当 emp 实现了 Person 的接口，则返回true，否则返回false|
|is! |如果对象是指定的类型返回 False|同上|
|as |类型转换|`(emp as Person).firstName = 'Bob';` 如果emp不是Person类型。则`as`会抛出异常|
|??|类似`|| (或)`，为`null`则用后面的值|`String str => msg ?? 'abc';`|
|??=|指定 值为 null 的变量的值|`b ??= value;`，如果 b 是 null，则赋值给 b；如果不是 null，则 b 的值保持不变|
|?.|条件成员访问|和 . 类似，例如 `foo?.bar` 如果 foo 为 null 则返回 null，否则返回 bar 成员|
|..|连级操作符|见下文|

连级操作符使用
```
  querySelector('#button') // Get an object.
    ..text = 'Confirm'   // Use its members.
    ..classes.add('important')
    ..onClick.listen((e) => window.alert('Confirmed!'));
```

### Class :/

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

