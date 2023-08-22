import { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
import useGetUserInfo from "@/hooks/useGetUserInfo";
// 全局样式
import "@nutui/nutui-react-taro/dist/style.css";
import "./app.scss";

function App(props) {
  const { fetchUserInfo } = useGetUserInfo();
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {
    fetchUserInfo();
  });

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
