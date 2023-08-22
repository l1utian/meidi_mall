import { useState, useEffect } from "react";
import { SearchBar, Grid } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getGoodsList } from "@/api";
import GoodItem from "./GoodItem";
import { Datum } from "./index.d";
import "./index.scss";

const Index = () => {
  const [name, setName] = useState<string>("");
  const [list, setList] = useState<Datum[]>([]);

  const handleClick = (id) => {
    Taro.navigateTo({
      url: `/packages/detail/index?id=${id}`,
    });
  };

  useEffect(() => {
    getGoodsList({
      name,
    }).then((res: any) => {
      setList(res.data);
    });
  }, [name]);

  return (
    <View className="home">
      <SearchBar
        placeholder="请输入关键字"
        onChange={(value) => setName(value)}
      />
      <Grid columns={2}>
        {list.map((v, i) => (
          <Grid.Item key={i} onClick={() => handleClick(v.id)}>
            <GoodItem
              src={v.picUrl}
              name={v.name}
              retailPrice={v.retailPrice}
              counterPrice={v.counterPrice}
            />
          </Grid.Item>
        ))}
      </Grid>
    </View>
  );
};
export default Index;
