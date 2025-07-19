import {
  ArrowRightStartOnRectangleIcon,
  BanknotesIcon,
  UserIcon,
  UserPlusIcon,
  WalletIcon,
} from "@heroicons/react/16/solid";
import React from "react";
import { useTranslations } from "use-intl";
import { NavbarItem } from "../components/navbar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../components/dropdown";

export default function ProfileMenu(props) {
  const t = useTranslations();

  return (
    <Dropdown>
      <DropdownButton
        as={NavbarItem}
        aria-label="Account menu"
        className="hover:cursor-pointer"
      >
        <WalletIcon className="hover:cursor-pointer" />{" "}
        <p className="hover:cursor-pointer">{shortenAddress(props.address)}</p>
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        <DropdownItem
          onClick={() => props.open({ view: "Account" })}
          className="hover:cursor-pointer"
        >
          <UserIcon />
          <DropdownLabel>{t("MENU_MY_ACCOUNT")}</DropdownLabel>
        </DropdownItem>
        <DropdownItem href="/referral" className="hover:cursor-pointer">
          <BanknotesIcon />
          <DropdownLabel>{t("MENU_REFERRAL")}</DropdownLabel>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          onClick={props.disconnect}
          className="hover:cursor-pointer"
        >
          <ArrowRightStartOnRectangleIcon />
          <DropdownLabel>{t("MENU_SIGN_OUT")}</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function shortenAddress(address) {
  if (!address || address.length < 10) {
    throw new Error("Invalid address");
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
