import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Divider } from "@nutui/nutui-react-taro";
import bg from "@/assets/user/bg.png";
import ButtonGroup from "./ButtonGroup";
import "./index.scss";

const OrderItem = () => {
  const handleAction = (key) => {
    switch (key) {
      case "book": //预约
        Taro.navigateTo({
          url: "/packages/book/index",
        });
        break;
      case "refund": //退款
        break;
      default:
        break;
    }
  };
  return (
    <View className="orderItem-container">
      <View className="orderItem-title">
        <Text className="orderItem-title-time">下单时间：08-15 12:00</Text>
        <Text className="orderItem-title-status">待预约</Text>
      </View>
      <View
        className="orderItem-good"
        onClick={() => {
          Taro.navigateTo({
            url: "/packages/orderDetail/index",
          });
        }}
      >
        <Image src={bg} mode="widthFix" className="orderItem-good-img" />
        <View className="orderItem-good-detail">
          <Text className="orderItem-good-name">
            【全拆洗】波轮洗衣机清洗波轮洗衣机清洗波轮洗衣机清洗
          </Text>
          <View className="orderItem-good-info">
            <Text className="orderItem-good-price">￥39.00</Text>
            <Text className="orderItem-good-num">×1</Text>
          </View>
        </View>
      </View>
      <View className="orderItem-total">
        <Text className="orderItem-total-num">共1件</Text>
        <Text className="orderItem-total-label">合计：</Text>
        <Text className="orderItem-total-price">￥39.00</Text>
      </View>
      <Divider style={{ color: "rgba(209, 209, 209, 0.60)" }} />
      <View className="orderItem-bottom">
        <Text className="orderItem-bottom-time">上门时间：08-15 </Text>
        <View>
          <ButtonGroup onClick={handleAction} />
        </View>
      </View>
    </View>
  );
};
export default OrderItem;
