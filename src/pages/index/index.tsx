import { useState } from "react";
import { SearchBar, Dialog } from "@nutui/nutui-react-taro";
import { useDidShow } from "@tarojs/taro";

import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  getGoodsList,
  postOrderRefundFailCount,
  postOrderRefundFailRead,
} from "@/api";
import { useRequest } from "ahooks";
import { debounce, completeImageUrl } from "@/utils/tool";

import GoodItem from "./GoodItem";
import Empty from "./Empty";
import "./index.scss";
import { BASE_API_URL } from "@/config/base";

const Index = () => {
  const [name, setName] = useState<string>("");

  const { data, loading }: any = useRequest(() => getGoodsList({ name }), {
    refreshDeps: [name],
  });

  const handleSearch = debounce((value) => {
    setName(value);
  }, 300);

  const handleClick = (id) => {
    Taro.navigateTo({
      url: `/packages/detail/index?id=${id}`,
    });
  };

  const fetchOrderRefundFailCount = () => {
    postOrderRefundFailCount()?.then((res) => {
      if (res?.code === 200 && res?.data > 0) {
        Dialog.open("postOrderRefundFailCount", {
          content: "退款失败，请联系客服处理",
          hideCancelButton: true,
          footerDirection: "vertical",
          onConfirm() {
            postOrderRefundFailRead();
            Dialog.close("postOrderRefundFailCount");
          },
        });
      }
    });
  };

  // 从其他页面访问首页时
  useDidShow(() => {
    fetchOrderRefundFailCount();
  });

  return (
    <View
      className="home"
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <SearchBar
        onClear={() => setName("")}
        className="search-bar"
        placeholder="请输入关键字"
        onChange={handleSearch}
      />
      <Dialog id="postOrderRefundFailCount" />
      <View className="list">
        {data?.data?.length ? (
          data.data.map((v, i) => (
            <View key={i} onClick={() => handleClick(v.id)}>
              <GoodItem
                src={completeImageUrl(v.picUrl, BASE_API_URL)}
                name={v.name}
                retailPrice={v.retailPrice}
                counterPrice={v.counterPrice}
              />
            </View>
          ))
        ) : loading ? null : (
          <View className="indexListEmpty">
            <Empty />
          </View>
        )}
      </View>
    </View>
  );
};
export default Index;
