import { Image } from "@tarojs/components";
import { getDoc } from "@/api/assets";
import { useRequest } from "ahooks";

const QualificationPage = () => {
  const { data } = useRequest(() => getDoc({ type: "3" }));

  return (
    <Image
      src={data?.data?.url}
      mode="widthFix"
      lazyLoad
      fadeIn
      style={{
        width: "100%",
      }}
    ></Image>
  );
};

export default QualificationPage;
