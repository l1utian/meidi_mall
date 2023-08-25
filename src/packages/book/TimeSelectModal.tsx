import { TimeSelect } from "@nutui/nutui-react-taro";
import "./modal.scss";

const GoodModal = ({ visible, onConfirm, onClose }) => {
  const options = [
    {
      value: "2023-08-23",
      text: "2023-08-23",
      children: [
        { value: "8:00-10:00", text: "8:00-10:00" },
        { value: "10:00-12:00", text: "10:00-12:00" },
        { value: "13:00-15:00", text: "13:00-15:00" },
        { value: "15:00-17:00", text: "15:00-17:00" },
        { value: "17:00-19:00", text: "17:00-19:00" },
      ],
    },
    {
      value: "2023-08-24",
      text: "2023-08-24",
      children: [
        { value: "8:00-10:00", text: "8:00-10:00" },
        { value: "10:00-12:00", text: "10:00-12:00" },
        { value: "13:00-15:00", text: "13:00-15:00" },
        { value: "15:00-17:00", text: "15:00-17:00" },
        { value: "17:00-19:00", text: "17:00-19:00" },
      ],
    },
  ];
  const handleSelect = (value) => {
    onConfirm && onConfirm(value);
  };

  return (
    <TimeSelect
      visible={visible}
      options={options}
      style={{
        minHeight: "30%",
      }}
      onSelect={handleSelect}
      onTimeChange={onClose}
    />
  );
};
export default GoodModal;
