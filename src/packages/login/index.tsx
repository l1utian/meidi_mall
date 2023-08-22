import { View, Text, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { Checkbox, Button } from "@nutui/nutui-react-taro";
import { login } from "@/api/login";
import { loginAndGetPhoneNumber } from "@/utils/TTUtil";
import logo from "@/assets/public/logo.png";
import "./index.scss";
import { useState } from "react";
import { navigateToPage } from "@/utils/route";
import useGetUserInfo from "@/hooks/useGetUserInfo";

const Login = () => {
  const { fetchUserInfo } = useGetUserInfo();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const handleErrorToast = () => {
    if (!checked) {
      Taro.showToast({
        title: "请阅读并勾选底部协议",
        icon: "none",
        duration: 2000,
      });
    }
  };

  const handleGetPhoneNumber = (e) => {
    loginAndGetPhoneNumber(e)
      ?.then((res) => {
        console.log(res);
        Taro.showLoading({
          title: "登录中...",
        });
        login(res)?.then((data) => {
          Taro.hideLoading();
          if (data?.code === 200) {
            const token = data?.token;
            const returnUrl = decodeURIComponent(router.params.returnUrl || "");
            if (token) {
              Taro.setStorageSync("token", token);
              fetchUserInfo()?.then(() => {
                Taro.showToast({
                  title: "登录成功",
                  icon: "success",
                  duration: 1000,
                });
                if (returnUrl) {
                  navigateToPage(returnUrl);
                } else {
                  // 如果没有返回的 URL，则跳转到默认页面
                  Taro.switchTab({
                    url: "/pages/index/index",
                  });
                }
              });
            }
          }
        });
      })
      .catch((err) => {
        const errMsg = err.errMsg;
        if (errMsg.includes("cancel")) {
          return;
        }
        Taro.hideLoading();
        Taro.showToast({
          title: errMsg,
          icon: "none",
          duration: 2000,
        });
      });
  };

  return (
    <View className="login">
      <View className="login-content">
        <Image src={logo} mode="widthFix" className="login-content-logo" />
        <Text className="login-content-title">美的洗悦家</Text>
        <Text className="login-content-slogen">深度精洗，惊喜你家</Text>
      </View>
      <Button
        block
        type="primary"
        open-type={checked ? "getPhoneNumber" : undefined}
        onClick={handleErrorToast}
        onGetPhoneNumber={handleGetPhoneNumber}
      >
        抖音手机号授权快捷登录
      </Button>
      <Checkbox
        label="已阅读并同意《洗悦家用户注册协议》、《洗悦家隐私政策》，若您的手机号未注册，将为您直接注册美的洗悦家账号"
        checked={checked}
        onChange={setChecked}
      />
    </View>
  );
};
export default Login;
