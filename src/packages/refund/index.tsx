import { useState, useEffect } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useRouter, useDidShow, useDidHide } from "@tarojs/taro";
import { getOrderInfo, postOrderRefund } from "@/api/order";
import { useRequest } from "ahooks";
import { InputNumber, TextArea, Button } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import right from "@/assets/public/right.svg";
import "./index.scss";

const Refund = () => {
  const { params } = useRouter();
  const { outOrderNo } = params;
  const [refundType, setRefundType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { data } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });
  const { runAsync } = useRequest(postOrderRefund, { manual: true });
  const [refundNum, setRefundNum] = useState<number>(1);

  useEffect(() => {
    setRefundNum(data?.data.number);
  }, [data]);

  // 从本地缓存中获取退款理由
  useDidShow(() => {
    Taro.getStorage({
      key: "refund",
      success(result) {
        setRefundType(result?.data.reason + result?.data?.other);
      },
    });
  });

  //清楚本地缓存
  useDidHide(() => {
    Taro.removeStorage({ key: "refund" });
  });

  // 提交
  const handleSubmit = () => {
    if (!refundType) {
      Taro.showToast({
        title: "请选择退款原因",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    runAsync({
      refundType,
      message,
      refundNum,
      outOrderNo,
    }).then((res) => {
      if (res.code === 200) {
        Taro.navigateTo({
          url: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
        });
      }
    });
  };
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
            <View className="refund-selected-right-text">
              {refundType || "请选择"}
            </View>
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
          value={refundNum}
          min={1}
          max={data?.data.number}
          onChange={(v) => setRefundNum(Number(v))}
        />
      </View>
      <View className="refund-reason">
        <View className="refund-reason-item">
          <View className="refund-reason-label">申请总额</View>
          <View className="refund-reason-price">
            <Text className="refund-reason-price-symbol">￥</Text>
            <Text>{data?.data.price * refundNum}</Text>
          </View>
        </View>
        <View className="refund-reason-status">
          <View className="refund-reason-status-label">订单状态</View>
          <View className="refund-reason-status-text">
            <TextArea
              placeholder="请填写申请退款的相关说明"
              maxLength={200}
              value={message}
              onChange={(value) => setMessage(value)}
            />
          </View>
        </View>
      </View>
      <View className="refund-bottom">
        <Button block type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </View>
    </View>
  );
};
export default Refund;
