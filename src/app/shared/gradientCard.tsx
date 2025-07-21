import { FC } from "react";
import clsx from "clsx";

type Props = {
  title: string;
  iconClass: string;
  className?: string;
};

const GradientCard: FC<Props> = ({ title, iconClass, className }) => {
  return (
    <div
      className={clsx(
        "cursor-pointer pt-[20px] px-[20px] sm:pt-[30px] relative min-h-[160px] sm:min-h-[180px]  max-w-[100%] flex-[40%] w-full md:max-w-[240px] w-full rounded-[20px] overflow-hidden group",
        className
      )}
    >
      <div className="absolute inset-0 z-0 bg-[linear-gradient(344.69deg,_#000000_22.16%,_#293651_78.78%)] transition-opacity duration-500 opacity-100 group-hover:opacity-0"></div>

      <div className="absolute inset-0 z-0 bg-[linear-gradient(140.82deg,_#2A86FF_3.2%,_#003172_47.46%,_#7D34D7_91.71%)] transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>

      <div className="relative z-10 flex flex-col h-full ">
        <i
          className={clsx(
            "icon text-[40px] bg-blue group-hover:bg-wheat2 transition-all duration-500",
            iconClass
          )}
        ></i>
        <p className="mt-[20px] text-[13px] max-w-[130px] md:text-[18px] leading-[100%] md:leading-[24px] font-normal font-[Stem] text-white">
          {title}
        </p>
      </div>
    </div>
  );
};

export default GradientCard;