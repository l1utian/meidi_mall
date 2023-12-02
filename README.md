# 美的洗悦家抖音小程序应用说明

这是基于`Taro3`开发的抖音小程序应用。以下是有关如何安装、运行和部署该应用的详细步骤。无论您是开发人员还是不太了解编程的人，都可以通过本指南轻松了解项目的基本操作。

## 🚀 开始之前

在开始操作前，请确保您的计算机上已安装了 [Node.js](https://nodejs.org/) 以及 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/)。

## 技术栈

- Taro
- React
- 抖音 API
- zustand
- ahooks

## 📦 安装项目依赖

首先，我们需要安装项目的依赖。依赖是项目运行所必需的外部库和框架。

1. 打开终端或命令行工具。
2. 在项目根目录下执行：

```bash
yarn install 或 npm install
```

> **小提示**: 如果您发现安装速度有点慢，可以先尝试更换为国内的 npm 镜像库地址，执行以下命令：
>
> ```bash
> npm config set registry https://registry.npmmirror.com/
> ```

## 🛠 开发与部署

### 开发环境

如果您希望在开发环境下运行项目（通常用于开发和测试），请执行：

```bash
npm run dev:tt 或 yarn dev:tt
```

### 生产环境

当您认为应用已经准备好并想要进行部署时，请执行：

```bash
npm run build:tt 或 yarn build:tt
```

## ⚙️ 配置项说明与设置

应用通过配置文件来适应不同的运行环境。以下是两个主要的配置文件及其对应的运行命令：

- **`.env.development`**: 对应开发环境。要在开发环境中运行应用，请使用以下命令：

```
npm dev:tt 或 yarn dev:tt
```

- **`.env.production`**: 对应生产环境。要在生产环境中部署应用，请使用以下命令：

```
npm build:tt 或 yarn build:tt
```

### 如何设置

在每个环境文件中，您会看到类似于以下的变量设置：

```
TARO_APP_API_BASE_API_URL = http://example.com/api
```

请确保在设置时，不添加任何多余的符号，如双引号或分号。

### 配置项详解：

- **`TARO_APP_API_BASE_API_URL`**: 接口地址，用于连接后台数据。

  - 示例: `TARO_APP_API_BASE_API_URL = https://mcts.midea.com/h5api`

- **`TARO_APP_API_APP_ID`**: 抖音 AppID，这是应用在抖音平台的唯一标识。

  - 示例: `TARO_APP_API_APP_ID = 3c06a5dc2a6249ce9899f656334e20e9`

- **`TARO_APP_API_APP_KEY`**: 抖音 AppKey，与 AppID 配合使用，确保数据的安全传输。
  - 示例: `TARO_APP_API_APP_KEY = 9b7ac73e644348bcba8a834df41c70b2`

> ⚠️ **重要提醒**: 在修改配置文件时，请确保您了解每个配置项的含义，避免不必要的错误。同时，务必保证`AppKey`的安全，避免泄露。

## 文件目录结构

```bash
.
├── .env.development #开发环境变量
├── .env.production  #生产环境变量
├── .gitignore       # git忽略欧洲
├── README.md        #项目说明
├── babel.config.js  #babel配置
├── config           #webpack配置
│   ├── dev.ts       #webpack开发配置
│   ├── index.ts     #webpack统一配置
│   └── prod.ts      #webpack生产配置
├── package.json     #应用依赖文件
├── project.config.json  # taro项目配置文件
├── project.private.config.json
├── project.tt.json   # taro 抖音陪着文件
├── src              #主应用路径
│   ├── api          #接口文件
│   │   ├── address.ts  # 地址
│   │   ├── assets.ts   # 获取公用资源
│   │   ├── good.ts     # 商品
│   │   ├── index.ts    # 主入口
│   │   ├── login.ts    #登录和用户信息
│   │   └── order.ts    # 订单
│   ├── app.config.ts   # 小程序配置
│   ├── app.scss        # 主样式文件
│   ├── app.tsx         #应用主入口
│   ├── assets          # 图片资源
│   ├── components      # 组件
│   │   ├── AboutContactSupport # 我的页面联系客服
│   │   ├── AddressItem         # 地址组件
│   │   ├── ButtonGroup         # 按钮组
│   │   ├── ConfirmModal        # 确定弹窗
│   │   ├── DetailContactSupport # 商品详情客服
│   │   ├── OrderItem            #订单详情组件
│   │   ├── OrderStatus          #订单状态
│   │   └── PageLoading          # 页面loading
│   ├── config           # 应用配置
│   ├── constants        # 应用常量
│   ├── hooks            # react钩子
│   │   ├── useAddress   # 地址
│   │   ├── useGetUserInfo #获取用户信息
│   │   ├── useImageDimension # 图片自适应（根据系统尺寸）
│   │   ├── useRequireLogin   # 是否需要登录
│   │   └── useThumbnailDimension # 图片自适应
│   ├── index.html
│   ├── packages             # 二级目录
│   │   ├── aboutPage        # 关于我们
│   │   ├── addAddress       # 添加地址
│   │   ├── addressList      # 选择地址
│   │   ├── book             # 订单预约
│   │   ├── chooseReason     # 选择退款原因
│   │   ├── detail           # 商品详情
│   │   ├── editAddress      # 地址编辑
│   │   ├── login            # 登录
│   │   ├── orderDetail      # 订单详情
│   │   ├── orderList        # 订单列表
│   │   ├── qualificationPage # 资质展示
│   │   ├── refund           # 售后/退款
│   │   └── settlement       # 结算页
│   ├── pages
│   │   ├── index             # 首页
│   │   └── user              # 我的页面
│   ├── store                 # 状态管理
│   │   ├── address           # 地址
│   │   └── user              #用户信息
│   ├── tt                    # 编译后需要放到dist文件夹的内容
│   └── utils                 # 项目工具
│   │   ├── request           # 请求库
│   │   ├── route             # 路由相关方法
│   │   ├── tool              # 通用工具
│   │   └── TTUtil            # 抖音api
├── tsconfig.json             # ts陪着
└──  types                    # ts类型定义
    ├── global.d.ts
    └── helperTypes.d.ts

```
