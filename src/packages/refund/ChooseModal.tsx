import { View, Image } from "@tarojs/components";
import { useState } from "react";
import {
  Collapse,
  Checkbox,
  TextArea,
  Button,
  Popup,
} from "@nutui/nutui-react-taro";
import { Close } from "@nutui/icons-react-taro";
import top from "@/assets/public/top.svg";
import { data } from "./data";
import "./modal.scss";
import Taro from "@tarojs/taro";

const ChooseModal = ({ visible, onClose, onConfirm, other, refundType }) => {
  const [reason, setReason] = useState<string[]>(refundType);
  const [textArea, setTextArea] = useState<string>(other);

  const handleChange = (checked, value) => {
    if (checked) {
      setReason((list) => {
        return [...list, value];
      });
    } else {
      setReason((list) => list.filter((v) => v !== value));
    }
  };

  const handleConfirm = () => {
    const maxItems = textArea ? 19 : 20;
    if (reason?.length > maxItems) {
      Taro.showModal({
        title: "退款原因最多不能超过20项",
      });
      return;
    }
    onConfirm && onConfirm({ reason, textArea });
  };

  return (
    <Popup
      visible={visible}
      style={{ height: "70%" }}
      position="bottom"
      onClose={onClose}
      closeable={true}
      round={true}
      closeIcon={<Close size={12} />}
    >
      <View className="choose-reason">
        {data.map((v, i) => (
          <Collapse
            key={i}
            style={{ marginBottom: "10px" }}
            expandIcon={<Image src={top} style={{ width: "16px" }} />}
            defaultActiveName={["用户原因"]}
          >
            <Collapse.Item title={v.title} name={v.title}>
              {!!v.children.length ? (
                <View>
                  {v.children.map((item, index) => (
                    <Checkbox
                      checked={reason.some((v) => v === item.title)}
                      labelPosition="left"
                      value={item.title}
                      key={index}
                      onChange={(value) => handleChange(value, item?.title)}
                    >
                      {item.title}
                    </Checkbox>
                  ))}
                </View>
              ) : (
                <TextArea
                  maxLength={60}
                  value={textArea}
                  placeholder="如以上选项均与您的服务取消原因不符，可在此填写反馈"
                  onChange={(value) => setTextArea(value)}
                />
              )}
            </Collapse.Item>
          </Collapse>
        ))}
      </View>
      <View className="choose-reason-bottom">
        <Button block type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </View>
    </Popup>
  );
};
export default ChooseModal;
