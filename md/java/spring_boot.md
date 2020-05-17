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

简化代码
* 通过 `Lombok` 简化代码，但是很少有人用（维护不方便）
* 通过 `JPA` 维护 SQL，（单表查询很方便，多表查询不好用且性能会变差）


### 主注解

1. `@SpringBootApplication`: 创建 SpringBoot 项目之后会默认在主类
2. `@EnableAutoConfiguration`: 启用 SpringBoot 的自动配置机制
3. `@ComponentScan`: 扫描被 @Component (@Service,@Controller) 注解的 Bean，注解默认会扫描该类所在的包下所有的类。
4. `@Configuration`: 声明配置类，可以使用 `@Component` 代替（这样就失去了语义化）


### Spring Bean 相关

`@Autowired`: 自动导入对象到类中，被注入进的类同样要被 Spring 容器管理比如

通过下面的注解，可以把类标识成可用于 `@Autowired` 注解自动装配的 bean 的类

1. `@Component`: 通用的注解，可标注任意类为 Spring 组件。如果一个 Bean 不知道属于哪个层，可以使用@Component 注解标注。
2. `@Repository`: 对应持久层即 Dao 层，主要用于数据库相关操作。
3. `@Service`: 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层
4. `@Controller`: 对应 Spring MVC 控制层，主要用户接受用户请求并调用 Service 层返回数据给前端页面。


### 请求相关

* `@RestController` 将返回的对象数据直接以 JSON 或 XML 形式写入 HTTP 响应(Response)中，大部分都是 `JSON` 形式
  * `@RestController` = `@Controller` + `@ResponseBody`
  * `@RequestBody` :将 `HttpRequest body` 中的 JSON 类型数据反序列化为合适的 Java 类型。
* `@RequestMapping` 默认映射所有 HTTP Action (GET、PUT、POST 等)
  * 使用 `@RequestMapping(method=ActionType)` 来缩小这个映射。
  * `@PostMapping` 等价于 `@RequestMapping(method = RequestMethod.POST)`
  * `@GetMapping`
  * `@DeleteMapping`
  * `@PutMapping`
  * `@PatchMapping`
* `@PathVariable` :取url地址中的参数
* `@RequestParam` :取url的查询参数值。

ResponseEntity: 表示整个HTTP Response：状态码，标头和正文内容。我们可以使用它来自定义HTTP Response 的内容。


### @Scope

声明 Spring Bean 的作用域，使用方法:

```java
    @Bean
    @Scope("singleton")
    public Person personSingleton() {
        return new Person();
    }
```

四种常见的 Spring Bean 的作用域：

1. `singleton`: 唯一 bean 实例，Spring 中的 bean 默认都是单例的。
2. `prototype`: 每次请求都会创建一个新的 bean 实例。
3. `request`: 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP request 内有效。
4. `session`: 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP session 内有效。

### 参数校验

SpringBoot 项目的 spring-boot-starter-web 依赖中已经有 hibernate-validator 包，不需要引用相关依赖。

常用的字段验证的注解

* `@NotEmpty` 被注释的字符串的不能为 null 也不能为空
* `@NotBlank` 被注释的字符串非 null，并且必须包含一个非空白字符
* `@Null` 被注释的元素必须为 null
* `@NotNull` 被注释的元素必须不为 null
* `@AssertTrue` 被注释的元素必须为 true
* `@AssertFalse` 被注释的元素必须为 false
* `@Pattern(regex=,flag=)` 被注释的元素必须符合指定的正则表达式
* `@Email` 被注释的元素必须是 Email 格式。
* `@Min(value)` 被注释的元素必须是一个数字，其值必须大于等于指定的最小值
* `@Max(value)` 被注释的元素必须是一个数字，其值必须小于等于指定的最大值
* `@DecimalMin(value)` 被注释的元素必须是一个数字，其值必须大于等于指定的最小值
* `@DecimalMax(value)` 被注释的元素必须是一个数字，其值必须小于等于指定的最大值
* `@Size(max=, min=)` 被注释的元素的大小必须在指定的范围内
* `@Digits (integer, fraction)` 被注释的元素必须是一个数字，其值必须在可接受的范围内
* `@Past` 被注释的元素必须是一个过去的日期
* `@Future` 被注释的元素必须是一个将来的日期

在需要验证的参数上加上了 `@Valid` 注解，如果验证失败，它将抛出 `MethodArgumentNotValidException`
通过在类上添加 `@Validated` 注解，这个参数可以告诉 Spring 去校验方法参数。

```java
    @RestController
    @RequestMapping("/api")
    public class PersonController {

        @PostMapping("/person")
        public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
            return ResponseEntity.ok().body(person);
        }
    }
```

### 事务 @Transactional

在 `@Transactional` 注解中如果不配置 rollbackFor 属性,那么事物只会在遇到 RuntimeException 的时候才会回滚,加上 `rollbackFor=Exception.class`,可以让事物在遇到非运行时异常时也回滚。

```java
    @Transactional(rollbackFor = Exception.class)
    public void save() {
        // 略
    }
```

* 作用于类：当把 @Transactional 注解放在类上时，表示所有该类的 public 方法都配置相同的事务属性信息。
* 作用于方法：当类配置了 @Transactional，方法也配置了 @Transactional，方法的事务会覆盖类的事务配置信息。


### 请求过滤和拦截

过滤器（Filter）：当你有一堆东西的时候，你只希望选择符合你要求的某一些东西。定义这些要求的工具，就是过滤器。
  * 通过实现 `javax.Servlet.Filter`接口：注册过滤器
