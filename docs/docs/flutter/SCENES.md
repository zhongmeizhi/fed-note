# 环境问题

### Flutter 找不到虚拟机

解决方案
1. 检查ADB 环境
2. 检查SDK PATH
3. 清除缓存

.

### Windows开发环境 访问localhost

访问会报错：SocketException: OS Error: Connection refused

> android模拟器中使用 localhost会指向模拟机本机

解决方案： 在控制台运行：`adb reverse tcp:8080 tcp:8080`

解决方案2： 直接访问自己的IP 如： `http://10.93.157.10:2333`

.

### android无法联网问题

> emulator -avd 虚拟机名称 -dns-server 8.8.8.8,114.114.114.114

1. 进入 C:\Users\zmz\.android\avd 查看虚拟机名称
2. 进入 C:\Users\zmz\AppData\Local\Android\Sdk\emulator 打开控制台
3. 运行`emulator -avd 虚拟机名称 -dns-server 8.8.8.8,114.114.114.114`

.

### Flutter Resolving dependencies... 卡住的问题

> 感谢伟大的中国长城防火墙

解决方案：

配置用户环境变量，使用中国的Flutter镜像包：
```
  PUB_HOSTED_URL ==> https://pub.flutter-io.cn

  FLUTTER_STORAGE_BASE_URL ==> https://storage.flutter-io.cn
```

修改android/build.gradle默认的配置：
```
    buildscript {
        repositories {
            // maven 阿里镜像地址
            maven{ url 'https://maven.aliyun.com/repository/google'}
            maven{ url 'https://maven.aliyun.com/repository/gradle-plugin'}
            maven{ url 'https://maven.aliyun.com/repository/public'}
            maven{ url 'https://maven.aliyun.com/repository/jcenter'}
            google()
            jcenter()
        }

        dependencies {
            classpath 'com.android.tools.build:gradle:3.2.1'
        }
    }

    allprojects {
        repositories {
            // maven 阿里镜像地址
            maven{ url 'https://maven.aliyun.com/repository/google'}
            maven{ url 'https://maven.aliyun.com/repository/gradle-plugin'}
            maven{ url 'https://maven.aliyun.com/repository/public'}
            maven{ url 'https://maven.aliyun.com/repository/jcenter'}
            google()
            jcenter()
        }
    }
```

修改flutter\packages\flutter_tools\gradle\flutter.gradle配置
```
    buildscript {
        repositories {
            // maven 阿里镜像地址
            maven{ url 'https://maven.aliyun.com/repository/google'}
            maven{ url 'https://maven.aliyun.com/repository/gradle-plugin'}
            maven{ url 'https://maven.aliyun.com/repository/public'}
            maven{ url 'https://maven.aliyun.com/repository/jcenter'}
            google()
            jcenter()
        }
        dependencies {
            classpath 'com.android.tools.build:gradle:3.2.1'
        }
    }
```

