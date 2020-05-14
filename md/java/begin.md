# Java 起步

### JAVA 虚拟机

JVM用来运行javac编译的.class字节码文件

java的垃圾回收机制是在JVM上实现的。

垃圾回收机制和V8引擎类似，详情见[JS垃圾回收机制](/browser/garbage_collection.md)

JDK / JRE / JVM 的关系图（盗）
![虚拟机](/md/img/jdk.png)


### Maven

> maven仓库地址 https://mvnrepository.com/

##### 安装

1. 首先你得有Java JDK环境
2. 前往 [Maven官网](https://maven.apache.org/download.cgi)，
3. 下载`Binary zip archive`的zip文件如`apache-maven-3.6.1-bin.zip`
4. 解压。如`D:\soft\apache-maven-3.6.1`
5. 添加环境变量`D:\soft\apache-maven-3.6.1\bin`
6. Dos运行`mvn -v`，显示版本即成功

开发项目时项目首先会从本地仓库中获取 jar 包，当无法获取指定 jar 包的时候，本地仓库会从 远程仓库（或 中央仓库） 中下载 jar 包，并“缓存”到本地仓库中以备将来使用。

##### 配置Maven本地仓库

1. 在`D:\soft\apache-maven-3.6.1`下新建`maven-repository`文件夹，作为maven的本地库。
2. 打开`D:\soft\apache-maven-3.6.1\conf\settings.xml`文件
3. 修改`<localRepository>/path/to/local/repo</localRepository>`
    ```
      // 默认localRepository是被注释掉的
      // 放开注释 或 新增 localRepository 为
      <localRepository>D:\soft\apache-maven-3.6.1\maven-repository</localRepository>
    ```
4. 运行`mvn help:system`
5. 此时`maven-repository`文件夹内应该多了很多文件夹

##### 将普通项目转为Maven项目

1. 在Ideal中项目上右键 Add Framework Support。（在new下面）
2. 选择Maven

##### Maven配置样例（Spring Boot）

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>groupId</groupId>
    <artifactId>java-base</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>

    <!-- Add typical dependencies for a web application -->
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot</artifactId>
            <version>2.1.3.RELEASE</version>
        </dependency>
    </dependencies>

    <!-- Package as an executable jar -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

### mysql 安装&&初始化

*安装的mysql版本为 5.7*

安装步骤
1. 官网下载 https://dev.mysql.com/downloads/file/?id=484900
2. 解压zip包 mysql-8.0.15-winx64
3. 配置path环境变量(到bin目录)
4. 默认解压后没有my.ini文件，故新增my.ini文件，内容如下
    ```
        [mysql]
        # 设置mysql客户端默认字符集
        default-character-set=utf8
        [mysqld]
        #设置3306端口
        port = 3306
        # 设置mysql的安装目录
        basedir=D:\\soft\\mysql-5.7.25-winx64
        # 允许最大连接数
        max_connections=200
        # 服务端使用的字符集默认为8比特编码的latin1字符集
        character-set-server=utf8
        # 创建新表时将使用的默认存储引擎
        default-storage-engine=INNODB
    ```
5.  以管理员身份(否则没权限)运行cmd，cd到解压目录mysql-8.0.15-winx64
6.  执行 **mysqld --initialize-insecure** 以初始化data文件夹
7.  执行 **mysqld --install** 安装mysql服务
8.  执行 **net start mysql** 启动mysql
9.  *mysql5.7默认有随机密码* 密码存放在 data目录下的 xxx.err文件内
    * 搜索password is generated for root@localhost:可以找到默认密码
10. 执行 **mysql -u root -p** 输入默认密码
11. 执行 **SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');** 修改默认root密码为空

##### Java连接Mysql异常

> This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. 

将旧版本jdbc.propertiesd的`com.mysql.dbc.Driver`改成`com.mysql.cj.jdbc.Driver`

> The server time zone value 'ÖÐ¹ú±ê×¼Ê±¼ä' is unrecognized or represents more than one time zone. You must configure either the server or JDBC driver

需要配置服务器或JDBC驱动程序的时区

解决：
* 进入数据库，运行`set Global time_zone='+8:00'`



### 事务

> 事务：指访问并可能更新数据库中各种数据项的一个程序执行单元(unit)

* mongodb 4.0版本之前没有事务管理


### 并发控制：

悲观锁：
* 悲观：并发修改的概率比较大
* 借用数据库锁机制（for update），先锁再访问（修改）
* 尝试加排他锁，加锁失败说明该记录正在被修改
* 效率低，死锁率高
* 使用的越来越少了 -.-!

乐观锁：
* 乐观：假设数据一般情况下不会造成冲突
* 冲突检测和数据更新
  * 可以利用 version 来检查是否过期
  * 可以用> <来提高颗粒度
  * 一旦锁的粒度掌握不好，就容易发生业务失败

### 数据库索引

> 主键是索引的一种

不走索引的情况、有以下索引
```sql
    key 'idx_age' ('age'),
    key 'idx_name' ('name')
```

1. 索引用来计算不走索引
```sql
    A:select * from student where age = 10+8
    B:select * from student where age + 8 = 18
```

2. 列用函数不走索引
```sql
    A:select * from student where name = concat('王哈','哈');
    B:select * from student where  concat('name','哈') ='王哈哈';

    # A走索引、B不走索引
```

3. `!=` 不走索引

```sql
    select * from student where age != 18

    # != 不走索引
```

4. Like的 % 在前面的不走索引

```sql
    A:select * from student where 'name' like '王%'
    B:select * from student where 'name' like '%小'
    
    # A走索引、B不走索引
```

5. 隐式转换导致不走索引


### 懒汉模式

### 饿汉模式