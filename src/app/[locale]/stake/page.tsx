"use client";

import { formatUnits, isAddress, parseUnits } from "viem";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { Slider } from "@heroui/slider";
import Image from "next/image";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { Spinner } from "@heroui/react";
import { useTranslations } from "use-intl";
import { PancakeSwapV3TokenSwap } from "@/app/integration/PancakeSwapV3TokenSwap";
import { Token } from "@pancakeswap/sdk";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Divider } from "../../components/divider";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../../components/dropdown";
import { Heading, Subheading } from "../../components/heading";
import Block from "../../template/block";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../../components/description-list";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../../components/dialog";
import { Field, Label } from "../../components/fieldset";
import { Input } from "../../components/input";
import { Listbox, ListboxLabel, ListboxOption } from "../../components/listbox";
import {
  getContractAbi,
  getMainnet,
  getTokenContract,
  getTokenName,
  getTokenSymbol,
  getUSDTContract,
} from "../../contract/config";
import Modal from "../../components/modal";

const years = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const xMultipliers = [1, 2, 3, 4, 5, 6, 7, 10, 12, 14, 16, 20];

function isFinished(startTimeBn, yearsBn) {
  const finishDate = new Date(Number(startTimeBn) * 1000);
  finishDate.setFullYear(finishDate.getFullYear() + Number(yearsBn));
  const now = new Date();
  return now > finishDate;
}

const PeriodNameKeys = {
  YEAR: "PAGE_PERIOD_NAME_1",
  YEARS_TYPE_1: "PAGE_PERIOD_NAME_2",
  YEARS_TYPE_2: "PAGE_PERIOD_NAME_3",
};

function defineLocalizedPeriodName(
  yearsDuration: number,
  t: (key: string) => string,
) {
  const twoDigitNumber = Math.abs(yearsDuration) % 100;
  const lastDigit = twoDigitNumber % 10;

  if (twoDigitNumber >= 10 && twoDigitNumber <= 20) {
    return t(PeriodNameKeys.YEARS_TYPE_2);
  }

  if (lastDigit === 1) {
    return t(PeriodNameKeys.YEAR);
  }

  if ([2, 3, 4].includes(lastDigit)) {
    return t(PeriodNameKeys.YEARS_TYPE_1);
  }

  return t(PeriodNameKeys.YEARS_TYPE_2);
}

function parseDates(startTimeBn, yearsBn, t: (key: string) => string) {
  // 1) Convert the BigInt timestamp to a number (seconds -> milliseconds).
  const startMs = Number(startTimeBn) * 1000;
  const startDateObj = new Date(startMs);

  // 2) Format the start date as "DD-MM-YYYY".
  const startDay = String(startDateObj.getDate()).padStart(2, "0");
  const startMonth = String(startDateObj.getMonth() + 1).padStart(2, "0");
  const startYear = startDateObj.getFullYear();
  const startDate = `${startYear}-${startMonth}-${startDay}`;

  // 3) Convert stakeYears BigInt to a normal number, and create a finish date.
  const stakeYears = Number(yearsBn);
  const finishDateObj = new Date(startDateObj);
  finishDateObj.setFullYear(startDateObj.getFullYear() + stakeYears);

  // 4) Format the finish date as "DD-MM-YYYY".
  const finishDay = String(finishDateObj.getDate()).padStart(2, "0");
  const finishMonth = String(finishDateObj.getMonth() + 1).padStart(2, "0");
  const finishYear = finishDateObj.getFullYear();
  const finishDate = `${finishYear}-${finishMonth}-${finishDay}`;

  // 5) Create period string, e.g. "12 years".
  let period: React.ReactNode = `${stakeYears} ${defineLocalizedPeriodName(stakeYears, t)}`;

  if (stakeYears === 12) {
    period = (
      <>
        {period}
        <div className="relative inline-block group">
          <Image
            src="/icons/question_mark.svg"
            alt="?"
            width={16}
            height={16}
            className="inline-block ml-1"
          />
          <div
            className="absolute hidden group-hover:block bg-gray-700 text-white text-sm px-2 py-1 rounded 
            bottom-full mb-2 left-1/2 ml-6 transform -translate-x-1/2 z-10 w-[370px] whitespace-normal break-words"
          >
            {t("PAGE_12_YEARS_STAKE_TOOLTIP_TEXT")}
          </div>
        </div>
      </>
    );
  }

  // 6) Return in the format you need.
  return {
    startDate,
    finishDate,
    period,
  };
}

