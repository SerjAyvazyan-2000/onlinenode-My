import React from "react";

export default function Block({
  small,
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`mx-auto${
        small ? " max-w-4xl " : " max-w-7xl "
      }p-3 max-sm:p-0 grow rounded-lg ring-zinc-950/5`}
      style={{ background: "rgb(255, 255, 255, 0.4)", marginTop: 50 }}
    >
      <div
        className="mx-auto grow rounded-lg ring-1 ring-zinc-950/5"
        style={{ background: "rgb(255, 255, 255, 1)" }}
      >
        {children}
      </div>
    </div>
  );
}
