import { useState, useEffect } from "react";
import { SearchBar, Grid } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import bg from "@/assets/user/bg.png";
import { View } from "@tarojs/components";
import { getGoodsList } from "@/api";
import GoodItem from "./GoodItem";
import { Datum } from "./index.d";
import "./index.scss";

const Index = () => {
  const [name, setName] = useState<string>("");
  const [list, setList] = useState<Datum[]>([]);
  const data = [
    {
      name: "电热水器全拆洗",
      url: bg,
      originPrice: "1980",
      countPrice: "2000",
    },
    {
      name: "电热水器全拆洗",
      url: bg,
      originPrice: "1980",
      countPrice: "2000",
    },
    {
      name: "电热水器全拆洗",
      url: bg,
      originPrice: "1980",
      countPrice: "2000",
    },
    {
      name: "电热水器全拆洗",
      url: bg,
      originPrice: "1980",
      countPrice: "2000",
    },
    {
      name: "电热水器全拆洗",
      url: bg,
      originPrice: "1980",
      countPrice: "2000",
    },
  ];
  useEffect(() => {
    getGoodsList({
      name,
    }).then((res) => {
      console.log("res", res);
    });
  }, [name]);
  return (
    <View className="home">
      <SearchBar
        placeholder="请输入关键字"
        onSearch={(value) => setName(value)}
      />
      <Grid columns={2}>
        {data.map((v, i) => (
          <Grid.Item
            key={i}
            onClick={() =>
              Taro.navigateTo({
                url: "/packages/detail/index",
              })
            }
          >
            <GoodItem
              src={v.url}
              name={v.name}
              originPrice={v.originPrice}
              countPrice={v.countPrice}
            />
          </Grid.Item>
        ))}
      </Grid>
    </View>
  );
};
export default Index;
