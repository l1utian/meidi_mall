import { View, Image, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { getOrderInfo, postOrderContinuePay } from "@/api/order";
import { useRequest } from "ahooks";
import { InputNumber, Dialog } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import right from "@/assets/public/right.svg";
import "./index.scss";

const Refund = () => {
  const { params } = useRouter();
  const { outOrderNo } = params;
  const { data } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });
  const handleClick = () => {};
  return (
    <View className="refund">
      <View className="refund-good">
        <Image src={data?.data.picUrl} className="refund-good-img" />
        <View className="refund-good-detail">
          <Text className="refund-good-name">{data?.data.productName}</Text>
          <View className="refund-good-info">
            <View>
              <Text className="refund-good-symbol">￥</Text>
              <Text className="refund-good-price">{data?.data.price}</Text>
            </View>
            <View>
              <Text className="refund-good-num">×{data?.data.number}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="refund-info">
        <View className="refund-info-item">
          <View className="refund-info-label">订单状态</View>
          <View className="refund-info-content">
            {orderStatus[data?.data.orderStatus]}
          </View>
        </View>
        <View className="refund-info-item">
          <View className="refund-info-label">退款原因</View>
          <View className="refund-selected-right" onClick={handleClick}>
            <Text className="refund-selected-right-text">请选择</Text>
            <Image
              src={right}
              className="refund-selected-right-img"
              mode="widthFix"
            />
          </View>
        </View>
      </View>
      <View className="refund-num">
        <View className="refund-num-left">
          <Text className="refund-num-label">商品件数</Text>
          <Text className="refund-num-subLabel">{`(最多可退${data?.data.number}件)`}</Text>
        </View>
        <InputNumber defaultValue={1} />
      </View>
    </View>
  );
};
export default Refund;
