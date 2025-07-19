import React from "react";
import { Divider } from "../components/divider";
import { Badge } from "../components/badge";

export default function Stat({
  title,
  value,
  change,
  noDivider,
}: {
  title: string;
  value: string;
  change: string;
  noDivider: boolean;
}) {
  return (
    <div>
      {noDivider == null || (!noDivider && <Divider />)}
      <div className="mt-6 font-medium text-sm/6">{title}</div>
      <div className="mt-3 font-semibold text-2xl/8">{value}</div>
      {/* {change != null && <div className="mt-3 text-xs/6"> */}
      {/*    <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '} */}
      {/*    <span className="text-zinc-500">from last week</span> */}
      {/* </div>} */}
    </div>
  );
}
