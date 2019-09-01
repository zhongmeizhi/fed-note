# Dart-基本操作 :/

参考：Dart官网

### 开始 :/

> Dart中，所有的变量都是对象(包括基础类型)。默认为`null`。

### 数字 num :)

int(整数) 和 double(浮点数) 都是 num 的子类。定义了 `abs()`、 `ceil()`、和 `floor()` 等 函数。

更多操作参考`dart:math`库,

### 字符串 String :*

字符串拼接推荐使用： `'${x}嘿嘿嘿'`

定义多行字符串推荐使用：
```
  String s1 = '''
      You can create
      multi-line strings like this one.
    ''';
```

### 布尔 bool :|

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

### 字符串和数字间的转换 :)

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

### List :s

List的用法和JS类似，但是`.forEach(fn)`和`.map(fn)`的参数只有value，没有index，`-_-!` 炒鸡难受。

```
  List list = [1, 2, 3];
  // list.length == 3;
  // list[1] == 2;
```

### Map :|

Map的用法和JS类似，当然也能 `new Map()`，可以直接通过`length`获取长度

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

  // Map可以获取长度
  print(gifts.length == 2);
```

### Runes :@

在 Dart 中，runes 代表字符串的 UTF-32 code points。

Unicode 为每一个字符、标点符号、表情符号等都定义了 一个唯一的数值。 由于 Dart 字符串是 UTF-16 code units 字符序列， 所以在字符串中表达 32-bit Unicode 值就需要 新的语法了。

`- -.!` 一脸懵逼


### Symbol :|

唯一标识符，同JS。`const Symbol("unary-")`

### Function :/

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

在Class章再叙述函数在Class中定义时的特性。

### 操作符 :o

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

### 枚举 :|

枚举：用来表现一个固定 数目的常量。

```
  enum Color {
    red,
    green,
    blue
  }

  // 枚举的使用
  Color aColor = Color.blue;

  // 获取全部枚举值
  List<Color> colors = Color.values;

  // 每个枚举都有对应的 index
  print(Color.red.index == 0);
```

### End :(

基础篇结束，下一篇：Dart-类(Class)