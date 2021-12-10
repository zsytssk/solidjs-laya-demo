## 说明

这是一个通过 SolidJs 渲染 Laya 的示例项目。
这样做有什么好处呢？

1. 用 jsx 来组织 UI（会 react 的人都知道这个好处）
2. 提供近似原生 js 代码的性能

在几年前我写一个 react-laya 类似项目，但是 react 写的 Laya 项目性能很差无法应用到实际的项目中；
这个项目提供的方案通过个人评估在实际的项目中可用。

## 流程介绍

1. `yarn install` 安装 npm 依赖包
2. 在 LayaAirIDE 2.0 以上版本打开项目， `f12` 发布项目
3. `yarn start` 运行本地项目
4. `yarn run uiToJsx` 将 Laya 编辑的 ui 文件转化成 JSX 文件放在 src/ui 中
   这些文件是默认 ignore，将相应的代码复制到 src/view 中编辑成自己想要的格式
5. 用 solidjs 愉快的编写自己的代码吧
6. `yarn run build` 发布项目

### 漂亮的截图

![demo](/demo.png)
