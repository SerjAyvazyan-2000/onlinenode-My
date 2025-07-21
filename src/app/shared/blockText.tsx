import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function BlockText({ children, className = "" }: Props) {
  return (
    <div
      className={clsx(
        "mt-[20px] sm:mt-[30px] font-[Stem] font-normal text-[16px] sm:text-[20px] leading-[26px] sm:leading-[40px]  text-gray",
        className
      )}
    >
      {children}
    </div>
  );
}