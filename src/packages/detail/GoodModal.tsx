import { Popup, Button } from "@nutui/nutui-react-taro";
import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { Close } from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";
import "./modal.scss";

const GoodModal = ({ visible, onClose, productList, selected }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(selected);
  const handleConfirm = () => {
    onClose && onClose(selectedProduct);
    Taro.navigateTo({
      url: `/packages/settlement/index?url=${selectedProduct.url}&productCode=${selectedProduct.productCode}&productName=${selectedProduct.productName}&retailPrice=${selectedProduct.retailPrice}`,
    });
  };
  useEffect(() => {
    setSelectedProduct(selected);
  }, [selected]);

  const handleClose = () => {
    onClose && onClose(selectedProduct);
  };
  return (
    <Popup
      visible={visible}
      position="bottom"
      onClose={handleClose}
      closeable={true}
      round={true}
      closeIcon={<Close size={12} />}
    >
      <View className="good-modal">
        <View className="good-modal-top">
          <View>
            <Text className="good-modal-symbol">￥</Text>
            <Text className="good-modal-price">
              {selectedProduct.retailPrice}
            </Text>
          </View>
          <View>
            <Text className="good-modal-price-u">
              ￥{selectedProduct.counterPrice}
            </Text>
          </View>
        </View>
        <View className="good-modal-middle">
          <View className="good-modal-list">
            <View className="good-modal-title">服务类型</View>
            {productList.map((v) => (
              <View
                className={`good-modal-info ${
                  selectedProduct.id === v.id ? "good-modal-info-selected" : ""
                }`}
                onClick={() => setSelectedProduct(v)}
                key={v.id}
              >
                <Text>{v.productName}</Text>
                <Text>{`¥${v.retailPrice}`}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="good-modal-bottom">
          <Button type="primary" block onClick={handleConfirm}>
            立即购买
          </Button>
        </View>
      </View>
    </Popup>
  );
};
export default GoodModal;
