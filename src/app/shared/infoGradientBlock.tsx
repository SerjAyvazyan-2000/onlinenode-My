import { ReactNode } from "react";
import clsx from "clsx";

type InfoGradientBlockProps = {
  children: ReactNode;
  className?: string;
};

export default function InfoGradientBlock({
  children,
  className = "",
}: InfoGradientBlockProps) {
  return (
    <div
      className={clsx(
        "w-full mt-[60px] md:mt-[160px]  mx-auto max-w-[1520px] rounded-[30px] px-[30px] py-[30px] md:px-[120px] md:py-[60px] bg-gradient-to-r from-[#2A86FF] via-[#003172] to-[#7D34D7] shadow-[0_-4px_40px_0_rgba(224,224,224,0.5)]",
        className
      )}
    >
      <p className="font-[Stem] font-normal text-[16px] md:text-[30px] leading-[24px] md:leading-[50px] text-white">{children}</p>
    </div>
  );
}