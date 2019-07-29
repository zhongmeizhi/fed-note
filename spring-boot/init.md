# Spring Boot（一）入门篇

Spring Boot 其实不是什么新的框架，它默认配置了很多框架的使用方式。

就像 Maven 整合了所有的 Jar 包，Spring Boot 整合了所有的框架。

### 环境搭建

推荐使用Ideal 编辑器操作。

1. 首先Java JDK环境
2. 然后需要Maven环境
3. 在Ideal编辑器中new Project
4. 选择Spring Initialize
5. 后续就是Maven的依赖选择了。（可之间next，后续再安装）
6. 选择Maven auto import
7. 等依赖加载完成，即可运行项目

### 热启动

```
  <dependencies>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-devtools</artifactId>
          <optional>true</optional>
      </dependency>
  </dependencies>
  <build>
      <plugins>
          <plugin>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-maven-plugin</artifactId>
              <configuration>
                  <fork>true</fork>
              </configuration>
          </plugin>
      </plugins>
  </build>
```

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

项目结构分类转载自：[宋兴柱(Sindrol)](http://www.cnblogs.com/songxingzhu/p/9597927.html)

### 写第一个接口

1. 在Maven中引入支持web的模块
  ```
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
  ```
2. 编写第一个接口
  ```
    package com.example.javademo.controller;

    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.bind.annotation.RequestMapping;

    import java.util.HashMap;

    //@RestController的意思就是controller里面的方法都以json格式输出，不用再写什么jackjson配置的了！
    @RestController
    public class Hello {
        @RequestMapping("/hello")
        public HashMap index() {
            HashMap<String, String> map = new HashMap<>();
            map.put("name", "zmz");
            map.put("age", "18");
            return map;
        }
    }
  ```
3. 启动主程序，打开浏览器访问http://localhost:8080/hello，就能看到接口返回的json了

Spring Boot真的很神奇。

### [返回主页](/README.md)