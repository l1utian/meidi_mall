import { View, Text, Image } from "@tarojs/components";
import { Divider } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import ButtonGroup from "@/components/ButtonGroup";
import "./index.scss";

const OrderItem = ({ info, onAction, onClick }) => {
  const handleAction = (key) => {
    onAction && onAction(key);
  };

  return (
    <View className="orderItem-container">
      <View onClick={onClick}>
        <View className="orderItem-title">
          <Text className="orderItem-title-time">
            下单时间：{info.orderTime}
          </Text>
          <Text className="orderItem-title-status">
            {orderStatus[info.orderStatus]}
          </Text>
        </View>
        <View className="orderItem-good">
          <Image src={info.picUrl} className="orderItem-good-img" />
          <View className="orderItem-good-detail">
            <Text className="orderItem-good-name">{info.productName}</Text>
            <View className="orderItem-good-info">
              <View>
                <Text className="orderItem-good-symbol">￥</Text>
                <Text className="orderItem-good-price">{info.price}</Text>
              </View>
              <View>
                <Text className="orderItem-good-num">×{info.number}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="orderItem-total">
          <View>
            <Text className="orderItem-total-num">共{info.number}件</Text>
          </View>
          <View>
            <Text className="orderItem-total-label">合计：</Text>
          </View>
          <View>
            <Text className="orderItem-total-symbol">￥</Text>
            <Text className="orderItem-total-price">{info.orderPrice}</Text>
          </View>
        </View>
      </View>
      <Divider className="orderItem-divider" style={{ color: "" }} />
      <View className="orderItem-bottom">
        <View>
          {info.appointmentDate && info.appointmentTime ? (
            <Text className="orderItem-bottom-time">
              {`上门时间：${info.appointmentDate} ${info.appointmentTime}`}
            </Text>
          ) : null}
        </View>
        <View>
          <ButtonGroup onClick={handleAction} status={info.orderStatus} />
        </View>
      </View>
    </View>
  );
};
export default OrderItem;
