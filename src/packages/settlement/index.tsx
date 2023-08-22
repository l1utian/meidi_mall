import { useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { Price, Input, InputNumber, Button } from "@nutui/nutui-react-taro";
import { Text, View, Image } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { baseUrl } from "@/utils/request";
import { postOrderCreate } from "@/api/order";
import "./index.scss";

const Settlement = () => {
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
        if (res.code === 200) {
          tt.pay({
            orderInfo: res.data.options.orderInfo,
            service: 5,
            success: function (res: any) {
              // 0：支付成功
              // 1：支付超时
              // 2：支付失败
              // 3：支付关闭
              // 4：支付取消
              if (res.code === 0) {
                Taro.showToast({
                  title: "支付成功",
                  icon: "success",
                  duration: 1000,
                });
              }
              Taro.navigateTo({
                url: `/packages/orderDetail/index?outOrderNo=${res.data.outOrderNo}`,
              });
            },
            fail: function (err) {
              console.log("支付失败", err);
            },
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
          <Image src={baseUrl + url || ""} className="settlement-info-img" />
          <View className="settlement-info-right">
            <Text className="settlement-info-name">{productName}</Text>
            <View className="settlement-info-num">
              <Text>￥{retailPrice}</Text>
              <InputNumber
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
        <Price price={orderPrice} size="normal" thousands />
      </View>
      <View className="settlement-bottom">
        <View>
          <Text className="settlement-bottom-price">￥</Text>
          <Text className="settlement-bottom-num">{orderPrice}</Text>
        </View>
        <Button type="primary" onClick={handleSubmit}>
          提交订单
        </Button>
      </View>
    </div>
  );
};
export default Settlement;
