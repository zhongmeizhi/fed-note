# Maven

> maven仓库地址 https://mvnrepository.com/

### 安装

1. 首先你得有Java JDK环境
2. 前往 [Maven官网](https://maven.apache.org/download.cgi)，
3. 下载`Binary zip archive`的zip文件如`apache-maven-3.6.1-bin.zip`
4. 解压。如`D:\soft\apache-maven-3.6.1`
5. 添加环境变量`D:\soft\apache-maven-3.6.1\bin`
6. Dos运行`mvn -v`，显示版本即成功

开发项目时项目首先会从本地仓库中获取 jar 包，当无法获取指定 jar 包的时候，本地仓库会从 远程仓库（或 中央仓库） 中下载 jar 包，并“缓存”到本地仓库中以备将来使用。

### 配置Maven本地仓库

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

### 将普通项目转为Maven项目

1. 在Ideal中项目上右键 Add Framework Support。（在new下面）
2. 选择Maven

### Maven配置样例（Spring Boot）

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

