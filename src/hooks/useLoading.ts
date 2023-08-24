import { useEffect } from "react";
import Taro from "@tarojs/taro";

const useLoading = (loading) => {
  useEffect(() => {
    if (loading) {
      Taro.showLoading({
        title: "加载中",
      });
    } else {
      Taro.hideLoading();
    }
    return () => {
      Taro.hideLoading();
    };
  }, [loading]);
};

export default useLoading;
