# Spring Boot（一）入门篇

### 为什么会有 Spring Boot ？

虽然 `Spring` 的组件代码是轻量级的，但它的配置却是重量级的（需要大量XML配置）。`Spring Boot`的官方介绍：从本质上来说，Spring Boot就是Spring，**它做了那些没有它你自己也会去做的Spring Bean配置**。

所以：Spring Boot 并不是一个新的框架， 而是默认配置了很多框架的使用方式。就像 Maven 整合了所有的 Jar 包，Spring Boot 整合了所有的框架。

### 环境搭建

##### 一、初始化项目

方式一：使用 `Idea` 编辑器操作。
  1. 首先 Java JDK 环境
  2. 然后需要 Maven 环境
  3. 在 Idea 编辑器中 new Project
  4. 选择 Spring Initialize
  5. 后续就是 Maven 的依赖选择了。（可之间next，后续再安装）
  6. 选择 Maven auto import
  7. 等依赖加载完成，即可运行项目

初始化项目方式二：
  * 通过网站 [https://start.spring.io/](https://start.spring.io/)
  * 注意选择 `Spring Web` 模块

##### 二、安装依赖

通过 maven 安装依赖包。

##### 三、运行

1. 通过 `application.properties` 文件配置 运行端口 `server.port=8333`
2. 新建 `controller/HelloWorldController.java` 文件，
  ```java
    package com.example.demo.controller;

    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    import java.util.HashMap;
    import java.util.Map;

    @RestController
    @RequestMapping("test")
    public class HelloWorldController {
        @GetMapping("hello")
        public Map sayHello() {
            Map result = new HashMap<String, String>();
            result.put("name", "zmz");
            result.put("age", "16");
            return result;
        }
    }
  ```
3. 运行
4. 打开 `http://localhost:8333/test/hello` 查看 XHR

##### 其他

Ideal 汉化
1. 下载汉化包
2. 将 jar 包放入 `IntelliJ IDEA\lib` 目录下
3. 重启 Idea

ps: 还可以通过 `Lombok` 简化代码


### 标准目录结构

代码层的结构
  1. 工程启动类(ApplicationServer.java)
  2. 实体类(domain)：置于com.springboot.domain
     * 如：用户，
  3. 数据访问层(Dao)：置于com.springboot.repository
     * 访问数据库
  4. 数据服务层(Service)：置于com,springboot.service,
     * 数据服务的实现接口(serviceImpl)至于com.springboot.service.impl
  5. 前端控制器(Controller)：置于com.springboot.controller
     * 包装service中的数据
  6. 工具类(utils)：置于com.springboot.utils
  7. 常量接口类(constant)：置于com.springboot.constant
  8. 配置信息类(config)：置于com.springboot.config
  9. 数据传输类(vo)：置于com.springboot.vo
     * 比如body体，response体

5 -> 4 -> 3 -> 2 -> 9 -> page

资源文件的结构(根目录:src/main/resources)
  1. 配置文件(.properties/.json等)置于config文件夹下
  2. 国际化(i18n))置于i18n文件夹下
  3. spring.xml置于META-INF/spring文件夹下
  4. 页面以及js/css/image等置于static文件夹下的各自文件下


### 基础部分

##### 注解`@`

* `@RestController` 将返回的对象数据直接以 JSON 或 XML 形式写入 HTTP 响应(Response)中，大部分都是 `JSON` 形式
  * `@RestController` = `@Controller` + `@ResponseBody`
* `@RequestMapping` 默认映射所有 HTTP Action (GET、PUT、POST 等)
  * 使用 `@RequestMapping(method=ActionType)` 来缩小这个映射。
  * `@PostMapping` 等价于 `@RequestMapping(method = RequestMethod.POST)`，当然还能使用 `@DeleteMapping`, `@GetMapping`
* `@RequestBody` :将 `HttpRequest body` 中的 JSON 类型数据反序列化为合适的 Java 类型。
* `@PathVariable` :取url地址中的参数
* `@RequestParam` :取url的查询参数值。


##### 常用对象

ResponseEntity: 表示整个HTTP Response：状态码，标头和正文内容。我们可以使用它来自定义HTTP Response 的内容。


##### 使用 yml 配置文件

在 `application.properties` 统计目录添加 `application.yml`

yml 添加内容 如下

```yml
  myself:
  name: Mokou
  age: 16
```


最简单的使用方法，使用 `@value`
   * 例如：在 class 中添加
    ```java
      @Value("${myself.age}")
      private String age;
    ```

如果需要一个 `JavaBean` 来专门映射配置的话, 一般使用 `@ConfigurationProperties` 读取.
   1. 添加 `config/Myself.java`
    ```java
      @Component
      // 不加这个注解的话, 使用 @Autowired 就不能注入进去了
      @ConfigurationProperties(prefix = "myself")
      // 配置文件中的前缀
      public class Myself {
          private String name;

          public String getName() {
              return name;
          }

          public void setName(String name) {
              this.name = name;
          }

          private String age;

          public String getAge() {
              return age;
          }

          public void setAge(String age) {
              this.age = age;
          }
      }
    ```
    1. 引入
      ```java
        @Autowired
        private Myself myself;
      ```
    2. 使用
      ```java
        System.out.println(myself.getName());
      ```

第三种方法：使用 `@Environment`，但是没人用，