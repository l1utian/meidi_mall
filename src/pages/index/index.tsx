import { useState } from "react";
import { SearchBar, Grid } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getGoodsList } from "@/api";
import { useRequest } from "ahooks";
import GoodItem from "./GoodItem";
import "./index.scss";

const Index = () => {
  const [name, setName] = useState<string>("");
  const { data }: any = useRequest(() => getGoodsList({ name }), {
    refreshDeps: [name],
  });
  const handleClick = (id) => {
    Taro.navigateTo({
      url: `/packages/detail/index?id=${id}`,
    });
  };

  return (
    <View className="home">
      <SearchBar
        className="search-bar"
        placeholder="请输入关键字"
        onChange={(value) => setName(value)}
      />

      <Grid columns={2}>
        {data?.data && data?.data.length
          ? data.data.map((v, i) => (
              <Grid.Item key={i} onClick={() => handleClick(v.id)}>
                <GoodItem
                  src={v.picUrl}
                  name={v.name}
                  retailPrice={v.retailPrice}
                  counterPrice={v.counterPrice}
                />
              </Grid.Item>
            ))
          : null}
      </Grid>
    </View>
  );
};
export default Index;
