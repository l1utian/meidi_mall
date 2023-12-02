import { View } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import "./index.scss";

export const data = {
  //待支付
  101: [
    {
      text: "继续付款",
      key: "continuePay",
      type: "primary",
    },
  ],
  //待预约
  201: [
    {
      text: "退款/售后",
      key: "refund",
    },
    {
      text: "立即预约",
      key: "book",
      type: "primary",
    },
  ],
  //待服务
  202: [
    {
      text: "退款/售后",
      key: "refund",
    },
  ],
  //服务中
  203: [
    {
      text: "退款/售后",
      key: "refund",
    },
    // {
    //   text: "确认服务完成",
    //   key: "confirm",
    //   type: "primary",
    // },
  ],
  //已完工
  204: [
    {
      text: "确认服务完成",
      key: "confirm",
      type: "primary",
    },
  ],
  //已完成
  205: [],
  //退款中
  301: [],
  //退款完成
  302: [],
  //退款失败
  303: [],
  //已取消
  401: [],
};

interface Props {
  onClick?: any;
  size?: any;
  status?: any;
  isDetail?: any;
}
const ButtonGroup = ({
  onClick,
  size = "small",
  status,
  isDetail = false,
}: Props) => {
  const handleClick = (key) => {
    onClick && onClick(key);
  };

  return data?.[status]?.length ? (
    <View
      className="button-group"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {data?.[status]?.map((v, i) => (
        <Button
          key={i}
          size={size}
          type={v.type || ""}
          block={data[status].length === 1 && isDetail}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(v.key);
          }}
        >
          {v.text}
        </Button>
      ))}
    </View>
  ) : null;
};
export default ButtonGroup;
