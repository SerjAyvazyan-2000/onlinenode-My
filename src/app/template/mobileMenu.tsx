import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { Dialog } from "@/app/components/dialog";
import { MobileMenuLink } from "@/app/components/MobileMenuLink";

const SUPPORTED_LOCALES = ["en", "ru"];
export default function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  open,
  isConnected,
  disconnect,
  address,
  xMobileApp,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobilePadding, setMobilePadding] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (xMobileApp != null && xMobileApp != "") {
      if (!mobilePadding) {
        setMobilePadding(true);
      }
    } else if (mobilePadding) {
      setMobilePadding(false);
    }
  }, [xMobileApp]);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");

    if (SUPPORTED_LOCALES.includes(segments[1])) {
      segments.splice(1, 1);
    }

    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  const navigation = [
    {
      name: t("MENU_BALANCE"),
      href: "/",
      onlyVisibleIfConnected: true,
      isConnected: true,
    },
    {
      name: t("MENU_STAKE"),
      href: "/stake",
      isConnected: true,
    },
    {
      name: t("MENU_BUY"),
      isExpanded: true,
      expandedItems: [
        {
          name: t("MENU_BUY"),
          href: "/swap",
        },
        {
          name: t("MENU_BUY_FOR_FIAT"),
          href: "#",
          onClick: () =>
            isConnected
              ? open({ view: "OnRampProviders" })
              : open({ view: "Connect" }),
          isConnected: true,
        },
        {
          name: t("MENU_SEND"),
          href: "/send",
        },
        {
          name: t("MENU_TRANSACTIONS"),
          href: "/transactions",
          isConnected: true,
        },
      ],
    },
    {
      name: t("MENU_REFERRAL"),
      href: "/referral",
      isConnected: true,
    },
    {
      name: t("MENU_LEARN"),
      isExpanded: true,
      expandedItems: [
        {
          name: t("MENU_WHITEPAPER"),
          href: "/whitepaper",
        },
        {
          name: t("MENU_LITEPAPER"),
          href: "/litepaper",
        },
        {
          name: t("MENU_FINANCIAL_MODEL"),
          href: "/financial-model",
        },
        {
          name: t("MENU_ROADMAP"),
          href: "/roadmap",
        },
        {
          name: t("MENU_FAQ"),
          href: "/faq",
        },
      ],
    },
  ];

  return (
    <Dialog
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
      className="lg:hidden"
      style={{
        position: "absolute",
        zIndex: 50,
      }}
    >
      <div className="-my-6 divide-y divide-gray-500/10">
        <div className="py-3">
          {navigation.map((item) => (
            <MobileMenuLink
              key={item.name}
              {...item}
              openWalletView={open}
              isStateConnected={isConnected}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          ))}
        </div>
        <div className="py-1">
          {!isConnected && (
            <button
              type="button"
              onClick={() => open({ view: "Connect" })}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 mt-5 mb-2 text-sm font-semibold text-white shadow-sm
             hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 hover:cursor-pointer
             focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect wallet
            </button>
          )}
          {isConnected && (
            <>
              <button
                key="My account"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  open({ view: "Account" });
                }}
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7
             font-semibold text-gray-900 hover:bg-gray-50"
              >
                {t("MENU_MY_ACCOUNT")}
              </button>
              <button
                key="Sign out"
                type="button"
                onClick={disconnect}
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7
             font-semibold text-gray-900 hover:bg-gray-50"
              >
                {t("MENU_SIGN_OUT")}
              </button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
