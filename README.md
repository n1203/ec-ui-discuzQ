# discuz-uniapp

![node version](https://img.shields.io/badge/node-%3E%3D10.13.0-blue)

## 授权声明

```
Copyright 2020, Tencent Cloud.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## 开始

1. 安装依赖
  ```
  npm install
  ```

**请注意：** node 版本需要大于 10.13.0 的稳定版。推荐可以使用 [nvm](https://github.com/nvm-sh/nvm) 进行 node 的多版本管理。

2. 本地开发时项目编译以及热加载
- H5 项目
  ```
  npm run dev:h5
  ```

- 小程序
  ```
  npm run dev:mp-weixin
  ```

  然后打开微信开发者工具，导入 `dist/dev/mp-weixin` 目录即可开发预览

3. 构建
- H5 项目构建
  ```
  npm run build:h5
  ```
  构建好的文件存放在 `dist/build/h5` 目录下

- 小程序项目构建
  ```
  npm run build:mp-weixin
  ```

  然后打开微信开发者工具，导入 `dist/build/mp-weixin` 目录

4. 开发工具推荐

    推荐使用 [VSCode](https://code.visualstudio.com/) 进行开发，针对此项目VSCode插件推荐安装：
   - Vetur
   - ESLint
   - Stylelint
   - Prettie
   - Vue VSCode Snippets
   - JavaScript(ES6) Snippets ESDoc

## 编码规范

1. [JavaScript 代码规范](./.github/JAVASCRIPT_STYLE.md)
2. [Css&Scss 代码规范](./.github/CSS_STYLE.md)
3. [命名约定](./.github/NAMING.md)

## 项目版本管理
1. [Git 分支开发工作流](./.github/GIT_BRANCH_FLOW.md)
2. [Git 提交规范](./.github/COMMIT_STYLE.md)

## 代码评审相关
1. [PR 说明](./.github/PR_TML.md)
2. 待补充

## 项目目录结构说明
```
|--.vscode                    vscode 编辑器的一些设置文件
|-- dist                      构建之后生成的目录
|-- .github                    规范说明 | github action 工作流（待完成）
|-- public                    H5 模板文件
|-- src                       项目的开发目录
| |-- api                     api 存放目录以及对于请求数据的处理存放目录
| | |-- api-request.js          api: 请求之前或者之后处理函数
| | |-- data-format.js          api: 数据处理文件
| | |-- index.js                api: 要请求的api定义
| |-- assets                  资源存放目录
| |-- common                  页面公用的部分存放的目录
| |-- components              页面公用的组件存放的目录
| |-- locale                  国际化设置目录（语言设置）
| |-- library                 存放一些第三方依赖库等
| |-- pages                   页面目录
| |-- store                   数据状态管理目录
| | |-- modules
| | |-- types
| | |-- index.js
| |-- styles                  公共样式存放目录
| | |-- base                    styles: 基础样式
| | | |-- mixin                 styles: mixin函数
| | | |-- theme                 styles: 主题皮肤配置
| | | |-- variable              styles: 变量
| | | |-- reset.scss            styles: 重置页面样式
| |-- utils                   常用函数存放目录
| |-- App.vue                 应用配置，用来配置App全局样式以及监听
| |-- main.js                 Vue 初始化入口文件
| |-- manifest.json           配置应用名称、appid、logo、版本等打包信息
| |-- pages.json              配置页面路由、导航条、选项卡等页面类信息
| |-- uni.scss                uni 全局样式变量
|-- .editorconfig             编辑器配置推荐
|-- .env.development          开发环境变量
|-- .env.production           生产环境变量
|-- .eslintignore             eslint 忽略的文件
|-- .eslintrc.js              eslint 配置文件
|-- .gitignore                git 提交忽略文件
|-- .npmrc                    安装 npm 包的部分设置
|-- .prettierignore           prettier 插件的设置
|-- babel.config.js           babel 配置文件
|-- commitlint.config.js      git commit 规范提交配置文件
|-- jsconfig.json             vscode 本地文件提示
|-- postcss.config.js         postcss 配置
|-- README.md                 项目说明文件
|-- stylelint.config.js       样式规范配置文件
|-- vue.config.js             vue-cli 自定义配置
```

## 依赖
1. [uni-app](https://uniapp.dcloud.io/)：基于 vue 的多端统一开发框架
2. [vue](https://cn.vuejs.org/index.html)：JavaScript 渐进式框架
3. [vuex](https://vuex.vuejs.org/zh/)：状态管理
4. [vue-i18n](https://kazupon.github.io/vue-i18n/zh/)：国际化
5. [jsonapi-vuex](https://github.com/mrichar1/jsonapi-vuex)：允许通过 vuex store 访问 [JSON:API](https://jsonapi.org/) web 服务中的数据。Discuz Q 接口使用的是 JSON:API 规范，所以使用这个库更加方便处理该请求和数据。

## TODO

- [ ] 单元测试
- [ ] 部署
- [ ] CI：Github Action
- [ ] CR 流程
