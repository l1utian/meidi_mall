import { CUSTOMER_SERVICE_DY_ID } from "@/config/base";
import useRequireLogin from "@/hooks/useRequireLogin";
import { useState, useEffect } from "react";
import { useRouter } from "@tarojs/taro";
import { View, Text, Button as TaroButton } from "@tarojs/components";
import {
  Swiper,
  SwiperItem,
  Divider,
  Button,
  Image,
} from "@nutui/nutui-react-taro";
import right from "@/assets/public/right.svg";
import message from "@/assets/public/message.svg";
import { getGoodsInfo } from "@/api/index";
import { baseUrl } from "@/utils/request";
import GoodModal from "./GoodModal";
import "./index.scss";

function Detail() {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();

  const { params } = useRouter();
  const { id } = params;
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [goodDetail, setGoodDetail] = useState<any>({});

  useEffect(() => {
    getGoodsInfo({ id }).then((res: any) => {
      setGoodDetail(res.data);
      setSelectedProduct(res.data.goodsProductList[0]);
    });
  }, [id]);

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
        onClose={handleClose}
      />
      <Swiper defaultValue={0} indicator height={224}>
        {goodDetail.gallery?.split(",").map((v, i) => (
          <SwiperItem key={i}>
            <Image mode="scaleToFill" src={baseUrl + v} height={224} />
          </SwiperItem>
        ))}
      </Swiper>
      <View className="detail-intro">
        <View className="detail-intro-top">
          <Text className="detail-intro-price">
            ￥{selectedProduct.retailPrice}
          </Text>
          <Text className="detail-intro-price-u">
            ¥{selectedProduct.counterPrice}
          </Text>
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
        <View dangerouslySetInnerHTML={{ __html: goodDetail.detail }}></View>
      </View>
      <View className="detail-bottom">
        <TaroButton
          className="detail-bottom-service"
          open-type="im"
          dataImId={CUSTOMER_SERVICE_DY_ID}
        >
          <Image
            src={message}
            mode="widthFix"
            className="detail-bottom-message"
          />
          <Text className="detail-bottom-text">联系客服</Text>
        </TaroButton>

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
