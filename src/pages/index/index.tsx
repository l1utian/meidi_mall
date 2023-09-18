import { useState, useEffect } from "react";
import { SearchBar, Grid, Dialog } from "@nutui/nutui-react-taro";
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
import { userStore } from "@/store/user";

const Index = () => {
  const [name, setName] = useState<string>("");
  const isLoggedIn = userStore.getState().isLoggedIn();

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

  useEffect(() => {
    if (isLoggedIn) {
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
    }
  }, [isLoggedIn]);

  return (
    <View className="home">
      <SearchBar
        onClear={() => setName("")}
        className="search-bar"
        placeholder="请输入关键字"
        onChange={handleSearch}
      />
      <Dialog id="postOrderRefundFailCount" />

      <Grid columns={2}>
        {data?.data?.length ? (
          data.data.map((v, i) => (
            <Grid.Item key={i} onClick={() => handleClick(v.id)}>
              <GoodItem
                src={completeImageUrl(v.picUrl, BASE_API_URL)}
                name={v.name}
                retailPrice={v.retailPrice}
                counterPrice={v.counterPrice}
              />
            </Grid.Item>
          ))
        ) : loading ? null : (
          <View className="indexListEmpty">
            <Empty />
          </View>
        )}
      </Grid>
    </View>
  );
};
export default Index;
