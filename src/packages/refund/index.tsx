import { useState, useEffect } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { getOrderInfo, postOrderRefund } from "@/api/order";
import { useRequest } from "ahooks";
import { InputNumber, TextArea, Button } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import right from "@/assets/public/right.svg";
import ChooseModal from "./ChooseModal";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";

const Refund = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();
  const { params } = useRouter();
  const { outOrderNo } = params;
  const [refundType, setRefundType] = useState<string[]>([]);
  const [other, setOther] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { data } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });
  const { runAsync, loading } = useRequest(postOrderRefund, { manual: true });
  const [refundNum, setRefundNum] = useState<number>(1);

  useEffect(() => {
    setRefundNum(data?.data.number);
  }, [data]);

  // 提交
  const handleSubmit = () => {
    if (!refundType && other === "") {
      Taro.showToast({
        title: "请选择退款原因",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    runAsync({
      refundType: [...refundType, other].join(";"),
      message,
      refundNum,
      outOrderNo,
    }).then((res) => {
      if (res.code === 200) {
        Taro.showToast({
          title: "提交成功，请耐心等待",
          icon: "success",
          duration: 1000,
        });
        Taro.redirectTo({
          url: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
        });
      }
    });
  };
  const handleConfirm = ({ reason, textArea }) => {
    setVisible(false);
    setOther(textArea);
    setRefundType(reason);
  };
  return (
    <View className="refund">
      <ChooseModal
        other={other}
        refundType={refundType}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
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
            onClick={() => setVisible(true)}
          >
            <View className="refund-selected-right-text">
              {`${refundType.join(";")} ${
                other
                  ? refundType && refundType.length
                    ? `;${other}`
                    : other
                  : ""
              }` || "请选择"}
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
        <Button block type="primary" onClick={handleSubmit} loading={loading}>
          提交
        </Button>
      </View>
    </View>
  );
};
export default Refund;
