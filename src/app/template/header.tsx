import React, { useEffect, useState } from "react";
import {
  useAppKitAccount,
  useAppKit,
  useDisconnect,
} from "@reown/appkit/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { GlobeAmericasIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "use-intl";
import ProfileMenu from "./profileMenu";
import MobileMenu from "./mobileMenu";
import MainMenu from "./mainMenu";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../components/dropdown";
import { NavbarItem } from "../components/navbar";
import { createReferral } from "../contract/config";

const SUPPORTED_LOCALES = ["en", "ru"];
export default function Header({ xMobileApp }) {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePadding, setMobilePadding] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    if (pathname != null) {
      let result = pathname;
      for (let i = 0; i < SUPPORTED_LOCALES.length; i++) {
        result = result.replace(`/${SUPPORTED_LOCALES[i]}`, "");
      }
      setCurrentPage(result);
    }
  }, [pathname]);

  useEffect(() => {
    if (xMobileApp != null && xMobileApp != "") {
      if (!mobilePadding) {
        setMobilePadding(true);
      }
    } else if (mobilePadding) {
      setMobilePadding(false);
    }
  }, [xMobileApp]);

  useEffect(() => {
    if (isConnected && address != null) {
      const referrer =
        searchParams.get("r") != null
          ? searchParams.get("r")?.toLowerCase()
          : localStorage.getItem("r")?.toLowerCase();
      if (referrer != null && referrer != address) {
        createReferral(referrer, address.toLowerCase()).then(() => {});
      }
    }
  }, [isConnected, address]);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Global"
        className={`flex items-center justify-between p-6 lg:px-8${
          mobilePadding ? " pt-15" : ""
        }`}
      >
        <div className="flex lg:flex-1">
          <a href="https://deflationcoin.com/" className="-m-1.5 p-1.5">
            <span className="sr-only">DeflationCoin</span>
            <img
              alt=""
              width={220}
              height={40}
              src="/logo7@3x.png"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <Dropdown>
            <DropdownButton
              as={NavbarItem}
              aria-label="Account menu"
              className="hover:cursor-pointer mr-5"
            >
              <GlobeAmericasIcon className="hover:cursor-pointer" />
            </DropdownButton>
            <DropdownMenu anchor="bottom end">
              <DropdownItem
                onClick={() => (window.location.href = `/en/${currentPage}`)}
                className="hover:cursor-pointer"
              >
                <DropdownLabel>🇺🇸 English</DropdownLabel>
              </DropdownItem>
              <DropdownItem
                onClick={() => (window.location.href = `/ru/${currentPage}`)}
                className="hover:cursor-pointer"
              >
                <DropdownLabel>🇷🇺 Русский</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <MainMenu isConnected={isConnected} open={open} />
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="mr-3">
            <Dropdown>
              <DropdownButton
                as={NavbarItem}
                aria-label="Account menu"
                className="hover:cursor-pointer"
              >
                <GlobeAmericasIcon className="hover:cursor-pointer" />
              </DropdownButton>
              <DropdownMenu anchor="bottom end">
                <DropdownItem
                  onClick={() => (window.location.href = `/en/${currentPage}`)}
                  className="hover:cursor-pointer"
                >
                  <DropdownLabel>🇺🇸 English</DropdownLabel>
                </DropdownItem>
                <DropdownItem
                  onClick={() => (window.location.href = `/ru/${currentPage}`)}
                  className="hover:cursor-pointer"
                >
                  <DropdownLabel>🇷🇺 Русский</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          {!isConnected && (
            <a
              onClick={() => open({ view: "Connect" })}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm
                          hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 hover:cursor-pointer
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("PAGE_CONNECT_WALLET")}
            </a>
          )}
          {isConnected && (
            <ProfileMenu
              open={open}
              address={address}
              disconnect={disconnect}
            />
          )}
        </div>
      </nav>
      <MobileMenu
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        open={open}
        disconnect={disconnect}
        address={address}
        isConnected={isConnected}
        xMobileApp={xMobileApp}
      />
    </header>
  );
}
