import { View, Image, Text } from "@tarojs/components";
import order_empty from "@/assets/user/order_empty.svg";
import "./Empty.scss";

const Empty = () => {
  return (
    <View className="order-empty">
      <Image src={order_empty} className="order-empty-icon"></Image>
      <Text className="order-empty-text">暂无订单</Text>
    </View>
  );
};
export default Empty;
