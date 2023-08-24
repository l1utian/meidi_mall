import { View, Image } from "@tarojs/components";
import { Overlay } from "@nutui/nutui-react-taro";
import { Loading, ConfigProvider } from "@nutui/nutui-react-taro";
import close from "@/assets/components/close.svg";
import "./index.scss";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmLoading?: boolean;
}
const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    visible,
    title,
    content,
    cancelText = "取消",
    confirmText = "确认",
    onCancel,
    onConfirm,
    confirmLoading,
  } = props;

  return (
    <Overlay visible={visible} onClick={onCancel}>
      <View className="confirm-modal">
        <View
          className="confirm-modal__container"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="confirm-modal__close" onClick={onCancel}>
            <Image src={close} className="confirm-modal__close-icon" />
          </View>
          <View className="confirm-modal__title">{title}</View>
          <View className="confirm-modal__content">{content}</View>
          <View className="confirm-modal__footer">
            <View
              className="confirm-modal__button confirm-modal__button--cancel"
              onClick={onCancel}
            >
              {cancelText}
            </View>

            {confirmLoading ? (
              <View
                className="confirm-modal__button confirm-modal__button--confirm"
                onClick={onConfirm}
              >
                <ConfigProvider theme={{ nutuiLoadingIconSize: "18px" }}>
                  <Loading
                    type="circular"
                    style={{
                      marginRight: "3px",
                      marginTop: "4px",
                    }}
                  />
                </ConfigProvider>
                <View className="confirm-modal__button--confirm-disabled">
                  {confirmText}
                </View>
              </View>
            ) : (
              <View
                className="confirm-modal__button confirm-modal__button--confirm"
                onClick={onConfirm}
              >
                <View>{confirmText}</View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Overlay>
  );
};

export default ConfirmModal;
