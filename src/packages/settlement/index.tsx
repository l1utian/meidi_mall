import { useMemo, useState } from "react";
import { Price, Input, InputNumber, Button } from "@nutui/nutui-react-taro";
import { Text, View, Image } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { BASE_API_URL } from "@/config/base";
import { postCreateOrderOptions } from "@/api/order";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";
import { loginWithCheckSession } from "@/utils/TTUtil";
import { completeImageUrl, multiply, onPayCallback } from "@/utils/tool";
import Taro from "@tarojs/taro";

const Settlement = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();
  const { params } = useRouter();

  const [number, setNumber] = useState<number | string>(1);
  const [message, setMessage] = useState<string>("");
  const { url, productCode, goodsId, productName, retailPrice }: any = params;
  const orderPrice = useMemo(() => {
    return multiply(retailPrice || 0, Number(number));
  }, [retailPrice, number]);
  console.log(params);

  const handleSubmit = () => {
    Taro.showLoading({
      title: "加载中",
      mask: true,
    });

    if (Number(number) > 100) {
      Taro.showToast({
        title: "最多购买100件",
        icon: "none",
        duration: 1000,
      });
      return;
    }
    postCreateOrderOptions({
      goodsId,
      productCode,
      number,
      orderPrice,
      message,
    })?.then((res) => {
      if (res?.code === 200) {
        const options = res?.data?.options;
        loginWithCheckSession()?.then(() => {
          tt.createOrder({
            ...options,
            success: (res) => {
              const { orderId, outOrderNo } = res;
              console.log("orderId", orderId, "outOrderNo", outOrderNo);
              Taro.hideLoading();
              onPayCallback({
                redirectTo: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
              });
            },
            fail: (res) => {
              Taro.hideLoading();
              const { orderId, outOrderNo, errNo, errMsg, errLogId } = res;
              if (errLogId) {
                setTimeout(() => {
                  Taro.showToast({
                    title: "下单失败",
                    icon: "none",
                    duration: 1000,
                  });
                }, 300);
                console.log("预下单失败", errNo, errMsg, errLogId);
              }
              if (orderId || outOrderNo) {
                console.log("支付失败", errNo, errMsg, orderId, outOrderNo);
                onPayCallback({
                  redirectTo: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
                });
              }
              console.log(errNo, errMsg);
            },
          });
        });
      }
    });

    // tt.createOrder({
    //   goodsList: [
    //     {
    //       quantity: number, // 购买数量 必填
    //       price: retailPrice * 100, // 商品价格 必填

    //       goodsName: productName, // 商品名称 必填
    //       goodsPhoto: completeImageUrl(url, BASE_API_URL as string) || "", // 商品图片链接 必填
    //       goodsId: "7287173073286006821", // 商品ID 必填
    //       // goodsId: "XYJ-BX00001", // 商品ID 必填
    //       goodsType: 1, // 商品类型 必填

    //       goodsLabels: [], // 商品标签 非必填
    //       dateRule: "", // 使用规则 非必填
    //     },
    //   ],
    //   callbackData: {
    //     message,
    //     userId: 1,
    //     orderPrice,
    //     productCode,
    //   },
    //   payment: {
    //     totalAmount: orderPrice * 100, // 订单总价 必填
    //   },
    //   // contactInfo: {
    //   //   phoneNumber: "12345678901", // 手机号 非必传
    //   //   contactName: "test name", // 姓名 非必传
    //   // },
    //   note: message, // 备注 非必传

    //   // storeInfo: {
    //   //   storeName: "test store", // 商店名称 非必传
    //   //   storeIcon:
    //   //     "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ibaotu.com%2Fgif%2F19%2F48%2F47%2F76Z888piCd6W.gif%21fwpaa50%2Ffw%2F700&refer=http%3A%2F%2Fpic.ibaotu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644654365&t=5fc9b5fdad0a16264a9a9c09c14b3af9", // 商店头像 非必填
    //   // },
    //   // callbackData: { test: 999999 }, // 透传数据，开发者自定义字段 非必传
    //   // tradeOption: {
    //   //   life_trade_flag: 1, // 0：非融合链路（默认值）  1：走融合链路（标准融合/完全融合）
    //   // }, // 透传数据，开发者自定义字段 非必传

    //   success: (res) => {
    //     const { orderId, outOrderNo } = res;
    //     console.log("success res", res);
    //     console.log("orderId", orderId, "outOrderNo", outOrderNo);
    //     // this.setData({ orderId, outOrderNo });
    //   },
    //   fail: (res) => {
    //     const { orderId, outOrderNo, errNo, errMsg, errLogId } = res;
    //     if (errLogId) {
    //       console.log("预下单失败", errNo, errMsg, errLogId);
    //     }
    //     if (orderId || outOrderNo) {
    //       console.log("支付失败", errNo, errMsg, orderId, outOrderNo);
    //     }
    //     console.log(errNo, errMsg);
    //   },
    // });
    // postOrderCreate({ message, number, orderPrice, productCode })
    //   .then((res: any) => {
    //     const orderInfo = res?.data?.options?.orderInfo;
    //     const orderNo = res?.data?.outOrderNo;
    //     if (res?.code === 200) {
    //       console.log("开始");

    //       tt.createOrder({
    //         goodsList: [
    //           {
    //             quantity: 1, // 购买数量 必填
    //             price: 1, // 商品价格 必填

    //             goodsName: "测试商品", // 商品名称 必填
    //             goodsPhoto:
    //               "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ibaotu.com%2Fgif%2F19%2F48%2F47%2F76Z888piCd6W.gif%21fwpaa50%2Ffw%2F700&refer=http%3A%2F%2Fpic.ibaotu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644654365&t=5fc9b5fdad0a16264a9a9c09c14b3af9", // 商品图片链接 必填
    //             goodsId: "7287173073286006821", // 商品ID 必填
    //             // goodsId: "XYJ-BX00001", // 商品ID 必填
    //             goodsType: 1, // 商品类型 必填

    //             goodsLabels: ["不可退"], // 商品标签 非必填
    //             dateRule: "", // 使用规则 非必填
    //           },
    //         ],
    //         callbackData: {
    //           message: "这是留言",
    //           userId: 1,
    //           orderPrice: 179,
    //           productCode: "XYJ-BX00001",
    //         },
    //         payment: {
    //           totalAmount: 17900, // 订单总价 必填
    //         },
    //         // contactInfo: {
    //         //   phoneNumber: "12345678901", // 手机号 非必传
    //         //   contactName: "test name", // 姓名 非必传
    //         // },
    //         note: "for future", // 备注 非必传

    //         storeInfo: {
    //           storeName: "test store", // 商店名称 非必传
    //           storeIcon:
    //             "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ibaotu.com%2Fgif%2F19%2F48%2F47%2F76Z888piCd6W.gif%21fwpaa50%2Ffw%2F700&refer=http%3A%2F%2Fpic.ibaotu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644654365&t=5fc9b5fdad0a16264a9a9c09c14b3af9", // 商店头像 非必填
    //         },
    //         // callbackData: { test: 999999 }, // 透传数据，开发者自定义字段 非必传
    //         // tradeOption: {
    //         //   life_trade_flag: 1, // 0：非融合链路（默认值）  1：走融合链路（标准融合/完全融合）
    //         // }, // 透传数据，开发者自定义字段 非必传

    //         success: (res) => {
    //           const { orderId, outOrderNo } = res;
    //           console.log("success res", res);
    //           console.log("orderId", orderId, "outOrderNo", outOrderNo);
    //           // this.setData({ orderId, outOrderNo });
    //         },
    //         fail: (res) => {
    //           const { orderId, outOrderNo, errNo, errMsg, errLogId } = res;
    //           if (errLogId) {
    //             console.log("预下单失败", errNo, errMsg, errLogId);
    //           }
    //           if (orderId || outOrderNo) {
    //             console.log("支付失败", errNo, errMsg, orderId, outOrderNo);
    //           }
    //           console.log(errNo, errMsg);
    //         },
    //       });

    //       // loginWithCheckSession()?.then(() => {
    //       //   tt.pay({
    //       //     orderInfo,
    //       //     service: 5,
    //       //     success: function (res: any) {
    //       //       Taro.hideLoading();
    //       //       onPayCallback({
    //       //         redirectTo: `/packages/orderDetail/index?outOrderNo=${orderNo}`,
    //       //       });
    //       //     },
    //       //     fail: function (err) {
    //       //       console.log("支付失败", err);
    //       //       Taro.hideLoading();
    //       //     },
    //       //   });
    //       // });
    //     } else {
    //       Taro.hideLoading();
    //     }
    //   })
    //   ?.catch(() => {
    //     Taro.hideLoading();
    //   });
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
