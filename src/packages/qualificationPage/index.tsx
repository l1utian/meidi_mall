import { Image } from "@tarojs/components";
import { getDoc } from "@/api/assets";
import { useRequest } from "ahooks";

const qualificationPage = () => {
  const { data } = useRequest(() => getDoc({ type: "4" }));

  return (
    <Image
      src={data?.data?.url}
      mode="widthFix"
      style={{
        width: "100%",
      }}
    ></Image>
  );
};

export default qualificationPage;
