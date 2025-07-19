"use client";

import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { Token } from "@pancakeswap/sdk";
import { useReadContract } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import PriceChart from "@/app/components/graph/priceChart";
import { useTranslations } from "use-intl";
import { Heading, Subheading } from "../components/heading";
import Stat from "../template/stat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import Block from "../template/block";
import {
  getContractAbi,
  getMainnet,
  getTokenContract,
  getTokenName,
  getTokenSymbol,
  getUSDTContract,
} from "../contract/config";
import { PancakeSwapV3TokenSwap } from "../integration/PancakeSwapV3TokenSwap";
import { Divider } from "../components/divider";

export default function Balance() {
  const t = useTranslations();

  const dailyReductions = [100, 99, 97, 93, 85, 71, 48, 17, 0];
  const { address } = useAppKitAccount();
  const pancake = new PancakeSwapV3TokenSwap();
  const [totalStaking, setTotalStaking] = useState(null);
  const [portions, setPortions] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [roi, setRoi] = useState("—");
  const [pnl, setPnl] = useState("-");
  const tokenContract = getTokenContract();
  const [entryPrice, setEntryPrice] = useState(null);
  const [copy, setCopy] = useState(false);
  const abi = getContractAbi();

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

  const balance = useReadContract({
    abi,
    address: tokenContract,
    functionName: "balanceOf",
    args: [address],
    account: `0x${address?.replace(/^0x/, "")}`,
  });

  const balancePortions = useReadContract({
    abi,
    address: tokenContract,
    functionName: "getBalancePortions",
    args: [],
    account: `0x${address?.replace(/^0x/, "")}`,
  });

  const totalSupply = useReadContract({
    abi,
    address: tokenContract,
    functionName: "totalSupply",
    args: [],
    account: `0x${address?.replace(/^0x/, "")}`,
  });

  const stakingPositions = useReadContract({
    abi,
    address: tokenContract,
    functionName: "getStakingPositions",
    account: `0x${address?.replace(/^0x/, "")}`,
  });

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatData = (d: any) => {
    return d != null && d.isSuccess ? (
      `${parseFloat(formatUnits(d.data, 18))
        .toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        .replace(/,/g, " ")} DEF`
    ) : (
      <Spinner size="sm" />
    );
  };

  const formatTotalAssets = () => {
    if (tokenPrice != null && totalStaking != null && balance.data != null) {
      const balanceOnWallet = parseFloat(formatUnits(balance.data, 18));
      return `${((balanceOnWallet + totalStaking) * tokenPrice)
        .toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        .replace(/,/g, " ")}$`;
    }
    return <Spinner size="sm" />;
  };

  const formatTotalDef = () => {
    if (totalStaking != null && balance.data != null) {
      const balanceOnWallet = parseFloat(formatUnits(balance.data, 18));
      return `${(balanceOnWallet + totalStaking)
        .toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        .replace(/,/g, " ")} DEF`;
    }
    return <Spinner size="sm" />;
  };

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDateTimeStamp = (milliseconds: number) => {
    const startDateObj = new Date(milliseconds);

    // 2) Format the start date as "DD-MM-YYYY".
    const startDay = String(startDateObj.getDate()).padStart(2, "0");
    const startMonth = String(startDateObj.getMonth() + 1).padStart(2, "0");
    const startYear = startDateObj.getFullYear();
    return `${startYear}-${startMonth}-${startDay}`;
  };

  const formatPrice = (number) => {
    if (number == 0) {
      return "—";
    }
    return `${toFixed(number, Math.max(3 - Math.floor(Math.log10(number)), 0))} USDT`;
  };

  const formatNumberStandard = (number) => {
    return number
      .toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })
      .replace(/,/g, " ");
  };

  useEffect(() => {
    if (entryPrice != null && tokenPrice != null) {
      setRoi(calculateROI(tokenPrice, entryPrice));
    }
  }, [entryPrice, tokenPrice]);

  useEffect(() => {
    if (
      entryPrice != null &&
      tokenPrice != null &&
      balance.data != null &&
      totalStaking != null
    ) {
      setPnl(
        calculatePnl(
          tokenPrice,
          entryPrice,
          parseFloat(formatUnits(balance.data, 18)),
          totalStaking,
        ),
      );
    }
  }, [entryPrice, tokenPrice, balance, totalStaking]);

  const calculatePnl = (marketPrice, entryPrice, balanceSum, totalStaking) => {
    if (entryPrice === 0 || marketPrice === 0) {
      return "—";
    }

    const pnlValue = (balanceSum + totalStaking) * (marketPrice - entryPrice);
    const sign = pnlValue > 0 ? "+" : "-";
    const formattedNumber = formatNumberStandard(Math.abs(pnlValue));
    return `${sign}${formattedNumber}$`;
  };

  const calculateROI = (marketPrice, entryPrice) => {
    if (entryPrice === 0 || marketPrice === 0) {
      return "—";
    }

    const roiValue = (marketPrice / entryPrice - 1) * 100;
    const sign = roiValue >= 0 ? "+" : "-";
    const formattedNumber = formatNumberStandard(Math.abs(roiValue));
    return `${sign}${formattedNumber}%`;
  };

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

  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 1000);
    }
  }, [copy]);

  useEffect(() => {
    if (stakingPositions.data != null) {
      let t = 0;
      for (let i = 0; i < stakingPositions.data.length; i++) {
        t += parseFloat(formatUnits(stakingPositions.data[i].amount, 18));
      }
      setTotalStaking(t);
    }
  }, [stakingPositions.data]);

  useEffect(() => {
    if (balancePortions.data != null) {
      const t = [];
      for (let i = 0; i < balancePortions.data.length; i++) {
        const p = balancePortions.data[i];

        const amount = parseFloat(formatUnits(p.amount, 18));
        if (amount <= 0.0) {
          continue;
        }
        const initialAmount = `${amount
          .toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          .replace(/,/g, " ")} DEF`;

        // The dateNow cannot be less than the timestamp, only if the system time is set
        // incorrectly. Therefore, we are doing an additional check.
        let dateNow: number = Date.now();
        const portionTimestamp: number = Number(p.timestamp) * 1000;
        if (dateNow < portionTimestamp) {
          dateNow = portionTimestamp;
        }

        const diff = Math.floor(
          (dateNow - portionTimestamp) / (1000 * 60 * 60 * 24),
        );

        let currentAmount =
          amount * (dailyReductions[Math.min(diff, 8)] / 100.0);
        if (currentAmount === 0) {
          continue;
        }
        currentAmount = `${currentAmount
          .toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          .replace(/,/g, " ")} DEF`;

        t.push({
          id: i,
          date: formatDateTimeStamp(portionTimestamp),
          amount: currentAmount,
          initialAmount,
          daysAfter: Math.min(diff, 8),
          daysLeft: Math.max(0, 8 - diff),
        });
      }
      setPortions(t.reverse());
    }
  }, [balancePortions.data]);

  useEffect(() => {
    if (stakingPositions.data != null && balancePortions.data != null) {
      const values = [];
      for (let i = 0; i < balancePortions.data.length; i++) {
        const p = balancePortions.data[i];
        values.push({
          amount: parseFloat(formatUnits(p.amount, 18)),
          date: new Date(Number(p.timestamp) * 1000),
        });
      }
      for (let i = 0; i < stakingPositions.data.length; i++) {
        const s = stakingPositions.data[i];
        values.push({
          amount: parseFloat(formatUnits(s.amount, 18)),
          date: new Date(Number(s.startTime) * 1000),
        });
      }

      const fetchPriceResult = async () => {
        const res = await fetch(process.env.NEXT_PUBLIC_PRICES_CALCULATE_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const response = await res.json();
        return response.total;
      };
      fetchPriceResult().then((r) => {
        setEntryPrice(r != null ? r : 0.0);
      });
    }
  }, [stakingPositions.data, balancePortions.data]);

  const toFixed = (n, fixed) =>
    `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];

  return (
    <Block>
      <div className="flex items-end justify-between gap-4 px-8 pt-8">
        <Heading
          onClick={() => {
            if (navigator.clipboard && window.isSecureContext) {
              navigator.clipboard.writeText(address).then(() => {
                setCopy(true);
              });
            }
          }}
        >
          {t("PAGE_ACCOUNT_BALANCE")}{" "}
          {!copy && (
            <span className="text-xs hover:cursor-pointer text-gray-500">
              {address}
            </span>
          )}
          {copy && (
            <span className="text-xs hover:cursor-pointer text-gray-800">
              {address}
            </span>
          )}
        </Heading>
      </div>
      <div className="px-8 pb-8">
        <div className="mt-8 flex items-end justify-between">
          <Subheading>{t("PAGE_OVERVIEW")}</Subheading>
        </div>
        <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            title={t("PAGE_TOTAL_BALANCE")}
            value={formatTotalAssets()}
            change="+0%"
            noDivider={false}
          />
          <Stat
            title={t("PAGE_TOTAL_DEF")}
            value={formatTotalDef()}
            change="0%"
            noDivider={false}
          />
          <Stat
            title={t("PAGE_BALANCE_ON_WALLET")}
            value={formatData(balance)}
            change="0%"
            noDivider={false}
          />
          <Stat
            title={t("PAGE_BALANCE_ON_STAKING")}
            value={
              totalStaking != null ? (
                `${totalStaking
                  .toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  .replace(/,/g, " ")} DEF`
              ) : (
                <Spinner size="sm" />
              )
            }
            change="+0%"
            noDivider={false}
          />
        </div>
        <Divider className="mt-10" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5">
          <div className="col-span-1 block sm:grid sm:grid-cols-3 lg:block">
            <Stat
              title={t("PAGE_ENTRY_PRICE")}
              value={
                entryPrice != null ? (
                  formatPrice(entryPrice)
                ) : (
                  <Spinner size="sm" />
                )
              }
              change={null}
              noDivider
            />
            <Stat
              title={t("PAGE_MARKET_PRICE")}
              value={
                tokenPrice != null ? (
                  formatPrice(tokenPrice)
                ) : (
                  <Spinner size="sm" />
                )
              }
              change={null}
              noDivider
            />
            <div className="mt-2">
              <div className="mt-6 font-semibold text-sm/6">ROI</div>
              {roi != null && (
                <div
                  className={`mt-3 font-bold text-2xl/8 ${
                    roi.includes("+")
                      ? "text-lime-500"
                      : roi.includes("-")
                        ? "text-red-500"
                        : ""
                  }`}
                >
                  {roi}
                </div>
              )}
            </div>
            <div className="mt-2">
              <div className="mt-6 font-semibold text-sm/6">PNL</div>
              {pnl != null && (
                <div
                  className={`mt-3 font-bold text-2xl/8 ${
                    pnl.includes("+")
                      ? "text-lime-500"
                      : pnl.includes("-")
                        ? "text-red-500"
                        : ""
                  }`}
                >
                  {pnl}
                </div>
              )}
            </div>
          </div>
          <div className="w-full relative mt-10 -left-6 col-span-1 lg:-left-0 lg:mt-2 lg:col-span-3 xl:col-span-4">
            <PriceChart />
          </div>
        </div>

        <Subheading className="mt-14">{t("PAGE_BALANCE_POSITIONS")}</Subheading>
        {portions != null && (
          <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
            <TableHead>
              <TableRow>
                <TableHeader className="hidden md:table-cell">
                  {t("PAGE_POSITION_NUMBER")}
                </TableHeader>
                <TableHeader>{t("PAGE_AMOUNT")}</TableHeader>
                <TableHeader className="hidden md:table-cell">
                  {t("PAGE_INITIAL_AMOUNT")}
                </TableHeader>
                <TableHeader>{t("PAGE_CREATION")}</TableHeader>
                <TableHeader>{t("PAGE_ON_WALLET")}</TableHeader>
                <TableHeader>{t("PAGE_LEFT_TO_BURN")}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {portions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-zinc-500 border-none">
                    {t("PAGE_NO_BALANCE_POSITIONS")}
                  </TableCell>
                </TableRow>
              )}
              {portions.map((p, i, arr) => (
                <TableRow key={p.id}>
                  <TableCell
                    className={`hidden md:table-cell ${
                      i === arr.length - 1 ? "border-none" : ""
                    }`}
                  >
                    {p.id}
                  </TableCell>
                  <TableCell
                    className={i === arr.length - 1 ? "border-none" : ""}
                  >
                    {p.amount}
                  </TableCell>
                  <TableCell
                    className={`hidden md:table-cell ${
                      i === arr.length - 1 ? "border-none" : ""
                    }`}
                  >
                    {p.initialAmount}
                  </TableCell>
                  <TableCell
                    className={
                      i === arr.length - 1
                        ? "border-none text-zinc-500"
                        : "text-zinc-500"
                    }
                  >
                    {p.date}
                  </TableCell>
                  <TableCell
                    className={i === arr.length - 1 ? "border-none" : ""}
                  >
                    {p.daysAfter} {t("PAGE_DAYS")}
                  </TableCell>
                  <TableCell
                    className={i === arr.length - 1 ? "border-none" : ""}
                  >
                    {p.daysLeft} {t("PAGE_DAYS")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {portions == null && (
          <div className="text-center">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    </Block>
  );
}
