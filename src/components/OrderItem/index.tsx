import { View, Text, Image } from "@tarojs/components";
import { Divider } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import ButtonGroup from "@/components/ButtonGroup";
import "./index.scss";
import { completeImageUrl } from "@/utils/tool";
import { BASE_API_URL } from "@/config/base";

const Bottom = ({ info, onAction }) => {
  if (
    info?.orderStatus === 301 || // 退款中
    info?.orderStatus === 303 || // 退款失败
    info?.orderStatus === 401 // 已取消
  ) {
    return null;
  }
  return (
    <>
      <Divider className="orderItem-divider" style={{ color: "" }} />
      <View className="orderItem-bottom">
        <View>
          {info?.orderStatus === 302 ? (
            <Text className="orderItem-bottom-refund">
              退款成功 ¥{info?.orderPrice || 0}
            </Text>
          ) : info?.appointmentDate && info?.appointmentTime ? (
            <Text className="orderItem-bottom-time">
              {`上门时间：${info?.appointmentDate} ${info?.appointmentTime}`}
            </Text>
          ) : null}
        </View>
        <View>
          <ButtonGroup onClick={onAction} status={info?.orderStatus} />
        </View>
      </View>
    </>
  );
};

const OrderItem = ({ info, onAction, onClick }) => {
  const handleAction = (key) => {
    onAction && onAction(key);
  };

  return (
    <View className="orderItem-container">
      <View onClick={onClick}>
        <View className="orderItem-title">
          <Text className="orderItem-title-time">
            下单时间：{info?.orderTime}
          </Text>
          <Text className="orderItem-title-status">
            {orderStatus[info?.orderStatus]}
          </Text>
        </View>
        <View className="orderItem-good">
          <Image
            src={completeImageUrl(info?.picUrl, BASE_API_URL)}
            className="orderItem-good-img"
          />
          <View className="orderItem-good-detail">
            <Text className="orderItem-good-name">{info?.productName}</Text>
            <View className="orderItem-good-info">
              <View>
                <Text className="orderItem-good-symbol">￥</Text>
                <Text className="orderItem-good-price">{info?.price}</Text>
              </View>
              <View>
                <Text className="orderItem-good-num">×{info?.number}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="orderItem-total">
          <View>
            <Text className="orderItem-total-num">共{info?.number}件</Text>
          </View>
          <View>
            <Text className="orderItem-total-label">合计：</Text>
          </View>
          <View>
            <Text className="orderItem-total-symbol">￥</Text>
            <Text className="orderItem-total-price">{info?.orderPrice}</Text>
          </View>
        </View>
        <Bottom info={info} onAction={handleAction} />
      </View>
    </View>
  );
};
export default OrderItem;
