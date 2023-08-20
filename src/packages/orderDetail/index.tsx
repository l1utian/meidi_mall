import { Divider, Button } from "@nutui/nutui-react-taro";
import { View, Image, Text } from "@tarojs/components";
import bg from "@/assets/user/bg.png";
import OrderStatus from "@/components/OrderStatus";
import location from "@/assets/user/location.svg";
import ButtonGroup from "@/components/ButtonGroup";
import "./index.scss";

const OrderList = () => {
  return (
    <View className="orderDetail">
      <OrderStatus status={1} />
      <View className="orderDetail-content">
        <View className="orderDetail-address">
          <Image
            src={location}
            mode="widthFix"
            className="orderDetail-address-img"
          />
          <View className="orderDetail-address-info">
            <View className="orderDetail-address-top">
              <Text className="orderDetail-address-name">张静</Text>
              <Text>156****3795</Text>
            </View>
            <Text>
              江苏省南京市宝安区石岩街道塘头一号路口创维科技工业园2号楼333
            </Text>
          </View>
        </View>
        <View className="orderDetail-time">
          <Text>预约服务时间</Text>
          <Text>08-15 13:00-15:00</Text>
        </View>
        <View className="orderDetail-good">
          <Image src={bg} className="orderDetail-good-img" />
          <View className="orderDetail-good-detail">
            <Text className="orderDetail-good-name">【全拆洗】波轮洗衣机</Text>
            <View className="orderDetail-good-info">
              <Text className="orderDetail-good-price">￥39.00</Text>
              <Text className="orderDetail-good-num">×1</Text>
            </View>
          </View>
        </View>
        <View className="orderDetail-info">
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">订单编号</View>
            <View className="orderDetail-info-content">
              YHG8912345678
              <Button size="small" style={{ marginLeft: "12px" }}>
                复制
              </Button>
            </View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">下单时间</View>
            <View className="orderDetail-info-content">
              2023-08-15 12:00:16
            </View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">支付方式</View>
            <View className="orderDetail-info-content">在线支付</View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">备注留言</View>
            <View className="orderDetail-info-content">
              这里是备注留言这里是备注留言这里是备注留言
            </View>
          </View>
        </View>
        <View className="orderDetail-price">
          <View className="orderDetail-price-top">
            <Text>商品总额</Text>
            <Text className="orderDetail-price-top-num">¥30</Text>
          </View>
          <Divider className="orderDetail-price-middle" />
          <View className="orderDetail-price-bottom">
            <Text className="orderDetail-price-bottom-total">总计：</Text>
            <Text className="orderDetail-price-bottom-num">¥30</Text>
          </View>
        </View>
      </View>
      <View className="orderDetail-bottom">
        <ButtonGroup onClick={console.log} size="normal" />
      </View>
    </View>
  );
};
export default OrderList;