拦截器（Interceptor）：在一个流程正在进行的时候，你希望干预它的进展，甚至终止它进行，这是拦截器做的事情。
  * 通过继承 `servlet.handler.HandlerInterceptorAdapter` 类：注册拦截器


### 使用 yml 配置文件

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
      @Component // 不加这个注解的话, 使用 @Autowired 就不能注入进去了
      @ConfigurationProperties(prefix = "myself") // 配置文件中的前缀
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

第三种方法：使用 `@Environment`，但是没人用


### 全局异常处理

使用 `@ControllerAdvice` 和 `@ExceptionHandler` 处理全局异常

* `@ControllerAdvice` :注解定义全局异常处理类
* `@ExceptionHandler` :注解声明异常处理方法


### 异步

如果我们需要在 SpringBoot 实现异步编程的话，通过 Spring 提供的两个注解会让这件事情变的非常简单。

* `@EnableAsync`：通过在 配置类或者Main类 上加 `@EnableAsync` 开启对异步方法的支持。
* `@Async` 可以作用在类上或者方法上，作用在类上代表这个类的所有方法都是异步方法。



### Spring Schedule 实现定时任务

schedule（译：时间表、计划表）, [在线Cron表达式生成器](http://cron.qqe2.com/)

1. 创建一个 scheduled task

`@Scheduled`：创建一个定时任务，包括：固定速率执行、固定延迟执行、初始延迟执行、使用 Cron 表达式执行定时任务。

```java
  import org.slf4j.Logger;
  import org.slf4j.LoggerFactory;
  import org.springframework.scheduling.annotation.Scheduled;
  import org.springframework.stereotype.Component;

  import java.text.SimpleDateFormat;
  import java.util.Date;
  import java.util.concurrent.TimeUnit;

  @Component
  public class ScheduledTasks {
      private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
      private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

      /**
      * fixedRate：固定速率执行。每5秒执行一次。
      */
      @Scheduled(fixedRate = 5000)
      public void reportCurrentTimeWithFixedRate() {
          log.info("Current Thread : {}", Thread.currentThread().getName());
          log.info("Fixed Rate Task : The time is now {}", dateFormat.format(new Date()));
      }

      /**
      * fixedDelay：固定延迟执行。距离上一次调用成功后2秒才执。
      */
      @Scheduled(fixedDelay = 2000)
      public void reportCurrentTimeWithFixedDelay() {
          try {
              TimeUnit.SECONDS.sleep(3);
              log.info("Fixed Delay Task : The time is now {}", dateFormat.format(new Date()));
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
      }

      /**
      * initialDelay:初始延迟。任务的第一次执行将延迟5秒，然后将以5秒的固定间隔执行。
      */
      @Scheduled(initialDelay = 5000, fixedRate = 5000)
      public void reportCurrentTimeWithInitialDelay() {
          log.info("Fixed Rate Task with Initial Delay : The time is now {}", dateFormat.format(new Date()));
      }

      /**
      * cron：使用Cron表达式。　每分钟的1，2秒运行
      */
      @Scheduled(cron = "1-2 * * * * ? ")
      public void reportCurrentTimeWithCronExpression() {
          log.info("Cron Expression: The time is now {}", dateFormat.format(new Date()));
      }
  }
```

2. 启动类上加上 @EnableScheduling 注解

在 SpringBoot 中我们只需要在启动类上加上 `@EnableScheduling` 便可以启动定时任务了。

```java
  @SpringBootApplication
  @EnableScheduling
  public class DemoApplication {
      public static void main(String[] args) {
          SpringApplication.run(DemoApplication.class, args);
      }
  }
```

3. 自定义线程池执行 scheduled task

默认情况下，`@Scheduled` 任务都在Spring创建的大小为1的默认线程池中执行

如果需要自定义线程池执行只需要新加一个实现 `SchedulingConfigurer` 接口的 `configureTasks` 的类即可，这个类需要加上 `@Configuration` 注解。

```java
  @Configuration
  public class SchedulerConfig implements SchedulingConfigurer {
      private final int POOL_SIZE = 10;

      @Override
      public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
          ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();

          threadPoolTaskScheduler.setPoolSize(POOL_SIZE);
          threadPoolTaskScheduler.setThreadNamePrefix("my-scheduled-task-pool-");
          threadPoolTaskScheduler.initialize();

          scheduledTaskRegistrar.setTaskScheduler(threadPoolTaskScheduler);
      }
  }
```


4. @EnableAsync 和 @Async 使定时任务并行执行

如果想要代码并行执行，可以使用 `@EnableAsync` 和 `@Async` 这两个注解实现

```java
  @Component
  @EnableAsync
  public class AsyncScheduledTasks {
      private static final Logger log = LoggerFactory.getLogger(AsyncScheduledTasks.class);
      private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

      /**
      * fixedDelay：固定延迟执行。距离上一次调用成功后2秒才执。
      */
      //@Async
      @Scheduled(fixedDelay = 2000)
      public void reportCurrentTimeWithFixedDelay() {
          try {
              TimeUnit.SECONDS.sleep(3);
              log.info("Fixed Delay Task : The time is now {}", dateFormat.format(new Date()));
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
      }
  }
```

因为 `@Scheduled` 任务都在Spring创建的大小为1的默认线程池中执行。如果不使用 `@Async` 程序会因为 `sleep(3)`，使 `reportCurrentTimeWithFixedDelay` 方法 5s 调用1次。

使用 `@EnableAsync` 和 `@Async` 后，`reportCurrentTimeWithFixedDelay` 每 2s 调用1次。
