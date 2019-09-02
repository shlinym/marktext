## Develop Warning

1. keyboard-layout module doesn't work under node@12

   There is a pull request trying to fix it but not be accepted.

   so

   ```shell
   brew install node@10
   ```

2. electron download in mainland is too slow, so use taobao source.

   .yarnrc is source configuration.

## How to develop

```
yarn install

yarn run dev
```



## API

```
project.js
管理rename这些的事件处理

menuItems.js
右键菜单定义

file.js
文件处理

sideBar/index.js
注册右键菜单

```


