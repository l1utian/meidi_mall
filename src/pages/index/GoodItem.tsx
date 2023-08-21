import { View, Image, Text } from "@tarojs/components";
import "./index.scss";

const GoodItem = ({ src, name, originPrice, countPrice }) => {
  return (
    <View className="goodItem">
      <Image className="goodItem-img" src={src} mode="widthFix" />
      <Text className="goodItem-name">{name}</Text>
      <View className="goodItem-price">
        <View>
          <Text className="goodItem-price-symbol">￥</Text>
          <Text className="goodItem-price-origin">{originPrice}</Text>
        </View>
        <Text className="goodItem-price-count">￥{countPrice}</Text>
      </View>
    </View>
  );
};
export default GoodItem;
