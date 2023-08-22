import Taro from "@tarojs/taro";

export const isTabPage = (url: string): boolean => {
  // 如果url以/开头，则移除/
  const newUrl = url.startsWith("/") ? url.substring(1) : url;

  // 获取app.json中的tabBar页面路径
  const app = Taro.getApp();
  const tabBarList = app?.config?.pages || [];
  // 检查传入的URL是否在tabBarList中
  return tabBarList.includes(newUrl);
};

//  跳转页面
export const navigateToPage = (url: string): void => {
  if (isTabPage(url)) {
    Taro.switchTab({ url });
  } else {
    Taro.navigateTo({ url });
  }
};