export default function Stake() {
  const t = useTranslations();
  const abi = getContractAbi();
  const tokenContract = getTokenContract();
  const [tokenPrice, setTokenPrice] = useState(null);
  const pancake = new PancakeSwapV3TokenSwap();
  const { writeContract } = useWriteContract();
  const { address } = useAppKitAccount();
  const [stakingPositions, setStakingPositions] = useState(null);
  const [walletBalance, setWalletBalance] = useState<bigint>(0n);
  const [yearsStake, setYearsStake] = useState(12);
  const showDividends =
    process.env.NEXT_PUBLIC_SHOW_DIVIDENDS_IN_STAKE_SECTION === "true";
  const [dividendsVisible, setDividendsVisible] = useState<boolean[]>([]);
  const [isOpenStakingDialog, setIsOpenStakingDialog] = useState(false);
  const [isOpenDividendDialog, setIsOpenDividendDialog] = useState(false);
  const [stakeValue, setStakeValue] = useState<bigint>(0n);
  const [sliderPercentage, setSliderPercentage] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(100);
  const [stakeInputString, setStakeInputString] = useState("");
  const [stakeInputIsInvalid, setStakeInputIsInvalid] = useState(false);
  const [dividendsValue, setDividendsValue] = useState(0);
  const [totalInitial, setTotalInitial] = useState(0.0);
  const [total, setTotal] = useState(0.0);
  const [claimDividendsMaxValue, setClaimDividendsMaxValue] = useState(0.0);
  const [dividendsActiveId, setDividendsActiveId] = useState(0);
  const [stakeIsLoading, setStakeIsLoading] = useState(false);
  const [dividendsIsLoading, setDividendsIsLoading] = useState(false);

  const [referral, setReferral] = useState(
    "0x0000000000000000000000000000000000000000",
  );

  const [doUpdate, setDoUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const {
    data: receipt,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const token = new Token(
    getMainnet(),
    getTokenContract(),
    18,
    getTokenSymbol(),
    getTokenName(),
  );
  const usdt = new Token(
    getMainnet(),
    getUSDTContract(),
    18,
    getTokenSymbol(),
    getTokenName(),
  );

  useEffect(() => {
    const addr = localStorage.getItem("r");
    if (isAddress(addr)) {
      setReferral(addr);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      setModalType("loading");
      setModalTitle("Loading");
      setModalDescription("Transaction is processing...");
      setIsModalOpen(true);
    }
    if (isSuccess) {
      setModalType("success");
      setModalTitle("Success");
      setModalDescription("Transaction finished successfully");
      setIsModalOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, [1500]);
    }
    if (isError) {
      setModalType("error");
      setModalTitle("Error");
      setModalDescription(
        `Transaction error: ${error?.message}` || " unknown error",
      );
      setIsModalOpen(true);
    }
  }, [isLoading, isSuccess, isError, error]);

  const calculatePrice = async () => {
    try {
      let p = await pancake.fetchPriceWithAmount("1.0", token, usdt);

      p = Number(p) / 10 ** 18;
      setTokenPrice(Math.round(p * 100000) / 100000.0);
    } catch (error) {
      console.log("Error fetching price:", error);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, []);

  const getBalance = useReadContract({
    abi,
    address: tokenContract,
    functionName: "balanceOf",
    args: [address],
    account: address,
  });
  const getStakingPositions = useReadContract({
    abi,
    address: tokenContract,
    functionName: "getStakingPositions",
    account: address,
  });
  const calculateDividends = useReadContract({
    abi,
    address: tokenContract,
    functionName: "calculateDividends",
    args: [address],
    account: address,
  });

  function setStakeAndSliderStates(accountBalance: bigint, percentage: number) {
    if (accountBalance === 0n) {
      setSliderMaxValue(0);
    } else {
      setSliderMaxValue(100);

      const valueToStake = (accountBalance * BigInt(percentage)) / 100n;

      if (valueToStake > 0n) {
        setStakeInputString(formatUnits(valueToStake, 18));
      } else {
        setStakeInputString("");
      }

      setStakeValue(valueToStake);
      setSliderPercentage(percentage);
    }
  }

  useEffect(() => {
    if (getBalance.data != null) {
      const accountBalance = getBalance.data;
      setWalletBalance(accountBalance);
      const initialPercentage = 50;
      setStakeAndSliderStates(accountBalance, initialPercentage);
    }
  }, [getBalance.data]);

  useEffect(() => {
    if (walletBalance != null && stakeValue != null) {
      setStakeInputIsInvalid(stakeValue > walletBalance);
    }
  }, [walletBalance, stakeValue]);

  useEffect(() => {
    if (getStakingPositions.data != null) {
      const r = [];
      let _totalInitial = 0;
      let _total = 0;
      for (let i = 0; i < getStakingPositions.data.length; i++) {
        const s = getStakingPositions.data[i];
        const dividend =
          calculateDividends.data != null
            ? parseFloat(formatUnits(calculateDividends.data[i], 18))
            : 0;
        const { startDate, finishDate, period } = parseDates(
          s.startTime,
          s.year,
          t,
        );
        const year = parseInt(s.year);
        const amount = parseFloat(formatUnits(s.amount, 18));
        const initialAmount = parseFloat(formatUnits(s.initialAmount, 18));
        _totalInitial += initialAmount;
        _total += amount;
        r.push({
          id: i,
          // initialAmount: initialAmount.toFixed(2) + ' DEF',
          initialAmount,
          // amount: amount.toFixed(2) + ' DEF',
          amount,
          startDate,
          finishDate,
          period,
          xMultiplier: xMultipliers[year - 1],
          podMultiplier: year,
          status:
            amount > 0 && !isFinished(s.startTime, s.year)
              ? "active"
              : "finished",
          // claimedDividends: parseFloat(formatUnits(s.claimedDividends, 18)).toFixed(2) + ' DEF',
          claimedDividends: parseFloat(formatUnits(s.claimedDividends, 18)),
          // claimedStaking: parseFloat(formatUnits(s.claimedStaking, 18)).toFixed(2) + ' DEF',
          claimedStaking: parseFloat(formatUnits(s.claimedStaking, 18)),
          lastClaimed: s.lastClaimed == "0" ? "-" : s.lastClaimed,
          // dividend: dividend.toFixed(2)
          dividend,
        });
      }

      const grouped = Object.values(
        r.reduce((acc, curr) => {
          const key = `${curr.startDate}_${curr.finishDate}`;

          if (!acc[key]) {
            acc[key] = { ...curr };
            acc[key].ids = [curr.id];
          } else {
            acc[key].initialAmount += curr.initialAmount;
            acc[key].amount += curr.amount;
            acc[key].claimedDividends += curr.claimedDividends;
            acc[key].claimedStaking += curr.claimedStaking;
            acc[key].dividend += curr.dividend;

            acc[key].ids.push(curr.id);
          }
          return acc;
        }, {}),
      );

      for (let i = 0; i < grouped.length; i++) {
        grouped[i].initialAmount = grouped[i].initialAmount.toFixed(2);
        grouped[i].amount = grouped[i].amount.toFixed(2);
        grouped[i].claimedDividends = grouped[i].claimedDividends.toFixed(2);
        grouped[i].claimedStaking = grouped[i].claimedStaking.toFixed(2);
        grouped[i].dividend = grouped[i].dividend.toFixed(2);
      }

      setTotal(_total);
      setTotalInitial(_totalInitial);
      setStakingPositions(
        grouped.sort((a, b) => a.podMultiplier - b.podMultiplier),
      );
    }
  }, [doUpdate, getStakingPositions.data, calculateDividends.data]);

  useEffect(() => {
    if (stakingPositions != null) {
      const initialVisibility = Array(stakingPositions.length).fill(false);
      setDividendsVisible(initialVisibility);
    }
  }, [stakingPositions]);

  const stake = () => {
    console.log("stake function stakeValue: ", stakeValue);
    if (stakeValue != null) {
      console.log("stake value is not null");
      setStakeIsLoading(true);
      console.log("stake value is loading");
      writeContract(
        {
          abi,
          address: tokenContract,
          functionName: "stake",
          args: [stakeValue, yearsStake, referral],
        },
        {
          onSuccess: (hash) => {
            setStakeIsLoading(false);
            setIsOpenStakingDialog(false);
            console.log("Transaction hash:", hash);
            setTxHash(hash as `0x${string}`);
          },
          onError: (error) => {
            console.log(error);
            setStakeIsLoading(false);
            setIsOpenStakingDialog(false);
          },
        },
      );
    }
  };

  const claimDividendsModal = (stakingPosition) => {
    const d = parseFloat(stakingPosition.dividend);
    setClaimDividendsMaxValue(d);
    setDividendsValue(d * 0.4);
    setDividendsActiveId(stakingPosition.id);
    setIsOpenDividendDialog(true);
  };

  const claimDividends = () => {
    if (
      dividendsActiveId != null &&
      dividendsValue != null &&
      dividendsValue > 0
    ) {
      setDividendsIsLoading(true);
      writeContract(
        {
          abi,
          address: tokenContract,
          functionName: "claimDividends",
          args: [
            dividendsActiveId,
            parseUnits(dividendsValue.toString(10), 18),
          ],
        },
        {
          onSuccess: (hash) => {
            setDividendsIsLoading(false);
            setIsOpenDividendDialog(false);
            console.log("Transaction hash:", hash);
            setTxHash(hash as `0x${string}`);
          },
          onError: () => {
            setDividendsIsLoading(false);
            setIsOpenDividendDialog(false);
          },
        },
      );
    }
  };

  const toggleVisibility = (index: number) => {
    setDividendsVisible((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <Block>
      <div className="flex items-end justify-between gap-4 px-8 pt-8">
        <Heading className="max-sm:text-[18px]">
          {t("PAGE_STAKING_POSITIONS")}
        </Heading>
        <a
          onClick={() => setIsOpenStakingDialog(true)}
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 hover:cursor-pointer
            focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {t("PAGE_STAKE")}
        </a>
      </div>

      <div className="pt-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 mb-4 sm:px-6 lg:px-8">
          {stakingPositions != null && (
            <table className="w-full text-left">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_START_DATE")}
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-2 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_FINISH_DATE")}
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:table-cell py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_PERIOD")}
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-2 py-3.5 text-center text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_X_MULTIPLIER")}
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-2 py-3.5 text-center text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_POD_X_MULTIPLIER")}
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-2 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_INITIAL_AMOUNT")}
                  </th>
                  <th
                    scope="col"
                    className="relative isolate py-3.5 px-2 sm:text-left
                    text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    <span className="hidden sm:inline">{t("PAGE_AMOUNT")}</span>
                    <span className="ml-5 sm:ml-0"> DEF</span>
                  </th>
                  <th
                    scope="col"
                    className="relative isolate py-3.5 px-2 sm:text-left
                    text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    <span className="hidden sm:inline">{t("PAGE_AMOUNT")}</span>
                    <span className="ml-5 sm:ml-0"> $</span>
                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-2 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900"
                  >
                    {t("PAGE_STATUS")}
                  </th>
                  <th
                    scope="col"
                    className="hidden relative py-3.5 pl-3 md:table-cell"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {stakingPositions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-sm text-gray-500">
                      {t("PAGE_NO_STAKING_POSITIONS")}
                    </td>
                  </tr>
                )}
                {stakingPositions.map((stakingPosition) => (
                  <React.Fragment key={`fragment_${stakingPosition.id}`}>
                    <tr
                      key={stakingPosition.id}
                      className={showDividends ? "hover:cursor-pointer" : ""}
                      onClick={
                        showDividends
                          ? () => toggleVisibility(stakingPosition.id)
                          : undefined
                      }
                    >
                      <td className=" px-2 py-4 text-xs sm:text-sm text-gray-500 sm:table-cell">
                        {stakingPosition.startDate}
                      </td>
                      <td className="hidden px-2 py-4 text-xs sm:text-sm text-gray-500 md:table-cell">
                        {stakingPosition.finishDate}
                      </td>
                      <td className=" px-2 py-4 text-xs sm:text-sm text-gray-500 md:table-cell">
                        {stakingPosition.period}
                      </td>
                      <td className="hidden lg:table-cell px-2 py-4 text-center text-xs sm:text-sm text-gray-500">
                        x{stakingPosition.xMultiplier}
                      </td>
                      <td className="hidden lg:table-cell px-2 py-4 text-center text-xs sm:text-sm text-gray-500">
                        x{stakingPosition.podMultiplier}
                      </td>
                      <td className="hidden px-2 py-4 text-xs sm:text-sm text-gray-500 sm:table-cell">
                        {stakingPosition.initialAmount} DEF
                      </td>
                      <td className="relative px-2 py-4 text-xs sm:text-sm font-medium text-gray-900 over:bg-gray-200">
                        {stakingPosition.amount} DEF
                      </td>
                      <td className="relative px-2 py-4 text-xs sm:text-sm font-medium text-gray-900 over:bg-gray-200">
                        $
                        {tokenPrice != null &&
                          (stakingPosition.amount * tokenPrice).toFixed(2)}
                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                      </td>
                      <td className="md:px-2 py-4 text-xs sm:text-sm text-gray-500 md:table-cell">
                        <Badge
                          className="max-sm:hidden"
                          color={
                            stakingPosition.status === "active"
                              ? "lime"
                              : "zinc"
                          }
                        >
                          {stakingPosition.status}
                        </Badge>
                        <Badge
                          className="sm:hidden"
                          color={
                            stakingPosition.status === "active"
                              ? "lime"
                              : "zinc"
                          }
                        >
                          {stakingPosition.status === "active" ? "✓" : "∅"}
                        </Badge>
                      </td>
                      {showDividends && (
                        <td className="py-4 md:pl-3 text-right text-sm font-medium md:table-cell">
                          <Dropdown>
                            <DropdownButton
                              className="hover:cursor-pointer"
                              plain
                              aria-label="More options"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EllipsisVerticalIcon onClick={() => {}} />
                            </DropdownButton>
                            <DropdownMenu anchor="bottom end">
                              <DropdownItem className="hover:cursor-pointer">
                                Show dividends
                              </DropdownItem>
                              <DropdownItem
                                className="hover:cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Extend staking
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      )}
                    </tr>
                    {dividendsVisible[stakingPosition.id] && (
                      <tr key={`${stakingPosition.id}_internal`}>
                        <td
                          colSpan={9}
                          className="relative px-3 py-4 text-sm text-gray-500"
                        >
                          <div className="my-1">
                            <div className="flex justify-between items-center gap-4">
                              <Subheading className="hidden sm:block">
                                {t("PAGE_STAKING_POSITION_NUMBER")}
                                {stakingPosition.id}
                              </Subheading>
                              <div>
                                <Button
                                  outline
                                  className="text-sm mx-1 hover:cursor-pointer"
                                >
                                  {t("PAGE_EXTEND_STAKING")}
                                </Button>
                                {parseFloat(stakingPosition.dividend) > 0 && (
                                  <Button
                                    className="text-sm mx-1 hover:cursor-pointer"
                                    onClick={() =>
                                      claimDividendsModal(stakingPosition)
                                    }
                                  >
                                    Claim dividends
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Divider className="mt-4" />
                            <div className="flex">
                              <DescriptionList className="flex-1">
                                <DescriptionTerm className="text-sm">
                                  {t("PAGE_CURRENT_DIVIDENDS")}
                                </DescriptionTerm>
                                <DescriptionDetails className="text-sm">
                                  <b>{stakingPosition.dividend} DEF</b>
                                </DescriptionDetails>
                                <DescriptionTerm className="text-sm">
                                  {t("PAGE_CLAIMED_STAKING")}
                                </DescriptionTerm>
                                <DescriptionDetails className="text-sm">
                                  {stakingPosition.claimedStaking} DEF
                                </DescriptionDetails>
                              </DescriptionList>
                              <DescriptionList className="flex-1">
                                <DescriptionTerm className="text-sm">
                                  {t("PAGE_CLAIMED_DIVIDENDS")}
                                </DescriptionTerm>
                                <DescriptionDetails className="text-sm">
                                  {stakingPosition.claimedDividends} DEF
                                </DescriptionDetails>
                                <DescriptionTerm className="text-sm">
                                  {t("PAGE_LAST_CLAIMED")}
                                </DescriptionTerm>
                                <DescriptionDetails className="text-sm">
                                  {stakingPosition.lastClaimed}
                                </DescriptionDetails>
                              </DescriptionList>
                            </div>
                          </div>
                          <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                          <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              {stakingPositions.length > 0 && (
                <tfoot>
                  <tr className="hidden sm:table-row">
                    <td />
                    <td className="hidden md:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td />
                    <td className="px-2 pt-4  text-xs sm:text-sm font-normal text-gray-500  text-left">
                      {t("PAGE_TOTAL_INITIAL")}
                    </td>
                    <td
                      colSpan={2}
                      className="px-2 pt-4  text-xs sm:text-sm font-normal text-gray-500 text-left"
                    >
                      {totalInitial.toFixed(2)} DEF
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td className="hidden md:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td />
                    <td className="px-2 py-2 pt-4  text-xs sm:text-sm font-medium text-gray-900 text-left">
                      {t("PAGE_TOTAL")}
                    </td>
                    <td
                      colSpan={2}
                      className="px-2 py-2 pt-4  text-xs sm:text-sm font-medium text-gray-900 text-left"
                    >
                      {total.toFixed(2)} DEF
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td className="hidden md:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td className="hidden lg:table-cell" />
                    <td />
                    <td className="px-2 py-2  text-xs sm:text-sm font-medium text-gray-900 text-left">
                      {t("PAGE_TOTAL_USD")}
                    </td>
                    <td
                      colSpan={2}
                      className="px-2 py-2  text-xs sm:text-sm font-medium text-gray-900 text-left"
                    >
                      ${tokenPrice != null && (total * tokenPrice).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
          {stakingPositions == null && (
            <div className="text-center">
              <Spinner size="lg" />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isOpenStakingDialog} onClose={setIsOpenStakingDialog}>
        <DialogTitle>{t("PAGE_STAKING_MODAL_TITLE")}</DialogTitle>
        <DialogDescription>
          {t("PAGE_STAKING_MODAL_DESCRIPTION")}
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>{t("PAGE_STAKING_MODAL_AMOUNT")}</Label>
            <Input
              name="amount"
              placeholder="0.00 DEF"
              value={stakeInputString || ""}
              data-invalid={stakeInputIsInvalid || undefined}
              onChange={(v) => {
                const stringValue = v.target.value
                  .replace(/[^0-9.]/g, "") // Удаляем всё кроме цифр и точек
                  .replace(/(\..*)\./g, "$1") // Удаляем лишние точки
                  .replace(/^0+(\.)/, "0$1") // Оставляем один ноль перед точкой
                  .replace(/^0+([0-9])/, "$1"); // Удаляем ноль если перед точкой есть цифры

                setStakeInputString(stringValue);

                const bigIntValue = parseUnits(stringValue, 18);
                setStakeValue(bigIntValue);

                const percentage =
                  walletBalance === 0n
                    ? 0n
                    : (bigIntValue * 100n + walletBalance - 1n) / walletBalance; // Для нечетных чисел округляем вверх
                setSliderPercentage(Number(percentage));
              }}
            />
            <div className="my-4 py-2">
              <Slider
                label={t("PAGE_STAKING_MODAL_SLIDER_LABEL")}
                aria-label="stake"
                className="max-w-md"
                color="secondary"
                value={sliderPercentage || 0}
                minValue={0}
                maxValue={sliderMaxValue || 0}
                size="sm"
                formatOptions={{
                  style: "unit",
                  unit: "percent",
                }}
                onChange={(percentage) => {
                  setStakeAndSliderStates(walletBalance, percentage);
                }}
                step={1}
                marks={
                  walletBalance > 0
                    ? [
                        { value: 20, label: "20%" },
                        { value: 50, label: "50%" },
                        { value: 80, label: "80%" },
                      ]
                    : []
                }
              />
            </div>
          </Field>
          <Field>
            <Label>{t("PAGE_STAKING_MODAL_YEARS")}</Label>
            <Listbox
              aria-label="years"
              name="years"
              placeholder="years"
              value={yearsStake}
              onChange={(v) => setYearsStake(v)}
            >
              {years.map((year) => (
                <ListboxOption key={`year_${year}`} value={year}>
                  <ListboxLabel>
                    {year} {defineLocalizedPeriodName(year, t)}
                  </ListboxLabel>
                </ListboxOption>
              ))}
            </Listbox>
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            className="hover:cursor-pointer"
            plain
            onClick={() => setIsOpenStakingDialog(false)}
          >
            {t("PAGE_STAKING_MODAL_CANCEL")}
          </Button>

          {!stakeIsLoading &&
            (!stakeInputIsInvalid && stakeValue !== 0n ? (
              <Button className="hover:cursor-pointer" onClick={stake}>
                {t("PAGE_STAKING_MODAL_CONFIRM")}
              </Button>
            ) : (
              <Button disabled>{t("PAGE_STAKING_MODAL_CONFIRM")}</Button>
            ))}
          {stakeIsLoading && (
            <Button className="hover:cursor-pointer flex" disabled>
              <Spinner size="sm" className="mr-2" />{" "}
              {t("PAGE_STAKING_MODAL_CONFIRMING")}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={isOpenDividendDialog} onClose={setIsOpenDividendDialog}>
        <DialogTitle>Claim dividends</DialogTitle>
        <DialogDescription>
          Enter amount of dividends to claim from selected staking position
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Amount</Label>
            <Input
              name="amount"
              placeholder="0.00 DEF"
              value={dividendsValue || ""}
              onChange={(v) => {
                const value = v.target.value
                  .replace(/[^0-9.]/g, "") // Удаляем всё кроме цифр и точек
                  .replace(/(\..*)\./g, "$1") // Удаляем лишние точки
                  .replace(/^0+(\.)/, "0$1") // Оставляем один ноль перед точкой
                  .replace(/^0+([0-9])/, "$1"); // Удаляем ноль если перед точкой есть цифры
                setDividendsValue(
                  Math.min(claimDividendsMaxValue, parseFloat(value)),
                );
              }}
            />
            <div className="my-4 py-2">
              <Slider
                aria-label="dividends"
                className="max-w-md"
                color="secondary"
                value={dividendsValue}
                maxValue={claimDividendsMaxValue}
                minValue={0.0}
                size="sm"
                onChange={(value) => setDividendsValue(parseFloat(value))}
                step={0.0001}
                marks={[
                  {
                    value: claimDividendsMaxValue * 0.4,
                    label: <b>D</b>,
                  },
                  {
                    value: claimDividendsMaxValue * 0.2,
                    label: "20%",
                  },
                  {
                    value: claimDividendsMaxValue * 0.5,
                    label: "50%",
                  },
                  {
                    value: claimDividendsMaxValue * 0.8,
                    label: "80%",
                  },
                ]}
              />
            </div>
          </Field>
        </DialogBody>
        <DialogDescription>
          Amount less than or equal to <b>D</b> includes monthly dividends.
          Remaining amount includes the staking position share.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDividendDialog(false)}>
            Cancel
          </Button>
          {!dividendsIsLoading && (
            <Button onClick={claimDividends}>Claim</Button>
          )}
          {dividendsIsLoading && (
            <Button className="hover:cursor-pointer flex" disabled>
              <Spinner size="sm" className="mr-2" /> Confirming transaction
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Modal
        type={modalType}
        title={modalTitle}
        description={modalDescription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Block>
  );
}
