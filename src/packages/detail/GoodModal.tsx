import { Popup, Button } from "@nutui/nutui-react-taro";
import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { Close } from "@nutui/icons-react-taro";
import { postUserInfo } from "@/api/login";
import ConfirmModal from "@/components/ConfirmModal";
import { userStore } from "@/store/user";
import Taro from "@tarojs/taro";
import "./modal.scss";

const GoodModal = ({ picUrl, visible, onClose, productList, selected }) => {
  const { userProfile, setUserProfile } = userStore();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(selected);

  const handleConfirmGoods = () => {
    onClose && onClose(selectedProduct);
    Taro.navigateTo({
      url: `/packages/settlement/index?url=${picUrl}&productCode=${selectedProduct.productCode}&productName=${selectedProduct.productName}&retailPrice=${selectedProduct.retailPrice}&goodsId=${selectedProduct?.goodsId}`,
    });
  };

  const handleConfirmNickName = () => {
    tt.getUserProfile({
      success: (res) => {
        postUserInfo({
          nickName: res?.userInfo?.nickName,
        })?.then((userInfoRes) => {
          if (userInfoRes?.code === 200) {
            setUserProfile({
              ...userProfile,
              nickName: res?.userInfo?.nickName,
            });
            setConfirmVisible(false);
            handleConfirmGoods();
          }
        });
      },
      fail: () => {
        setConfirmVisible(false);
        Taro.showToast({
          title: "授权失败",
          icon: "none",
        });
      },
    });
  };

  const handleConfirm = () => {
    if (userProfile?.nickName) {
      handleConfirmGoods();
    } else {
      handleConfirmNickName();
    }
  };

  useEffect(() => {
    setSelectedProduct(selected);
  }, [selected]);

  const handleClose = () => {
    onClose && onClose(selectedProduct);
  };
  return (
    <>
      <ConfirmModal
        visible={confirmVisible}
        onCancel={() => {
          setConfirmVisible(false);
        }}
        onConfirm={handleConfirmNickName}
        title="提示"
        confirmText="授权"
        content="申请获取您的抖音昵称"
      />
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
                    selectedProduct.id === v.id
                      ? "good-modal-info-selected"
                      : ""
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
    </>
  );
};
export default GoodModal;
