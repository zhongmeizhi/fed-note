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