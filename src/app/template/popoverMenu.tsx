import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React from "react";
import clsx from "clsx";

export default function PopoverMenu(props) {
  return (
    <Popover className="relative">
      <PopoverButton className={classes}>
        <span>{props.name}</span>
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-0 z-10 mt-1 flex w-screen max-w-max -translate-x-1/2 px-4 transition
            data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150
             data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="max-w-max overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
          <div className="p-4">
            {props.items.map((item) => (
              <div
                key={item.name}
                className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
              >
                <div
                  className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg
                                bg-gray-50 group-hover:bg-white"
                >
                  <item.icon
                    aria-hidden="true"
                    className="size-6 text-gray-600 group-hover:text-indigo-600"
                  />
                </div>
                <div>
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="font-semibold text-gray-900"
                  >
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                  <p className="mt-1 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

let classes = clsx(
  // Base
  "relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5",
  // Leading icon/icon-only
  "data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5",
  // Trailing icon (down chevron or similar)
  "data-[slot=icon]:last:[&:not(:nth-child(2))]:*:ml-auto data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-5 sm:data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-4",
  // Avatar
  "data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--avatar-radius:theme(borderRadius.DEFAULT)] data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6",
  // Hover
  "data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950",
  // Active
  "data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950",
  "focus:outline-none focus:ring-0",
);
