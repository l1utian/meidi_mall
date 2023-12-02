import { View, Text, Image } from "@tarojs/components";
import Taro, { useRouter, useDidShow } from "@tarojs/taro";
import { Checkbox, Button } from "@nutui/nutui-react-taro";
import { login, postUserInfo } from "@/api/login";
import {
  loginAndGetPhoneNumber,
  checkLogin,
  previewFile,
} from "@/utils/TTUtil";
import logo from "@/assets/public/logo.png";
import { useEffect, useState } from "react";
import { navigateToPage } from "@/utils/route";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { getDoc } from "@/api/assets";
import { useSetState } from "ahooks";
import ConfirmModal from "@/components/ConfirmModal";
import "./index.scss";

const Login = () => {
  const [code, setCode] = useState<any>("");
  const [visible, setVisible] = useState(false);
  const [assetsUrl, setAssetsUrl] = useSetState({
    // 注册协议
    registerAgreement: "",
    // 政策
    policy: "",
  });

  useDidShow(() => {
    checkLogin()?.then((res) => {
      setCode(res?.code);
    });
  });

  useEffect(() => {
    Promise.all([
      getDoc({
        type: "1",
      }),
      getDoc({
        type: "2",
      }),
    ])?.then(([res1, res2]) => {
      if (res1?.code === 200) {
        setAssetsUrl({
          registerAgreement: res1?.data?.url,
        });
      }
      if (res2?.code === 200) {
        setAssetsUrl({
          policy: res2?.data?.url,
        });
      }
    });
  }, []);

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

  const goRouter = () => {
    const returnUrl = decodeURIComponent(router.params.returnUrl || "");
    if (returnUrl) {
      navigateToPage(returnUrl);
    } else {
      // 如果没有返回的 URL，则跳转到默认页面
      Taro.switchTab({
        url: "/pages/index/index",
      });
    }
  };

  const handleGetPhoneNumber = (e) => {
    loginAndGetPhoneNumber(e, code)
      ?.then((res) => {
        login(res)?.then((data) => {
          if (data?.code === 200) {
            const token = data?.token;
            if (token) Taro.setStorageSync("token", token);

            // 如果不存在昵称，则跳转到完善信息弹窗
            if (!data?.nickname) {
              setVisible(true);
            } else {
              fetchUserInfo()?.then(() => {
                Taro.showToast({
                  title: "登录成功",
                  icon: "success",
                  duration: 1000,
                });
                goRouter();
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
        errMsg &&
          typeof errMsg === "string" &&
          Taro.showToast({
            title: errMsg,
            icon: "none",
            duration: 2000,
          });
      });
  };

  const handleCancel = () => {
    // 取消则跳转到首页
    setVisible(false);
    fetchUserInfo()?.then(() => {
      Taro.switchTab({
        url: "/pages/index/index",
      });
    });
  };
  const handleConfirm = () => {
    tt.getUserProfile({
      success: (res) => {
        postUserInfo({
          nickName: res?.userInfo?.nickName,
        })?.then((res) => {
          if (res?.code === 200) {
            fetchUserInfo()?.then(() => {
              Taro.showToast({
                title: "登录成功",
                icon: "success",
                duration: 1000,
              });
              goRouter();
            });
          }
        });
        console.log("success", res);
      },
      fail: () => {
        fetchUserInfo()?.then(() => {
          Taro.switchTab({
            url: "/pages/index/index",
          });
        });
      },
      complete: () => {
        setVisible(false);
      },
    });
  };

  return (
    <>
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
          label={
            <View>
              已阅读并同意
              <Text
                onClick={(e) => {
                  e.stopPropagation();
                  previewFile({
                    url: assetsUrl.registerAgreement,
                    fileName: "洗悦家用户注册协议",
                    fileType: "docx",
                  });
                }}
                style={{
                  color: "#3D6CFE",
                }}
              >
                《洗悦家用户注册协议》
              </Text>
              、
              <Text
                style={{
                  color: "#3D6CFE",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  previewFile({
                    url: assetsUrl.policy,
                    fileName: "洗悦家隐私政策",
                    fileType: "docx",
                  });
                }}
              >
                《洗悦家隐私政策》
              </Text>
              ，若您的手机号未注册，将为您直接注册美的洗悦家账号
            </View>
          }
          checked={checked}
          className="login-checkbox"
          onChange={setChecked}
        />
      </View>
      <ConfirmModal
        visible={visible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title="提示"
        confirmText="授权"
        content="申请获取您的抖音昵称"
      />
    </>
  );
};
export default Login;
