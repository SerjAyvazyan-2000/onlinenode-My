import React, { useState } from "react";
import NextLink from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

type CommonProps = ItemProps & {
  isStateConnected: boolean;
  openWalletView: (p: { view: string }) => void;
  setMobileMenuOpen: (p: boolean) => void;
};

type ItemProps = {
  name: string;
  onlyVisibleIfConnected?: boolean;
  isExpanded?: boolean;
  href?: string;
  isConnected?: boolean;
  onClick?: () => void;
  expandedItems?: ItemProps[];
};

export function MobileMenuLink({
  name,
  onlyVisibleIfConnected = false,
  isExpanded = false,
  href = "#",
  isConnected = false,
  onClick,
  expandedItems,
  isStateConnected,
  openWalletView,
  setMobileMenuOpen,
}: CommonProps) {
  const [isStateExpanded, setIsStateExpanded] = useState(false);

  if (onlyVisibleIfConnected && !isStateConnected) {
    return null;
  }

  if (isExpanded) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsStateExpanded(!isStateExpanded)}
          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-800 hover:bg-gray-50"
        >
          {name}
          <ChevronDownIcon
            className={`inline ml-2 h-5 w-5 text-gray-500 stroke-[2px] transform transition-transform duration-300
          ${isStateExpanded ? "-rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {isStateExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {expandedItems.map((expandedItem) => (
                <MobileMenuLink
                  key={expandedItem.name}
                  {...expandedItem}
                  openWalletView={openWalletView}
                  isStateConnected={isStateConnected}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              ))}
              <div className="mb-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <NextLink
      href={!isConnected || isStateConnected ? href : "#"}
      onClick={() => {
        setMobileMenuOpen(false);
        if (onClick) {
          onClick();
          return;
        }
        if (isConnected && !isStateConnected) {
          openWalletView({ view: "Connect" });
        }
      }}
      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-500 hover:bg-gray-50"
    >
      {name}
    </NextLink>
  );
}
