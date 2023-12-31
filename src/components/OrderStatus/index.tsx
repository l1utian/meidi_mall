import { View, Image, Text } from "@tarojs/components";
import status_book from "@/assets/components/status_book.svg";
import status_pay from "@/assets/components/status_pay.svg";
import status_finish from "@/assets/components/status_finish.svg";
import status_service from "@/assets/components/status_service.svg";
import order_bg from "@/assets/components/order_bg.png";
import { CountDown } from "@nutui/nutui-react-taro";

import "./index.scss";

interface OrderStatusProps {
  status: number;
  validPayTime?: number;
  onRefresh?: any;
}
const OrderStatus = ({ status, validPayTime, onRefresh }: OrderStatusProps) => {
  const statusInfo = {
    101: {
      status: "待支付",
      tip: "请完成支付，00：00：00后将取消订单",
      icon: status_pay,
    },
    201: {
      status: "待预约",
      tip: "订单未预约，请尽快预约哦",
      icon: status_book,
    },
    202: {
      status: "待服务",
      tip: "请耐心等待",
      icon: status_service,
    },
    203: {
      status: "服务中",
      tip: "",
      icon: status_finish,
    },
    204: {
      status: "已完工",
      // tip: "订单已完成，致力于为您提供更好的服务",
      // icon: status_service,
      tip: "",
      icon: status_service,
    },
    205: {
      status: "已完成",
      tip: "订单已完成，致力于为您提供更好的服务",
      icon: status_service,
    },
    301: {
      status: "退款中",
      tip: "",
      icon: status_service,
    },
    //退款完成
    302: {
      status: "已退款",
      tip: "",
      icon: status_finish,
    },
    //退款失败
    303: {
      status: "退款失败",
      tip: "",
      icon: status_pay,
    },
    //已取消
    401: {
      status: "已取消",
      tip: "",
      icon: status_pay,
    },
  };
  return (
    <View
      className="order-status"
      style={{
        backgroundImage: `url(./assets/components/order_bg.png)`,
      }}
    >
      <Image
        src={order_bg}
        style={{
          display: "none",
        }}
      ></Image>
      <View className="order-status-top">
        <Image
          className="order-status-top-icon"
          src={statusInfo[status]?.icon}
          mode="widthFix"
        />
        <Text style={{ fontWeight: "bold" }}>{statusInfo[status]?.status}</Text>
      </View>
      <View className="order-status-bottom">
        {status === 101 ? (
          <View className="order-status-paying">
            <Text>请完成支付，</Text>

            <CountDown
              remainingTime={validPayTime}
              autoStart={true}
              onEnd={onRefresh}
            />

            <Text style={{ marginLeft: 4 }}>后将取消订单</Text>
          </View>
        ) : (
          <Text>{statusInfo[status]?.tip}</Text>
        )}
      </View>
    </View>
  );
};
export default OrderStatus;
