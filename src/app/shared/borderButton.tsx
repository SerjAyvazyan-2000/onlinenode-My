import { ReactNode } from "react";
import clsx from "clsx";

type BordertButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  iconClass?: string;
};

export default function BorderButton({
  children,
  onClick,
  className = "",
  iconClass,
}: BordertButtonProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center gap-[20px] mt-[60px] md:mt-[80px]  max-w-fit h-[60px] mf:h-[70px] rounded-full border-2 border-black cursor-pointer transition-all duration-500 hover:bg-black hover:text-white group px-[30px] py-[22px] md:px-[40px] md:py-[18px] ",
        className
      )}
    >
      <span className="font-[Stem] font-medium text-[16px] md:text-[20px] text-black group-hover:text-white transition">
        {children}
      </span>
      {iconClass && (
        <i className={`icon ${iconClass} text-[22px] md:text-[27px] transition-all duration-500 bg-black group-hover:bg-white`}></i>
      )}
     
    </div>
  );
}