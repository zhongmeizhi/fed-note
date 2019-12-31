# GitHub的Host和Key

### 解决GitHub不能访问的问题

1. 修改Host

    ```
      # github
      204.232.175.78 https://documentcloud.github.com
      207.97.227.239 https://github.com
      204.232.175.94 https://gist.github.com
      107.21.116.220 https://help.github.com
      207.97.227.252 https://nodeload.github.com
      199.27.76.130 https://raw.github.com
      107.22.3.110 https://status.github.com
      204.232.175.78 https://training.github.com
      207.97.227.243 https://www.github.com
    ```

2. 刷新DNS：控制台输入`ipconfig/flushdns`

### Git Key获取

1. 在git bash中运行`ssh-keygen -t rsa -C "git user"`
2. 此时会在`C:\Users\jack\.ssh`文件夹内生成`id_rsa.pub`和`id_rsa`
3. 复制`id_rsa.pub`的内容（就是key）
4. 放置于github -> setting -> SSH keys中（title随意）


