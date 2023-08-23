import { View, Image, Text } from "@tarojs/components";
import status_book from "@/assets/components/status_book.svg";
import status_pay from "@/assets/components/status_pay.svg";
import status_finish from "@/assets/components/status_finish.svg";
import status_service from "@/assets/components/status_service.svg";
import "./index.scss";

const OrderStatus = ({ status }) => {
  const statusInfo = {
    201: {
      status: "待预约",
      tip: "订单未预约，请尽快预约哦",
      icon: status_book,
    },
    101: {
      status: "待支付",
      tip: "请完成支付，00：00：00后将取消订单",
      icon: status_pay,
    },
    202: {
      status: "待服务",
      tip: "请耐心等待",
      icon: status_service,
    },
    203: {
      status: "已完成",
      tip: "订单已完成，致力于为您提供更好的服务",
      icon: status_finish,
    },
  };
  return (
    <View
      className="order-status"
      style={{
        backgroundImage: `url(./assets/components/order_bg.png)`,
      }}
    >
      <View className="order-status-top">
        <Image
          className="order-status-top-icon"
          src={statusInfo[status]?.icon}
          mode="widthFix"
        />
        <Text>{statusInfo[status]?.status}</Text>
      </View>
      <View className="order-status-bottom">
        <Text>{statusInfo[status]?.tip}</Text>
      </View>
    </View>
  );
};
export default OrderStatus;
