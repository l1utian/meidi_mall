import { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
// 全局样式
import "@nutui/nutui-react-taro/dist/style.css";
import "./app.scss";
import { getUserInfo } from "@/api/login";
import { userStore } from "@/store/user";

function App(props) {
  const { setUserProfile } = userStore();
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {
    // console.log("show");
    getUserInfo()?.then((res) => {
      if (res?.code === 200 && res?.data) {
        setUserProfile(res?.data);
      }
    });
  });

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
