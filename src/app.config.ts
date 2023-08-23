export default defineAppConfig({
  pages: ["pages/index/index", "pages/user/index"],
  subPackages: [
    {
      /**
       * 分包根路径
       * - 注意：不能放在主包pages目录下
       */
      root: "packages/detail",
      /**
       * 分包路径下的所有页面配置
       */
      pages: ["index"],
      /**
       * 分包别名，分包预下载时可以使用
       */
      name: "服务详情",
      /**
       * 分包是否是独立分包
       */
      independent: false,
    },
    {
      root: "packages/settlement",
      pages: ["index"],
      name: "结算页",
      independent: false,
    },
    {
      root: "packages/addressList",
      pages: ["index"],
      name: "选择地址",
      independent: false,
    },
    {
      root: "packages/addAddress",
      pages: ["index"],
      name: "添加地址",
      independent: false,
    },
    {
      root: "packages/editAddress",
      pages: ["index"],
      name: "地址编辑",
      independent: false,
    },
    {
      root: "packages/orderList",
      pages: ["index"],
      name: "订单列表",
      independent: false,
    },
    {
      root: "packages/book",
      pages: ["index"],
      name: "订单预约",
      independent: false,
    },
    {
      root: "packages/orderDetail",
      pages: ["index"],
      name: "订单详情",
      independent: false,
    },
    {
      root: "packages/aboutPage",
      pages: ["index"],
      name: "关于我们",
      independent: false,
    },
    {
      root: "packages/qualificationPage",
      pages: ["index"],
      name: "资质展示",
      independent: false,
    },
    {
      root: "packages/login",
      pages: ["index"],
      name: "登录",
      independent: false,
    },
    {
      root: "packages/refund",
      pages: ["index"],
      name: "售后/退款",
      independent: false,
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    selectedColor: "#0092D8",
    color: "#707075",
    borderStyle: "white",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/tabBar/home.svg",
        selectedIconPath: "./assets/tabBar/home_selected.svg",
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
        iconPath: "./assets/tabBar/my.svg",
        selectedIconPath: "./assets/tabBar/my_selected.svg",
      },
    ],
  },
});
