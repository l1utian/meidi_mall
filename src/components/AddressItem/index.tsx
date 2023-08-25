import { Cell, Divider, Checkbox } from "@nutui/nutui-react-taro";
import { View, Image, Text } from "@tarojs/components";
import del from "@/assets/components/del.svg";
import edit from "@/assets/components/edit.svg";
import "./index.scss";

type Props = {
  name: string;
  tel: string;
  location: string;
  isDefault: number;
  id: string | number;
};
interface IProps {
  info: Props;
  onClick?: any;
  onSelect?: any;
}
const AddressItem = ({ info, onClick, onSelect }: IProps) => {
  const { name, tel, location, isDefault, id } = info || {};
  const handleClick = (key) => {
    onClick && onClick({ key, id });
  };
  const handleSelect = () => {
    onSelect && onSelect();
  };
  return (
    <View className="address-item" onClick={handleSelect}>
      <Cell className="address-item-cell">
        <View className="address-item-top">
          <Text className="address-item-name">{name}</Text>
          <Text className="address-item-phone">{tel}</Text>
        </View>
        <Text className="address-item-middle">{location}</Text>
        <Divider
          style={{ color: "#d1d1d1", marginTop: "12px", marginBottom: "8px" }}
        />
        <View className="address-item-bottom">
          <Checkbox checked={isDefault === 1} label="默认地址" />
          <View className="address-item-action">
            <View
              className="address-item-icon"
              style={{ marginRight: "16px" }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick("edit");
              }}
            >
              <Image src={edit} mode="widthFix" style={{ width: "16px" }} />
              <Text>编辑</Text>
            </View>
            <View
              className="address-item-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleClick("delete");
              }}
            >
              <Image src={del} mode="widthFix" style={{ width: "16px" }} />
              <Text>删除</Text>
            </View>
          </View>
        </View>
      </Cell>
    </View>
  );
};
export default AddressItem;
