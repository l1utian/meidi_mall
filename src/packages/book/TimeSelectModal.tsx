import { Picker } from "@nutui/nutui-react-taro";
import "./modal.scss";
import { PickerOption } from "@nutui/nutui-react-taro/dist/types/packages/picker";

const GoodModal = ({
  visible,
  value,
  onClose,
  onConfirm,
  onChange,
  options,
}) => {
  const confirmPicker = (
    options: PickerOption[],
    values: (string | number)[]
  ) => {
    onConfirm(values);
  };

  return (
    <Picker
      className="time-select-modal"
      title="选择上门时间"
      visible={visible}
      options={options}
      onClose={onClose}
      value={value}
      onConfirm={(list, values) => confirmPicker(list, values)}
      onChange={onChange}
    />
  );
};
export default GoodModal;
