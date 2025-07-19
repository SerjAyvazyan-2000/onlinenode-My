"use client";

import { useEffect, useRef, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { Spinner } from "@heroui/react";
import { parseUnits } from "viem";

import { useTranslations } from "use-intl";
import Modal from "../../components/modal";
import { getContractAbi, getTokenContract } from "../../contract/config";

export default function Send() {
  const t = useTranslations();
  const { open, close } = useAppKit();
  const abi = getContractAbi();
  const tokenContract = getTokenContract();
  const inputRef = useRef(null); // Create a ref for the input element
  const { writeContract } = useWriteContract();
  const { address, isConnected } = useAppKitAccount();
  const [amount, setAmount] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    console.log("isLoadingTransaction: ", isLoading);
    console.log("isSuccessTransaction: ", isSuccess);
    console.log("isErrorTransaction: ", isError);
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
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const send = () => {
    if (amount == null || amount <= 0.0) {
      alert(t("PAGE_TRANSFER_ERROR_AMOUNT"));
      return;
    }

    if (toAddress == null || toAddress === "") {
      alert(t("PAGE_TRANSFER_ERROR_ADDRESS"));
      return;
    }

    setLoading(true);

    writeContract(
      {
        abi,
        address: tokenContract,
        functionName: "transfer",
        args: [toAddress, parseUnits(amount.toString(10), 18)],
      },
      {
        onSuccess: (hash) => {
          console.log("Transaction hash:", hash);
          setTxHash(hash as `0x${string}`);
        },
        onError: (e) => {
          alert(e.message);
          console.log(e);
        },
        onSettled: () => {
          setLoading(false);
          setAmount("");
          setToAddress("");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-lg py-32 sm:py-32 lg:py-32">
      <div
        className="text-left bg-white p-5 rounded-2xl"
        style={{ background: "rgb(255, 255, 255, 0.4)" }}
      >
        <p className="text-xl font-medium text-gray-900">
          {t("PAGE_TRANSFER_TITLE")}
        </p>

        <div className="relative max-lg:row-start-1 mt-5">
          <div className="rounded-2xl p-1">
            <div className="mt-2 isolate -space-y-px rounded-3xl">
              <div
                className="relative bg-gray-50 rounded-2xl rounded-b-none px-3 pb-1.5 pt-2.5
                               ring-inset ring-1 ring-gray-100 focus-within:z-10 focus-within:ring-1 focus-within:ring-gray-100
                                focus-within:bg-white"
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-500 pl-1 pt-1"
                >
                  {t("PAGE_TRANSFER_AMOUNT")}
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "") // Удаляем всё кроме цифр и точек
                      .replace(/(\..*)\./g, "$1") // Удаляем лишние точки
                      .replace(/^0+(\.)/, "0$1") // Оставляем один ноль перед точкой
                      .replace(/^0+([0-9])/, "$1"); // Удаляем ноль если перед точкой есть цифры
                    setAmount(value);
                  }}
                  value={amount || ""}
                  ref={inputRef}
                  placeholder="0"
                  className="block
                                    text-3xl text-black h-16 pl-1 pr-10
                                    w-full border-0 p-0 placeholder:text-gray-400
                                     focus:ring-0 sm:leading-6"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    id="price-currency"
                    className="text-gray-500 sm:text-sm pr-1 pt-5"
                  >
                    DEF
                  </span>
                </div>
              </div>
              <div
                className="relative bg-gray-50 rounded-2xl rounded-t-none px-3 pb-1.5 pt-2.5
                             ring-inset ring-1 ring-gray-100 focus-within:z-10 focus-within:ring-1
                            focus-within:ring-gray-100 focus-within:bg-white"
              >
                <label
                  htmlFor="job-title"
                  className="block text-sm font-medium text-gray-500
                                pl-1 pt-1"
                >
                  {t("PAGE_TRANSFER_CONTRACT_ADDRESS")}
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={toAddress || ""}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder={t("PAGE_TRANSFER_ADDRESS_PLACEHOLDER")}
                  className="block h-16 w-full border-0 p-0 text-gray-900 text-md pl-1
                                    placeholder:text-gray-400 focus:ring-0 sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:flex lg:flex-1 mt-1 text-center px-1">
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
          {isConnected && !loading && (
            <button
              onClick={send}
              className="rounded-xl w-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-gray-900 hover:cursor-pointer focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-50
                          disabled:text-gray-500 disabled:shadow-none disabled:ring-1 disabled:ring-gray-100"
            >
              {t("PAGE_TRANSFER_SEND_BUTTON")}
            </button>
          )}
          {isConnected && loading && (
            <button
              onClick={send}
              disabled
              className="flex justify-center rounded-xl w-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-gray-900 hover:cursor-pointer focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-50
                          disabled:text-gray-500 disabled:shadow-none disabled:ring-1 disabled:ring-gray-100"
            >
              <Spinner size="sm" className="mr-2" />{" "}
              {t("PAGE_STAKING_MODAL_CONFIRMING")}
            </button>
          )}
        </div>
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
