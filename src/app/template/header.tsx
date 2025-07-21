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
import Container from "../shared/container";
import Link from "next/link";
import clsx from "clsx";

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

  const [langOpen, setLangOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    const closeLang = () => setLangOpen(false);

    if (langOpen) {
      window.addEventListener("click", closeLang);
    }

    return () => {
      window.removeEventListener("click", closeLang);
    };
  }, [langOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLangOpen(!langOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="absolute z-[11] pt-[20px]  w-full md:pt-[60px] ">
      <Container>
        <div className=" flex items-center justify-between h-[55px] ">
          <Link className="hidden xl:flex" href={"/"}>
            <img src="/logo.svg" alt="" />
          </Link>

          <div className="hidden xl:flex items-center gap-[80px]">
            <ul className="flex items-center gap-[80px]">
              <li>
                <Link
                  href="https://deflationcoin.com/ru/litepaper"
                  target="_blank"
                  className="relative inline-block group text-[18px] font-bold font-[Stem] uppercase"
                >
                  <span className="block group-hover:opacity-0 transition-opacity duration-300">
                    litepaper
                  </span>

                  <span className="absolute inset-0 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#2A86FF] via-[#003172] to-[#7D34D7] bg-clip-text text-transparent">
                    litepaper
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="https://deflationcoin.com/ru/whitepaper"
                  target="_blank"
                  className="relative inline-block group text-[18px] font-bold font-[Stem] uppercase"
                >
                  <span className="block group-hover:opacity-0 transition-opacity duration-300">
                    whitepaper
                  </span>

                  <span className="absolute inset-0 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#2A86FF] via-[#003172] to-[#7D34D7] bg-clip-text text-transparent">
                    whitepaper
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="https://deflationcoin.com/ru/roadmap"
                  target="_blank"
                  className="relative inline-block group text-[18px] font-bold font-[Stem] uppercase"
                >
                  <span className="block group-hover:opacity-0 transition-opacity duration-300">
                    roadmap
                  </span>

                  <span className="absolute inset-0 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#2A86FF] via-[#003172] to-[#7D34D7] bg-clip-text text-transparent">
                    roadmap
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="https://deflationcoin.com/ru/swap"
                  target="_blank"
                  className="w-[220px] h-[55px] flex items-center justify-center rounded-full bg-black text-white text-[18px] font-[Stem] font-bold uppercase transition hover:bg-gradient-to-r hover:from-[#2A86FF] hover:via-[#003172] hover:to-[#7D34D7]"
                >
                  инвестировать
                </Link>
              </li>
            </ul>

            <div className="relative group cursor-pointer flex items-center gap-4">
              <div
                className="relative cursor-pointer flex items-center group gap-[16px]"
                onClick={handleToggle}
              >
                <i className="icon group-hover:rotate-[180deg] transition-all duration-500 icon-earth text-[24px] bg-black"></i>
                <div className="text-[18px] font-[Stem] font-bold uppercase">
                  ru
                </div>

                {langOpen && (
                  <div className="absolute top-[45px] left-[-125px] flex flex-col w-[200px] h-[150px] bg-white rounded-[20px] p-5 shadow-lg z-[1000]">
                    <div
                      onClick={() =>
                        (window.location.href = `/ru/${currentPage}`)
                      }
                      className="w-[160px] h-[55px] flex items-center justify-center rounded-[8px] text-[18px] font-[Stem] text-black hover:bg-[#EFF2FB] transition cursor-pointer"
                    >
                      Русский
                    </div>
                    <div
                      onClick={() =>
                        (window.location.href = `/en/${currentPage}`)
                      }
                      className="w-[160px] h-[55px] flex items-center justify-center rounded-[8px] text-[18px] font-[Stem] text-black hover:bg-[#EFF2FB] transition cursor-pointer"
                    >
                      English
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* МОБИЛКА */}
          <div className="flex xl:hidden items-center justify-between w-full">
            <Link className="relative z-[11]" href={"/"}>
              <i
                className={`icon  icon-logoMobile transition-all duration-300 text-[50px] bg-black ${isOpen && "bg-white"}`}
              >
                {" "}
              </i>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative w-[32px] h-[14px] flex flex-col
                   justify-between items-center z-[1001] xl:hidden `}
            >
              <span
                className={clsx(
                  "w-full h-[3px] bg-black rounded transition-all duration-300",
                  isOpen && "rotate-45 translate-y-[2px] bg-white"
                )}
              />
              <span
                className={clsx(
                  "w-full h-[3px] bg-black rounded transition-all duration-300",
                  isOpen && "-rotate-45 -translate-y-[10px] bg-white"
                )}
              />
            </button>

            {/* МОБИЛЬНОЕ МЕНЮ */}
            <div
              className={clsx(
                "fixed top-0 pt-[80px]  md:pt-[120px] left-0 w-full h-screen bg-black z-[10] transition-all duration-500 ",
                isOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <div className="pb-[60px] max-h-[80vh] overflow-auto">
                <ul className="flex flex-col gap-[40px] items-center">
                  <li>
                    <Link
                      className="relative inline-block group text-[18px] text-white font-bold font-[Stem] uppercase"
                      href="https://deflationcoin.com/ru/litepaper"
                      onClick={() => setIsOpen(false)}
                    >
                      litepaper
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://deflationcoin.com/ru/whitepaper"
                      onClick={() => setIsOpen(false)}
                      className="relative inline-block group text-[18px] text-white font-bold font-[Stem] uppercase"
                    >
                      whitepaper
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative inline-block group text-[18px] text-white font-bold font-[Stem] uppercase"
                      href="https://deflationcoin.com/ru/roadmap"
                      onClick={() => setIsOpen(false)}
                    >
                      roadmap
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://deflationcoin.com/ru/swap"
                      target="_blank"
                      className="px-[30px]  py-[16px] bg-white text-black 
                    rounded-full hover:bg-gradient-to-r hover:from-[#2A86FF] text-[18px] font-[Stem] font-bold uppercase hover:via-[#003172] hover:to-[#7D34D7] transition"
                    >
                      Инвестировать
                    </Link>
                  </li>
                </ul>

                <div className="relative group cursor-pointer flex mt-[80px] items-center justify-center gap-[60px]">
                  <div
                    className="relative cursor-pointer flex items-center group gap-[16px]"
                    onClick={() =>
                      (window.location.href = `/ru/${currentPage}`)
                    }
                  >
                    <i className="icon group-hover:rotate-[180deg] transition-all duration-500 icon-earth text-[24px] bg-white"></i>
                    <div className="text-[18px] text-white font-[Stem] font-bold uppercase">
                      ru
                    </div>
                  </div>

                  <div
                    className="relative cursor-pointer flex items-center group gap-[16px]"
                    onClick={() =>
                      (window.location.href = `/en/${currentPage}`)
                    }
                  >
                    <i className="icon group-hover:rotate-[180deg] transition-all duration-500 icon-earth text-[24px] bg-white"></i>
                    <div className="text-[18px] text-white font-[Stem] font-bold uppercase">
                      en
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* <nav
          aria-label="Global"
          className="flex items-center justify-between pt-[60px]"
        >
          <div className="flex lg:flex-1">
            <Link href={"/"} className="-m-1.5 p-1.5">
              <span className="sr-only">DeflationCoin</span>
              <img
                alt=""
                width={220}
                height={40}
                src="/logo.svg"
                className="h-8 w-auto"
              />
            </Link>
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
                    onClick={() =>
                      (window.location.href = `/en/${currentPage}`)
                    }
                    className="hover:cursor-pointer"
                  >
                    <DropdownLabel>🇺🇸 English</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      (window.location.href = `/ru/${currentPage}`)
                    }
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
        /> */}
      </Container>
    </header>
  );
}
