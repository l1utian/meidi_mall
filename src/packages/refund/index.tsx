import { useState, useEffect } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { getOrderInfo } from "@/api/order";
import { useRequest } from "ahooks";
import { InputNumber, TextArea, Button } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import right from "@/assets/public/right.svg";
import "./index.scss";

const Refund = () => {
  const { params } = useRouter();
  const { outOrderNo } = params;
  const { data } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });
  const [number, setNumber] = useState<number>(0);
  useEffect(() => {
    setNumber(data?.data.number);
  }, [data]);
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
          <View className="refund-info-orderStatus">
            {orderStatus[data?.data.orderStatus]}
          </View>
        </View>
        <View className="refund-info-item">
          <View className="refund-info-label">退款原因</View>
          <View
            className="refund-selected-right"
            onClick={() =>
              Taro.navigateTo({
                url: `/packages/chooseReason/index`,
              })
            }
          >
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
        <InputNumber
          value={number}
          min={1}
          max={data?.data.number}
          onChange={(v) => setNumber(Number(v))}
        />
      </View>
      <View className="refund-reason">
        <View className="refund-reason-item">
          <View className="refund-reason-label">申请总额</View>
          <View className="refund-reason-price">
            <Text className="refund-reason-price-symbol">￥</Text>
            <Text>{data?.data.price * number}</Text>
          </View>
        </View>
        <View className="refund-reason-status">
          <View className="refund-reason-status-label">订单状态</View>
          <View className="refund-reason-status-text">
            <TextArea placeholder="请填写申请退款的相关说明" maxLength={200} />
          </View>
        </View>
      </View>
      <View className="refund-bottom">
        <Button
          block
          type="primary"
          onClick={() => {
            Taro.navigateTo({
              url: "/packages/addAddress/index",
            });
          }}
        >
          提交
        </Button>
      </View>
    </View>
  );
};
export default Refund;
