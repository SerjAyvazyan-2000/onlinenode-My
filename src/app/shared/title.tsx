import { ElementType, ReactNode } from "react";
import clsx from "clsx";

type Props = {
  as?: ElementType;
  fontSize?: string;
  lineHeight?: string;
  className?: string;
  gradientText?: string;
  gradientStyle?: string;
  children?: ReactNode;
  reverse?: boolean; // 🔥 Новый парамет
};

export default function Title({
  as: Tag = "h1",
  fontSize,
  lineHeight,
  className = "",
  gradientText,
  gradientStyle,
  children,
  reverse = false,
}: Props) {
  const lines = typeof children === "string" ? children.split("\n") : [];

  return (
    <Tag
      className={clsx(
        "font-medium font-[Stem] text-center",
        fontSize,
        lineHeight,
        className
      )}
    >
      {/* Выводим сначала градиент или после — в зависимости от reverse */}
      {!reverse && gradientText && (
        <span
          className="bg-clip-text text-transparent block"
          style={{ backgroundImage: gradientStyle }}
        >
          {gradientText}
        </span>
      )}

      {typeof children === "string"
        ? (reverse ? lines.reverse() : lines).map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))
        : children}

      {reverse && gradientText && (
        <span
          className="bg-clip-text text-transparent "
          style={{ backgroundImage: gradientStyle }}
        >
          {gradientText}
        </span>
      )}
    </Tag>
  );
}