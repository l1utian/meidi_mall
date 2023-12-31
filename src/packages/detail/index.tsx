import useRequireLogin from "@/hooks/useRequireLogin";
import { useState, useMemo } from "react";
import { useDidShow, useRouter } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import {
  Swiper,
  SwiperItem,
  Divider,
  Button,
  Image,
} from "@nutui/nutui-react-taro";
import right from "@/assets/public/right.svg";
import Taro from "@tarojs/taro";
import message from "@/assets/public/message.svg";
import { getGoodsInfo } from "@/api/index";
import { useRequest } from "ahooks";
import { BASE_API_URL } from "@/config/base";
import GoodModal from "./GoodModal";
import { completeImageUrl } from "@/utils/tool";
import "./index.scss";
import { getIm } from "@/api/assets";
import useImageDimension from "@/hooks/useImageDimension";

// 给所有 img 标签添加 mode
(Taro as any).options.html.transformElement = (el) => {
  if (el.nodeName === "image") {
    el.setAttribute("mode", "widthFix");
    el.setAttribute("lazyLoad", true);
    el.setAttribute("fadeIn", true);
  }
  return el;
};

function Detail() {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();
  const { calculatedHeight } = useImageDimension(750, 750);
  const [current, setCurrent] = useState(0);
  const handleChange = (e) => {
    setCurrent(e.detail.current);
  };
  const result = useRequest(getIm, {
    manual: true,
  });
  useDidShow(() => {
    result.runAsync();
  });
  const imId = useMemo(() => {
    const ids = result?.data?.data?.imId;
    if (!ids) return "";
    const idArray = ids.split(",");
    return idArray?.[0] || "";
  }, [result?.data]);

  const { params } = useRouter();
  const { id } = params;
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  const { data } = useRequest(() => getGoodsInfo({ id }), {
    refreshDeps: [id],
    onSuccess: (res) => {
      setSelectedProduct(res.data.goodsProductList[0]);
    },
  });

  const goodDetail = useMemo(() => data?.data || {}, [data]);

  const handleClose = (selected) => {
    setVisible(false);
    setSelectedProduct(selected);
  };

  return (
    <View className="detail-container">
      <GoodModal
        selected={selectedProduct}
        productList={goodDetail.goodsProductList || []}
        visible={visible}
        picUrl={goodDetail?.picUrl || ""}
        onClose={handleClose}
      />
      <div className="page">
        {current + 1} / {goodDetail.gallery?.split(",")?.length}
      </div>
      {calculatedHeight > 0 ? (
        <Swiper
          defaultValue={0}
          onChange={handleChange}
          height={calculatedHeight}
        >
          {goodDetail.gallery?.split(",").map((v, i) => (
            <SwiperItem key={i}>
              <Image
                mode="scaleToFill"
                src={completeImageUrl(v, BASE_API_URL as string)}
                height={calculatedHeight}
              />
            </SwiperItem>
          ))}
        </Swiper>
      ) : null}

      <View className="detail-intro">
        <View className="detail-intro-top">
          <View>
            <Text className="detail-intro-symbol">￥</Text>
            <Text className="detail-intro-price">
              {selectedProduct.retailPrice}
            </Text>
          </View>
          <View>
            <Text className="detail-intro-price-u">
              ¥{selectedProduct.counterPrice}
            </Text>
          </View>
        </View>
        <View className="detail-intro-bottom">
          {selectedProduct.productName || "-"}
        </View>
      </View>
      <View className="detail-selected">
        <Text className="detail-selected-left">已选服务</Text>
        <View
          className="detail-selected-right"
          onClick={() => setVisible(true)}
        >
          <Text>{selectedProduct.productName}</Text>
          <Image
            src={right}
            className="detail-selected-right-img"
            mode="widthFix"
          />
        </View>
      </View>
      <View className="detail-service">
        <Divider className="detail-divider">
          <Text style={{ color: "#333", fontWeight: 400 }}>服务详情</Text>
        </Divider>
        {goodDetail.detail ? (
          <View
            className="detail-content"
            dangerouslySetInnerHTML={{
              __html: `<div id="detail">${goodDetail.detail}</div>`,
            }}
          ></View>
        ) : null}
      </View>
      <View className="detail-bottom">
        {/* @ts-ignore */}
        <detail-contact-support imId={imId} goodsId={id}>
          <View className="detail-bottom-service">
            <Image
              src={message}
              mode="widthFix"
              className="detail-bottom-message"
            />
            <Text className="detail-bottom-text">联系客服</Text>
          </View>
          {/* @ts-ignore */}
        </detail-contact-support>

        <Button
          className="detail-bottom-btn"
          type="primary"
          onClick={() => setVisible(true)}
        >
          立即购买
        </Button>
      </View>
    </View>
  );
}

export default Detail;
