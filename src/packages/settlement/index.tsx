import { useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { Price, Input, InputNumber, Button } from "@nutui/nutui-react-taro";
import { Text, View, Image } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { BASE_API_URL } from "@/config/base";
import { postOrderCreate } from "@/api/order";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";
import { loginWithCheckSession } from "@/utils/TTUtil";
import { completeImageUrl, onPayCallback } from "@/utils/tool";

const Settlement = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();
  const { params } = useRouter();

  const [number, setNumber] = useState<number | string>(1);
  const [message, setMessage] = useState<string>("");
  const { url, productCode, productName, retailPrice }: any = params;
  const orderPrice = useMemo(() => {
    return retailPrice * Number(number);
  }, [retailPrice, number]);

  const handleSubmit = () => {
    postOrderCreate({ message, number, orderPrice, productCode }).then(
      (res: any) => {
        const orderInfo = res?.data?.options?.orderInfo;
        const orderNo = res?.data?.outOrderNo;
        if (res?.code === 200) {
          loginWithCheckSession()?.then(() => {
            tt.pay({
              orderInfo,
              service: 5,
              success: function (res: any) {
                onPayCallback({
                  code: res.code,
                  redirectTo: `/packages/orderDetail/index?outOrderNo=${orderNo}`,
                });
              },
              fail: function (err) {
                console.log("支付失败", err);
              },
            });
          });
        }
      }
    );
  };
  return (
    <div className="settlement-container">
      <View className="settlement-info">
        <Text className="settlement-info-title">商品信息</Text>
        <View className="settlement-info-detail">
          <Image
            src={completeImageUrl(url, BASE_API_URL as string) || ""}
            className="settlement-info-img"
          />
          <View className="settlement-info-right">
            <Text className="settlement-info-name">{productName}</Text>
            <View className="settlement-info-num">
              <View className="settlement-info-num-left">
                <Text className="settlement-info-num-prefix">￥</Text>
                <Text className="settlement-info-num-text">{retailPrice}</Text>
              </View>

              <InputNumber
                className="settlement-info-num-right"
                defaultValue={number}
                onChange={(v) => setNumber(v)}
              />
            </View>
          </View>
        </View>
      </View>
      <View className="settlement-group">
        <View className="settlement-remark">
          <Text className="settlement-remark-label">备注留言</Text>
          <Input
            maxLength={200}
            placeholder="如有特殊需求可留言给服务人员"
            align="right"
            onChange={(value) => setMessage(value)}
          />
        </View>
        <View className="settlement-remark">
          <Text>支付方式</Text>
          <Text>在线支付</Text>
        </View>
      </View>
      <View className="settlement-total">
        <Text>商品总额</Text>
        <Price
          price={orderPrice}
          size="normal"
          thousands
          className="settlement-price"
        />
      </View>
      <View className="settlement-bottom">
        <View>
          <Text className="settlement-bottom-price">￥</Text>
          <Text className="settlement-bottom-num">{orderPrice}</Text>
        </View>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="settlement-bottom-submit"
        >
          提交订单
        </Button>
      </View>
    </div>
  );
};
export default Settlement;
