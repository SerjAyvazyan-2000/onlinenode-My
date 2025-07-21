import { ReactNode } from "react";
import clsx from "clsx";

type GradientButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  className = "",
}: GradientButtonProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative inline-flex gap-[20px] items-center justify-between px-[30px] md:px-[40px] py-[20px] h-[60px] md:h-[80px] rounded-[60px] cursor-pointer max-w-fit group transition-all duration-500 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(140.82deg,#2A86FF_3.2%,#003172_47.46%,#7D34D7_91.71%)] transition-opacity duration-500 opacity-100 group-hover:opacity-0 rounded-[60px]"></div>

      <div className="absolute inset-0 bg-white transition-opacity duration-500 opacity-0 group-hover:opacity-100 rounded-[60px]"></div>

      <span className="relative z-10 text-white text-[16px] md:text-[20px] laeding-[40px] font-medium font-[Stem] transition-all duration-500 group-hover:text-black">
        {children}
      </span>

     <i className={`icon icon-arrow text-[22px] md:text-[27px] transition-all duration-500 bg-white group-hover:bg-black`}></i>
    </div>
  );
}