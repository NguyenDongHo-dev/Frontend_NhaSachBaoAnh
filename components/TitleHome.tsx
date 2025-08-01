import Image from "next/image";
import favicon from "../public/favicon.png";

interface IProps {
  children: React.ReactNode;
}
export default function TitleHome(props: IProps) {
  const { children } = props;
  return (
    <div className="uppercase flex items-center gap-5 pb-[20px] px-[15px]">
      <div className="aspect-[4/5] relative w-[42px] h-[45px]">
        <Image fill alt="favicon" src={favicon} className="object-contain" />
      </div>

      <h1 className="text-primary  text-[33px] font-bold md:text-[40px]">
        {children}
      </h1>
    </div>
  );
}
