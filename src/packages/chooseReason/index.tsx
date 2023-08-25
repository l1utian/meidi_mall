import {
  Collapse,
  Checkbox,
  TextArea,
  Form,
  Button,
} from "@nutui/nutui-react-taro";
import { View, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import top from "@/assets/public/top.svg";
import { data } from "./data";
import "./index.scss";

const ChooseReason = () => {
  const form: any = Form.useForm();
  const handleChange = (value) => {
    if (!value?.reason && !value?.other) {
      Taro.showToast({
        icon: "none",
        title: "请选择退款原因",
        duration: 2000,
      });
      return;
    }
    Taro.setStorageSync("refund", {
      reason:
        value?.reason && value?.reason.length ? value?.reason.join(";") : "",
      other: value?.other || "",
    });
    Taro.navigateBack({
      delta: 1,
    });
  };

  return (
    <View className="choose-reason">
      <Form
        // form={form}
        onFinish={handleChange}
        footer={
          <View className="choose-reason-bottom">
            <Button block type="primary" formType="submit">
              确定
            </Button>
          </View>
        }
      >
        {data.map((v, i) => (
          <Collapse
            key={i}
            style={{ marginBottom: "10px" }}
            expandIcon={<Image src={top} style={{ width: "16px" }} />}
            defaultActiveName={["用户原因"]}
          >
            <Collapse.Item title={v.title} name={v.title}>
              {!!v.children.length ? (
                <Form.Item name="reason">
                  <Checkbox.Group direction="vertical" labelPosition="left">
                    {v.children.map((item, index) => (
                      <Checkbox value={item.title} key={index}>
                        {item.title}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              ) : (
                <Form.Item name="other">
                  <TextArea maxLength={200} />
                </Form.Item>
              )}
            </Collapse.Item>
          </Collapse>
        ))}
      </Form>
    </View>
  );
};
export default ChooseReason;
