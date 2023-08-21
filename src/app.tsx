import { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
import { ConfigProvider } from "@nutui/nutui-react-taro";
// 全局样式
import "@nutui/nutui-react-taro/dist/style.css";
import "./app.scss";

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});
  const darkTheme = {
    nutuiBrandColor: "green",
    nutuiBrandColorStart: "green",
    nutuiBrandColorEnd: "green",
  };
  return <ConfigProvider theme={darkTheme}>{props.children}</ConfigProvider>;
}

export default App;
