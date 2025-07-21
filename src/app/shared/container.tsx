import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <div className={`max-w-[1552px] mx-auto px-[16px] ${className}`}>
      {children}
    </div>
  );
}