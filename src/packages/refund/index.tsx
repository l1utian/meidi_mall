import { useState } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { getOrderInfo, postCreateRefundOptions } from "@/api/order";
import { useRequest } from "ahooks";
import { TextArea, Button } from "@nutui/nutui-react-taro";
import { orderStatus } from "@/constants/order";
import right from "@/assets/public/right.svg";
import ChooseModal from "./ChooseModal";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";
import { multiply } from "@/utils/tool";
import { loginWithCheckSession } from "@/utils/TTUtil";

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
  const { runAsync } = useRequest(postCreateRefundOptions, { manual: true });

  // 提交
  const handleSubmit = () => {
    if (!refundType.length && other === "") {
      Taro.showToast({
        title: "请选择退款原因",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    Taro.showLoading({
      title: "加载中",
      mask: true,
    });
    runAsync({
      refundType: `${refundType.join(";")}${
        other ? (refundType && refundType.length ? `;${other}` : other) : ""
      }`,
      message,
      outOrderNo,
    }).then((res) => {
      if (res?.code === 200) {
        const options = res?.data?.options;
        console.log("options", options);

        loginWithCheckSession()?.then(() => {
          tt.applyRefund({
            ...options,
            success: (res) => {
              console.log("success", res);

              if (res?.refundId) {
                Taro.showToast({
                  title: "提交成功，请耐心等待",
                  icon: "success",
                  duration: 1000,
                });
                setTimeout(() => {
                  Taro.hideLoading();
                  Taro.redirectTo({
                    url: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
                  });
                }, 1300);
              }
            },
            fail: (res) => {
              console.log("fail", res);
              Taro.hideLoading();
              const { errMsg } = res;
              setTimeout(() => {
                Taro.showToast({
                  title: `申请失败, ${errMsg}`,
                  duration: 1000,
                });
              }, 300);
            },
          });
        });

        // Taro.showToast({
        //   title: "提交成功，请耐心等待",
        //   icon: "success",
        //   duration: 1000,
        // });
        // Taro.redirectTo({
        //   url: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
        // });
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
              {refundType.length || other !== ""
                ? `${refundType.join(";")} ${
                    other
                      ? refundType && refundType.length
                        ? `;${other}`
                        : other
                      : ""
                  }`
                : "请选择"}
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
        </View>
        <Text className="refund-num-subLabel">{`${data?.data.number} 件`}</Text>
      </View>
      <View className="refund-reason">
        <View className="refund-reason-item">
          <View className="refund-reason-label">申请总额</View>
          <View className="refund-reason-price">
            <Text className="refund-reason-price-symbol">￥</Text>
            <Text>
              {multiply(data?.data.price || 0, data?.data.number || 0)}
            </Text>
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
