import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function BlockTitle({ children, className = "" }: Props) {
  return (
    <div
      className={clsx(
        "mt-[20px] sm:mt-[30px] font-[Stem] font-medium text-[24px] sm:text-[36px] text-black leading-[30px] sm:leading-[50px]",
        className
      )}
    >
      {children}
    </div>
  );
}