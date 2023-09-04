# 美的洗悦家抖音小程序应用说明

这是基于`Taro3`开发的抖音小程序应用。以下是有关如何安装、运行和部署该应用的详细步骤。无论您是开发人员还是不太了解编程的人，都可以通过本指南轻松了解项目的基本操作。

## 🚀 开始之前

在开始操作前，请确保您的计算机上已安装了 [Node.js](https://nodejs.org/) 以及 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/)。

## 📦 安装项目依赖

首先，我们需要安装项目的依赖。依赖是项目运行所必需的外部库和框架。

1. 打开终端或命令行工具。
2. 在项目根目录下执行：

```bash
yarn install
```

或

```bash
npm install
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
npm run dev:tt
```

或

```bash
yarn dev:tt
```

### 生产环境

当您认为应用已经准备好并想要进行部署时，请执行：

```bash
npm run build:tt
```

或

```bash
yarn build:tt
```

## ⚙️ 配置项说明与设置

应用通过配置文件来适应不同的运行环境。以下是两个主要的配置文件及其对应的运行命令：

- **`.env.development`**: 对应开发环境。要在开发环境中运行应用，请使用以下命令：

```
npm dev:tt
```

或

```
yarn dev:tt
```

- **`.env.production`**: 对应生产环境。要在生产环境中部署应用，请使用以下命令：
  ```
  npm build:tt
  ```
  或
  ```
  yarn build:tt
  ```

### 如何设置

在每个环境文件中，您会看到类似于以下的变量设置：

```
TARO_APP_API_BASE_API_URL = http://example.com/api
```

请确保在设置时，不添加任何多余的符号，如双引号或分号。

### 配置项详解：

- **`TARO_APP_API_BASE_API_URL`**: 接口地址，用于连接后台数据。

  - 示例: `TARO_APP_API_BASE_API_URL = http://nj.cirscn.com:15581/h5api`

- **`TARO_APP_API_CUSTOMER_SERVICE_DY_ID`**: 客服抖音号。更多信息请查看[抖音 IM 客服接入指南](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/open-capacity/operation/customer-service/1)。

  - 示例: `TARO_APP_API_CUSTOMER_SERVICE_DY_ID = 1749153376`

- **`TARO_APP_API_APP_ID`**: 抖音 AppID，这是应用在抖音平台的唯一标识。

  - 示例: `TARO_APP_API_APP_ID = 3c06a5dc2a6249ce9899f656334e20e9`

- **`TARO_APP_API_APP_KEY`**: 抖音 AppKey，与 AppID 配合使用，确保数据的安全传输。
  - 示例: `TARO_APP_API_APP_KEY = 9b7ac73e644348bcba8a834df41c70b2`

> ⚠️ **重要提醒**: 在修改配置文件时，请确保您了解每个配置项的含义，避免不必要的错误。同时，务必保证`AppKey`的安全，避免泄露。
