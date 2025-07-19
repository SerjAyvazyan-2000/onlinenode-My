"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/16/solid";
import { Token } from "@pancakeswap/sdk";
import { Spinner } from "@heroui/react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import {
  useBalance,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { BrowserProvider } from "ethers";
import { useTranslations } from "use-intl";
import PriceChart from "@/app/components/graph/priceChart";
import Modal from "../../components/modal";
import { Button } from "../../components/button";
import { Badge } from "../../components/badge";
import {
  getMainnet,
  getTokenContract,
  getTokenName,
  getTokenSymbol,
  getUSDTContract,
  getUSDTName,
  getUSDTSymbol,
} from "../../contract/config";
import { PancakeSwapV3TokenSwap } from "../../integration/PancakeSwapV3TokenSwap";

export default function Swap() {
  const t = useTranslations();
  const { open } = useAppKit();
  const { isConnected, status, address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);
  const [isLoadingSell, setIsLoadingSell] = useState(false);
  const [isLoadingBuy, setIsLoadingBuy] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input element
  const { data: walletClient } = useWalletClient();
  const [defaultDirection, setDefaultDirection] = useState(true);
  const [prevDirection, setPrevDirection] = useState(true);
  const [sellValue, setSellValue] = useState(null);
  const [buyValue, setBuyValue] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const pancake = new PancakeSwapV3TokenSwap();
  const usdt = new Token(
    getMainnet(),
    getUSDTContract(),
    18,
    getUSDTSymbol(),
    getUSDTName(),
  );
  const token = new Token(
    getMainnet(),
    getTokenContract(),
    18,
    getTokenSymbol(),
    getTokenName(),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [validation, setValidation] = useState(true);
  const usdtBalanceListener = useBalance({
    token: getUSDTContract(),
    address,
  });
  const tokenBalanceListener = useBalance({
    token: getTokenContract(),
    address,
  });

  const [usdtBalance, setUsdtBalance] = useState(null);
  const [defBalance, setDefBalance] = useState(null);

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

  useEffect(() => {
    if (sellValue != null && usdtBalance != null && defBalance != null) {
      const sellValueNumber = parseFloat(sellValue);
      if (defaultDirection) {
        setValidation(sellValueNumber <= usdtBalance);
      } else {
        setValidation(sellValueNumber * 1.05 <= defBalance);
      }
    } else {
      setValidation(true);
    }
  }, [defaultDirection, defBalance, usdtBalance, sellValue]);

  useEffect(() => {
    if (usdtBalanceListener.data != null) {
      setUsdtBalance(usdtBalanceListener.data.formatted);
    }
  }, [usdtBalanceListener.data]);

  useEffect(() => {
    if (tokenBalanceListener.data != null) {
      setDefBalance(tokenBalanceListener.data.formatted);
    }
  }, [tokenBalanceListener.data]);

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    refreshPrice();
  }, []);

  useEffect(() => {
    if (
      sellValue == null ||
      sellValue === "" ||
      parseFloat(sellValue) === 0.0
    ) {
      setBuyValue(null);
      refreshPrice();
    } else {
      setIsLoadingBuy(true);
      fetchDynamicPrice(sellValue).then((r) => {
        setIsLoadingBuy(false);
        setBuyValue(r);
        setTokenPrice(
          defaultDirection
            ? parseFloat(r) / parseFloat(sellValue)
            : parseFloat(sellValue) / parseFloat(r),
        );
      });
    }
  }, [sellValue]);

  const fetchDynamicPrice = async (value) => {
    try {
      let p = await pancake.fetchPriceWithAmount(
        value.toString(),
        defaultDirection ? usdt : token,
        defaultDirection ? token : usdt,
      );

      p = Number(p) / 10 ** 18;
      return Math.round(p * 100000) / 100000.0;
    } catch (e) {
      setModalType("error");
      setModalTitle("Error");
      setModalDescription("Not enough liquidity or RPC error");
      setIsModalOpen(true);
      // refreshPrice();
    }
  };

  const refreshPrice = async () => {
    fetchDynamicPrice(1.0).then((r) => {
      setTokenPrice(defaultDirection ? parseFloat(r) : 1.0 / parseFloat(r));
    });
  };

  const changeDirection = () => {
    setDefaultDirection((d) => !d);
    setSellValue(buyValue);
  };

  const swap = async () => {
    if (sellValue == null || sellValue == 0) {
      return;
    }

    setLoading(true);
    const amountToSwap = sellValue;
    const amountOutSwap = buyValue;
    const slippagePercent = 0.5;

    const { transport, chain } = walletClient;
    const provider = new BrowserProvider(transport, {
      chainId: chain?.id,
      name: chain?.name,
    });
    const signer = await provider.getSigner();

    pancake
      .simpleSwap(
        amountToSwap.toString(),
        amountOutSwap.toString(),
        defaultDirection ? usdt : token,
        defaultDirection ? token : usdt,
        signer,
        defaultDirection,
        slippagePercent,
      )
      .then((hash) => setTxHash(hash as `0x${string}`))
      .catch((e) => {
        console.log(e);
        setModalType("error");
        setModalTitle("Error");
        setModalDescription(
          `Transaction error: ${e?.message}` || " unknown error",
        );
        setIsModalOpen(true);
      })
      .finally(() => {
        refreshPrice();
        setSellValue(null);
        setBuyValue(null);
        setLoading(false);
      });
  };

  const toFixed = (n, fixed) => {
    if (n == null) {
      return null;
    }
    const r = `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`));
    if (r == null) {
      return null;
    }
    return r[0];
  };

  return (
    <div className="mx-auto max-w-7xl pt-16 pb-56 sm:py-32 lg:py-32 flex flex-wrap sm:flex-nowrap justify-between gap-5">
      {/* Этот DIV слева на больших экранах, снизу на мобильных */}
      <div className="w-full sm:w-1/2 md:w-3/5 lg:w-3/5 sm:order-1 order-2 sm:mr-0 mr-5 sm:pt-5">
        <PriceChart />
      </div>

      {/* Этот DIV справа на больших экранах, сверху на мобильных */}
      <div
        className="text-left bg-white p-5 rounded-2xl w-full sm:w-1/2 md:w-2/5 lg:w-2/5 sm:order-2 order-1"
        style={{ background: "rgb(255, 255, 255, 0.4)" }}
      >
        <p className="text-xl font-medium text-gray-900">
          {t("PAGE_SWAP_TITLE")}
        </p>

        <div className="relative max-lg:row-start-1 mt-2.5">
          <div className="rounded-2xl p-1">
            <div className="mt-2 isolate -space-y-px rounded-3xl">
              <div
                className="relative bg-gray-50 rounded-2xl rounded-b-none px-3 pb-3.5 pt-2.5
                               ring-inset ring-1 ring-gray-100 focus-within:z-10 focus-within:ring-1 focus-within:ring-gray-100
                                focus-within:bg-white"
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-500 pl-1 pt-1"
                >
                  {t("PAGE_SWAP_SELL")}
                </label>
                <input
                  id="sell"
                  name="sell"
                  type="text"
                  value={isLoadingSell ? "" : sellValue || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "") // Удаляем всё кроме цифр и точек
                      .replace(/(\..*)\./g, "$1") // Удаляем лишние точки
                      .replace(/^0+(\.)/, "0$1") // Оставляем один ноль перед точкой
                      .replace(/^0+([0-9])/, "$1"); // Удаляем ноль если перед точкой есть цифры
                    setSellValue(value);
                  }}
                  ref={inputRef}
                  placeholder={isLoadingSell ? "" : "0"}
                  className={`block text-3xl h-24 pl-1 pr-10 w-full border-0 p-0 placeholder:text-gray-400 focus:ring-0 sm:leading-6${
                    !validation ? " text-red-500" : " text-black"
                  }`}
                />
                {isLoadingSell && (
                  <div className="pointer-events-none absolute inset-y-5 left-3 flex items-center">
                    <Spinner className="p-2 pt-10" size="sm" />
                  </div>
                )}
                {isLoadingBuy && (
                  <div className="pointer-events-none absolute top-35 left-3 flex items-center z-50">
                    <Spinner className="p-2 pt-20" size="sm" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {!defaultDirection && (
                    <Button color="white">
                      <img
                        src="/icons/defcoin.png"
                        width={20}
                        height={20}
                        alt="DeflationCoin"
                      />
                      {token.symbol}
                    </Button>
                  )}
                  {defaultDirection && (
                    <Button color="white">
                      <img
                        src="/icons/tether-usdt-logo.png"
                        width={20}
                        height={20}
                        alt="Tether US"
                      />
                      {usdt.symbol}
                    </Button>
                  )}
                </div>
                <div className="absolute inset-y-4 left-0 flex items-center pt-4 mt-20 pl-2">
                  {!defaultDirection && sellValue != null && sellValue > 0 && (
                    <span className="text-xs pt-0.5 ml-2 text-neutral-400 font-semibold">
                      fee: {toFixed(parseFloat(sellValue) * 0.05, 4)} DEF
                    </span>
                  )}
                </div>
                <div
                  className="hover:cursor-pointer absolute inset-y-4 right-0 flex items-center pt-4 mt-20 pr-3"
                  onClick={() => {
                    setSellValue(
                      toFixed(
                        parseFloat(
                          defaultDirection
                            ? usdtBalance
                            : defBalance * (1.0 / 1.05),
                        ),
                        4,
                      ),
                    );
                  }}
                >
                  {defaultDirection && usdtBalance != null && (
                    <>
                      <span className="text-xs pt-0.5 mr-2 text-neutral-400 font-semibold">
                        {toFixed(parseFloat(usdtBalance), 4)} USDT
                      </span>
                      <Badge className="text-xs p-0" color="fuchsia">
                        {t("PAGE_SWAP_MAX")}
                      </Badge>
                    </>
                  )}
                  {!defaultDirection && defBalance != null && (
                    <>
                      <span className="text-xs pt-0.5 mr-2 text-neutral-400 font-semibold">
                        {toFixed(parseFloat(defBalance), 4)} DEF
                      </span>
                      <Badge className="text-xs p-0" color="fuchsia">
                        {t("PAGE_SWAP_MAX")}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <button
                  onClick={changeDirection}
                  type="button"
                  className="mt-3 rounded-full bg-indigo-600 p-2
                                    text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                                    focus-visible:outline-2 focus-visible:outline-offset-2
                                     focus-visible:outline-indigo-600"
                >
                  <ArrowsUpDownIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <div
                className="relative bg-gray-50 rounded-2xl rounded-t-none px-3 pb-3.5 pt-2
                             ring-inset ring-1 ring-gray-100 focus-within:z-10 focus-within:ring-1
                            focus-within:ring-gray-100 focus-within:bg-white"
              >
                <label
                  htmlFor="job-title"
                  className="block text-sm font-medium text-gray-500
                                pl-1 pt-1"
                >
                  {t("PAGE_SWAP_BUY")}
                </label>
                <input
                  id="buy"
                  name="buy"
                  type="text"
                  value={isLoadingBuy ? "" : buyValue || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "") // Удаляем всё кроме цифр и точек
                      .replace(/(\..*)\./g, "$1") // Удаляем лишние точки
                      .replace(/^0+(\.)/, "0$1") // Оставляем один ноль перед точкой
                      .replace(/^0+([0-9])/, "$1"); // Удаляем ноль если перед точкой есть цифры
                    setBuyValue(value);
                    if (value != null && value > 0) {
                      if (!defaultDirection) {
                        setSellValue(parseFloat(value) * tokenPrice);
                      } else {
                        setSellValue(parseFloat(value) * (1.0 / tokenPrice));
                      }
                    }
                  }}
                  placeholder={isLoadingBuy ? "" : "0"}
                  className="block h-24 w-full border-0 p-0 text-gray-900 text-3xl pl-1
                                    placeholder:text-gray-400 focus:ring-0 sm:leading-6 pr-10"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {defaultDirection && (
                    <Button color="white">
                      <img
                        src="/icons/defcoin.png"
                        width={20}
                        height={20}
                        alt="DeflationCoin"
                      />
                      {token.symbol}
                    </Button>
                  )}
                  {!defaultDirection && (
                    <Button color="white">
                      <img
                        src="/icons/tether-usdt-logo.png"
                        width={20}
                        height={20}
                        alt="Tether US"
                      />
                      {usdt.symbol}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:flex lg:flex-1 text-center px-1">
          {!validation && (
            <button
              disabled
              className="flex justify-center rounded-xl w-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-gray-900 hover:cursor-pointer focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-50
                          disabled:text-gray-500 disabled:shadow-none disabled:ring-1 disabled:ring-gray-100"
            >
              {t("PAGE_INSUFFICIENT")} {defaultDirection ? "USDT" : "DEF"}
            </button>
          )}
          {isConnected && !loading && validation && (
            <button
              onClick={() => swap()}
              className="rounded-xl w-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-gray-900 hover:cursor-pointer focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-50
                          disabled:text-gray-500 disabled:shadow-none disabled:ring-1 disabled:ring-gray-100"
            >
              {t("PAGE_SWAP_BUTTON")}
            </button>
          )}
          {isConnected && loading && (
            <button
              onClick={() => swap()}
              disabled
              className="flex justify-center rounded-xl w-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-gray-900 hover:cursor-pointer focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-50
                          disabled:text-gray-500 disabled:shadow-none disabled:ring-1 disabled:ring-gray-100"
            >
              <Spinner size="sm" className="mr-2" /> Confirming transaction
            </button>
          )}
          {!isConnected && (
            <button
              onClick={() => open({ view: "Connect" })}
              className="rounded-xl w-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-gray-900 hover:cursor-pointer focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-50
                          disabled:text-gray-500 disabled:shadow-none disabled:ring-1 disabled:ring-gray-100"
            >
              {t("PAGE_CONNECT_WALLET")}
            </button>
          )}
        </div>

        {tokenPrice == null && <Spinner className="p-2" size="sm" />}
        {tokenPrice != null && (
          <p className="text-xs p-2 pt-1.5 font-light">
            1 {defaultDirection ? usdt.symbol : token.symbol} ={" "}
            {toFixed(
              parseFloat(defaultDirection ? tokenPrice : 1.0 / tokenPrice),
              4,
            )}{" "}
            {defaultDirection ? token.symbol : usdt.symbol}
          </p>
        )}
        <p className="text-xs p-2 pt-3.5 font-light">
          <a
            className="font-semibold"
            target="blank"
            href="https://pancakeswap.finance/swap?outputCurrency=0xB0869A6727B513D9160Caaee446D7Cd97eCFbB07&inputCurrency=0x55d398326f99059fF775485246999027B3197955"
          >
            PancakeSwap
          </a>{" "}
          {t("PAGE_SWAP_PROVIDER_NOTE")}
        </p>
      </div>
      <Modal
        type={modalType}
        title={modalTitle}
        description={modalDescription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
