import React from "react";
import { usePathname } from "next/navigation";
import {
  ArrowPathIcon,
  CreditCardIcon,
  ListBulletIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "use-intl";
import PopoverMenu from "./popoverMenu";
import { NavbarItem, NavbarSection } from "../components/navbar";

export default function MainMenu({ isConnected, open }) {
  const path = usePathname();
  const SUPPORTED_LOCALES = ["en", "ru"];

  function stripLocalePrefix(fullPath: string) {
    const segments = fullPath.split("/"); // ['', 'ru', 'faq'] например
    if (SUPPORTED_LOCALES.includes(segments[1])) {
      segments.splice(1, 1); // удаляем
    }
    return segments.join("/") || "/";
  }

  const localelessPath = stripLocalePrefix(path);

  const t = useTranslations();

  const navigation = [
    {
      name: t("MENU_BALANCE"),
      href: "/",
      target: "_self",
      isConnected: true,
      isPopover: false,
    },
    {
      name: t("MENU_STAKE"),
      href: "/stake",
      target: "_self",
      isConnected: true,
      isPopover: false,
    },
    {
      name: t("MENU_TRADE"),
      href: "",
      target: "",
      isConnected: false,
      isPopover: true,
      items: [
        {
          name: t("MENU_BUY"),
          description: t("MENU_BUY_DESCRIPTION"),
          onClick: () => {},
          href: "/swap",
          icon: ArrowPathIcon,
        },
        {
          name: t("MENU_BUY_FOR_FIAT"),
          description: t("MENU_BUY_FOR_FIAT_DESCRIPTION"),
          onClick: () =>
            isConnected
              ? open({ view: "OnRampProviders" })
              : open({ view: "Connect" }),
          href: "#",
          icon: CreditCardIcon,
        },
        {
          name: t("MENU_SEND"),
          description: t("MENU_SEND_DESCRIPTION"),
          onClick: () => window.open("/send", "_self"),
          href: "#",
          icon: PaperAirplaneIcon,
        },
        {
          name: t("MENU_TRANSACTIONS"),
          description: t("MENU_TRANSACTIONS_DESCRIPTION"),
          onClick: () =>
            isConnected
              ? window.open("/transactions", "_self")
              : open({ view: "Connect" }),
          href: "#",
          icon: ListBulletIcon,
        },
      ],
    },
    {
      name: t("MENU_REFERRAL"),
      href: "/referral",
      target: "_self",
      isConnected: true,
      isPopover: false,
    },
    {
      name: t("MENU_LEARN"),
      href: "",
      target: "",
      isConnected: false,
      isPopover: true,
      items: [
        {
          name: t("MENU_WHITEPAPER"),
          description: t("MENU_WHITEPAPER_DESCRIPTION"),
          onClick: () => {},
          href: "/whitepaper",
          icon: BookOpenIcon,
        },
        {
          name: t("MENU_LITEPAPER"),
          description: t("MENU_LITEPAPER_DESCRIPTION"),
          onClick: () => {},
          href: "/litepaper",
          icon: DocumentTextIcon,
        },
        {
          name: t("MENU_FINANCIAL_MODEL"),
          description: t("MENU_FINANCIAL_MODEL_DESCRIPTION"),
          onClick: () => {},
          href: "/financial-model",
          icon: ChartPieIcon,
        },
        {
          name: t("MENU_ROADMAP"),
          description: t("MENU_ROADMAP_DESCRIPTION"),
          onClick: () => {},
          href: "/roadmap",
          icon: ArrowTrendingUpIcon,
        },
        {
          name: t("MENU_FAQ"),
          description: t("MENU_FAQ_DESCRIPTION"),
          onClick: () => {},
          href: "/faq",
          icon: QuestionMarkCircleIcon,
        },
      ],
    },
  ];

  return (
    <NavbarSection className="max-lg:hidden">
      {navigation.map((item) =>
        item.isPopover ? (
          <PopoverMenu key={item.name} name={item.name} items={item.items} />
        ) : (item.isConnected && isConnected) || !item.isConnected ? (
          <NavbarItem
            href={item.href}
            key={item.href}
            target={item.target}
            current={localelessPath == item.href}
          >
            {item.name}
          </NavbarItem>
        ) : (
          <NavbarItem
            key={item.href}
            href="#"
            onClick={() => open({ view: "Connect" })}
          >
            {item.name}
          </NavbarItem>
        ),
      )}
    </NavbarSection>
  );
}
