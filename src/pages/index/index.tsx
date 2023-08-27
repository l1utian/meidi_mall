import { useState } from "react";
import { SearchBar, Grid } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getGoodsList } from "@/api";
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

  return (
    <View className="home">
      <SearchBar
        onClear={() => setName("")}
        className="search-bar"
        placeholder="请输入关键字"
        onChange={handleSearch}
      />
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
