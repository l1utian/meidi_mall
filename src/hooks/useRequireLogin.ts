import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { userStore } from "@/store/user"; // 导入你的用户状态存储

const useRequireLogin = () => {
  const isLoggedIn = userStore.getState().isLoggedIn();
  const router = useRouter(); // 使用 useRouter 获取当前路由信息

  useDidShow(() => {
    if (!isLoggedIn) {
      // 手动构建查询参数字符串，忽略$taroTimestamp
      const queryParams = router.params
        ? Object.keys(router.params)
            .filter((key) => key !== "$taroTimestamp")
            .map((key) => `${key}=${router.params[key]}`)
            .join("&")
        : "";
      const returnUrl = encodeURIComponent(
        router.path + (queryParams ? `?${queryParams}` : "")
      );
      console.log("returnUrl", returnUrl);
      router
        ? Taro.navigateTo({
            url: `/packages/login/index?returnUrl=${returnUrl}`,
          })
        : Taro.navigateTo({
            url: "/packages/login/index",
          });
      return null;
    }
  });
};

export default useRequireLogin;
