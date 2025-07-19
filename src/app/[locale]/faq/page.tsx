"use client";

import React, { useState } from "react";
import { useTranslations } from "use-intl"; // Или "next-intl"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

// Предположим, "Block" и "Divider" — локальные компоненты
import Block from "@/app/template/block";
import { Divider } from "@/app/components/divider";
import { useLocale } from "next-intl";
import YoutubeEmbed from "@/app/components/youtube/YoutubeEmbed";
import RuTubeEmbed from "@/app/components/youtube/RutubeEmbed";

export default function FAQ() {
  const t = useTranslations();
  const locale = useLocale();
  const [youtubeTime, setYoutubeTime] = useState(0);

  return (
    <Block>
      <div className="mx-auto divide-y divide-gray-900/10 p-8">
        {/* Заголовок FAQ */}
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          {t("FAQ_TITLE")}
        </h2>

        <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
          {/* ---------------- Q1 ---------------- */}
          <Disclosure as="div" className="pt-6">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base font-semibold leading-7">
                  {t("FAQ_Q1_TITLE")}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  <PlusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 group-data-[open]:hidden"
                  />
                  <MinusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel
              as="dd"
              className="mt-2 pr-12 space-y-3 pt-4 text-sm"
            >
              {locale === "en" && (
                <>
                  <YoutubeEmbed
                    videoId="LatFxeoa6QU"
                    startTime={0}
                    seekTime={youtubeTime}
                  />
                  <div className="mt-2 rounded-xl bg-gray-100 p-5">
                    <p className="mb-2 font-medium">
                      VIDEO: How to buy DeflationCoin?
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(0)}
                      >
                        0:00
                      </a>{" "}
                      Download MetaMask from the official website.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(15)}
                      >
                        0:15
                      </a>{" "}
                      Create an account in MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(41)}
                      >
                        0:41
                      </a>{" "}
                      Switch the network in MetaMask to Binance Smart Chain.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(54)}
                      >
                        0:54
                      </a>{" "}
                      Go to the P2P Trading section on a centralized exchange.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(69)}
                      >
                        1:09
                      </a>{" "}
                      In the filters section, enable “Verified Advertisers” to
                      minimize the risk of fraud.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(76)}
                      >
                        1:16
                      </a>{" "}
                      Purchase USDT.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(142)}
                      >
                        2:22
                      </a>{" "}
                      Convert USDT to BNB on the centralized exchange.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(175)}
                      >
                        2:55
                      </a>{" "}
                      Copy your BSC wallet address in MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(180)}
                      >
                        3:00
                      </a>{" "}
                      Transfer BNB to your MetaMask wallet.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(224)}
                      >
                        3:44
                      </a>{" "}
                      Visit defcoin.app and log in using MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(230)}
                      >
                        3:50
                      </a>{" "}
                      Go to the SWAP section and convert most of your BNB to
                      USDT.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(244)}
                      >
                        4:04
                      </a>{" "}
                      Important: Keep a small amount of BNB for future
                      transaction confirmations in MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(258)}
                      >
                        4:18
                      </a>{" "}
                      Import USDT into MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(274)}
                      >
                        4:34
                      </a>{" "}
                      In the BUY section, purchase DeflationCoin and confirm the
                      transaction in MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(301)}
                      >
                        5:01
                      </a>{" "}
                      Go to the Stake section and deposit your coins into
                      staking.
                    </p>
                  </div>
                </>
              )}
              {locale === "ru" && (
                <>
                  <RuTubeEmbed
                    src="https://rutube.ru/play/embed/6740ed6f6160cca6d9ac050c071ddcd9"
                    seekTime={youtubeTime}
                  />
                  <div className="mt-2 rounded-xl bg-gray-100 p-5">
                    <p className="mb-2 font-medium">
                      Видео: Как купить DeflationCoin?
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(0)}
                      >
                        0:00
                      </a>{" "}
                      Скачиваем MetaMask с официального сайта.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(15)}
                      >
                        0:15
                      </a>{" "}
                      Создаём аккаунт в MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(41)}
                      >
                        0:41
                      </a>{" "}
                      Переключаем сеть в MetaMask на Binance Smart Chain.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(54)}
                      >
                        0:54
                      </a>{" "}
                      Заходим в раздел P2P Trading на централизованной бирже.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(69)}
                      >
                        1:09
                      </a>{" "}
                      В разделе фильтры ставим “Verified Advertisers” для
                      минимизации рисков мошенничества.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(76)}
                      >
                        1:16
                      </a>{" "}
                      Приобретаем USDT.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(142)}
                      >
                        2:22
                      </a>{" "}
                      На централизованной бирже конвертируем USDT в BNB.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(175)}
                      >
                        2:55
                      </a>{" "}
                      Копируем адрес кошелька сети BSC в MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(180)}
                      >
                        3:00
                      </a>{" "}
                      Переводим BNB на свой MetaMask-кошелёк.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(224)}
                      >
                        3:44
                      </a>{" "}
                      Переходим на сайт defcoin.app и авторизуемся с
                      помощью MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(230)}
                      >
                        3:50
                      </a>{" "}
                      Переходим в раздел SWAP и конвертируем большую часть BNB в
                      USDT.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(244)}
                      >
                        4:04
                      </a>{" "}
                      Важно: оставить небольшое количество BNB для последующего
                      подтверждения транзакций в MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(258)}
                      >
                        4:18
                      </a>{" "}
                      Импортируем USDT в MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(274)}
                      >
                        4:34
                      </a>{" "}
                      В разделе BUY покупаем DeflationCoin и подтверждаем
                      транзакцию в MetaMask.
                    </p>
                    <p>
                      <a
                        className="text-blue-700 font-mono hover:cursor-pointer"
                        onClick={() => setYoutubeTime(301)}
                      >
                        5:01
                      </a>{" "}
                      Переходим в раздел Stake и вносим монеты в стейкинг.
                    </p>
                  </div>
                </>
              )}
              <p className="indent-8">{t("FAQ_Q1_PARA_1")}</p>
              <ul className="list-disc list-inside indent-5">
                <li>
                  <b>{t("FAQ_Q1_RECOMMENDATION")}:</b>{" "}
                  {t("FAQ_Q1_RECOMMENDATION_TEXT")}
                </li>
              </ul>

              <Divider className="pt-2 pb-4" />
              <p className="indent-8">{t("FAQ_Q1_PARA_2")}</p>

              {/* Таблица (все строки выписаны) */}
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 w-1" />
                    <th className="border border-gray-300 px-4 py-2">
                      {t("FAQ_Q1_TABLE_METHOD")}
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      {t("FAQ_Q1_TABLE_FEE")}
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      {t("FAQ_Q1_TABLE_SPEED")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 w-1">1</td>
                    <td className="border border-gray-300 px-4 py-2">P2P</td>
                    <td className="border border-gray-300 px-4 py-2">
                      from 0%
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      10-60 minutes
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 w-1">2</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Centralized exchanges
                    </td>
                    <td className="border border-gray-300 px-4 py-2">0.1-1%</td>
                    <td className="border border-gray-300 px-4 py-2">
                      1-15 minutes
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 w-1">3</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Web3 wallet
                    </td>
                    <td className="border border-gray-300 px-4 py-2">0.3-7%</td>
                    <td className="border border-gray-300 px-4 py-2">
                      5-20 minutes
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 w-1">4</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Physical exchange office
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      from 1%
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      5-30 minutes
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-lg font-semibold pt-5 pl-3">
                {t("FAQ_Q1_SUBTITLE_1")}
              </h2>
              <p className="indent-8">{t("FAQ_Q1_P2P_TEXT_1")}</p>
              <p className="indent-8">
                <strong>{t("FAQ_Q1_HOW_TO_BUY")}</strong>
              </p>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q1_P2P_TEXT_2")}</li>
                <li>{t("FAQ_Q1_P2P_TEXT_3")}</li>
                <li>{t("FAQ_Q1_P2P_TEXT_4")}</li>
                <li>{t("FAQ_Q1_P2P_TEXT_5")}</li>
                <li>{t("FAQ_Q1_P2P_TEXT_6")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-5 pl-3">
                {t("FAQ_Q1_SUBTITLE_2")}
              </h2>
              <p className="indent-8">{t("FAQ_Q1_CEX_TEXT_1")}</p>
              <p className="indent-8">
                <strong>{t("FAQ_Q1_CEX_TEXT_2")}</strong>
              </p>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q1_CEX_TEXT_3")}</li>
                <li>{t("FAQ_Q1_CEX_TEXT_4")}</li>
                <li>{t("FAQ_Q1_CEX_TEXT_5")}</li>
                <li>{t("FAQ_Q1_CEX_TEXT_6")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-5 pl-3">
                {t("FAQ_Q1_SUBTITLE_3")}
              </h2>
              <p className="indent-8">{t("FAQ_Q1_WEB3_TEXT_1")}</p>
              <p className="indent-8">{t("FAQ_Q1_WEB3_TEXT_2")}</p>
              <p className="indent-8">
                <strong>{t("FAQ_Q1_HOW_TO_DO_IT")}</strong>
              </p>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q1_WEB3_TEXT_3")}</li>
                <li>{t("FAQ_Q1_WEB3_TEXT_4")}</li>
                <li>{t("FAQ_Q1_WEB3_TEXT_5")}</li>
                <li>{t("FAQ_Q1_WEB3_TEXT_6")}</li>
                <li>{t("FAQ_Q1_WEB3_TEXT_7")}</li>
                <li>{t("FAQ_Q1_WEB3_TEXT_8")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-5 pl-3">
                {t("FAQ_Q1_SUBTITLE_4")}
              </h2>
              <p className="indent-8">{t("FAQ_Q1_PHYSICAL_TEXT_1")}</p>
              <p className="indent-8">
                <strong>{t("FAQ_Q1_PHYSICAL_TEXT_2")}</strong>
              </p>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q1_PHYSICAL_TEXT_3")}</li>
                <li>{t("FAQ_Q1_PHYSICAL_TEXT_4")}</li>
                <li>{t("FAQ_Q1_PHYSICAL_TEXT_5")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <p className="indent-8">{t("FAQ_Q1_CONCLUSION_1")}</p>
              <p className="indent-8">{t("FAQ_Q1_CONCLUSION_2")}</p>
            </DisclosurePanel>
          </Disclosure>

          {/* ---------------- Q2 ---------------- */}
          <Disclosure as="div" className="pt-6">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base font-semibold leading-7">
                  {t("FAQ_Q2_TITLE")}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  <PlusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 group-data-[open]:hidden"
                  />
                  <MinusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel
              as="dd"
              className="mt-2 pr-12 space-y-3 pt-4 text-sm"
            >
              <p className="indent-8">{t("FAQ_Q2_PARAGRAPH_1")}</p>
              <p className="indent-8">{t("FAQ_Q2_PARAGRAPH_2")}</p>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-3 pb-2 pl-3">
                {t("FAQ_Q2_SECURITY_RULES_TITLE")}
              </h2>

              <p className="indent-8">
                <strong>{t("FAQ_Q2_SR_1")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q2_SR_1_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q2_SR_2")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q2_SR_2_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q2_SR_3")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q2_SR_3_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q2_SR_4")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q2_SR_4_TEXT")}</p>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q2_STEP_1_TITLE")}
              </h2>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q2_STEP_1_LIST_1")}</li>
                <li>{t("FAQ_Q2_STEP_1_LIST_2")}</li>
                <li>{t("FAQ_Q2_STEP_1_LIST_3")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q2_STEP_2_TITLE")}
              </h2>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q2_STEP_2_LIST_1")}</li>
                <li>{t("FAQ_Q2_STEP_2_LIST_2")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q2_STEP_3_TITLE")}
              </h2>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q2_STEP_3_LIST_1")}</li>
                <li>{t("FAQ_Q2_STEP_3_LIST_2")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q2_STEP_4_TITLE")}
              </h2>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q2_STEP_4_LIST_1")}</li>
                <li>{t("FAQ_Q2_STEP_4_LIST_2")}</li>
                <li>{t("FAQ_Q2_STEP_4_LIST_3")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q2_CONCLUSION_TITLE")}
              </h2>
              <p className="indent-8">{t("FAQ_Q2_CONCLUSION_1")}</p>
              <p className="indent-8">{t("FAQ_Q2_CONCLUSION_2")}</p>
              <ul className="list-disc list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q2_CONCLUSION_3")}</li>
                <li>{t("FAQ_Q2_CONCLUSION_4")}</li>
              </ul>
              <p className="indent-8">{t("FAQ_Q2_CONCLUSION_5")}</p>
            </DisclosurePanel>
          </Disclosure>

          {/* ---------------- Q3 ---------------- */}
          <Disclosure as="div" className="pt-6">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base font-semibold leading-7">
                  {t("FAQ_Q3_TITLE")}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  <PlusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 group-data-[open]:hidden"
                  />
                  <MinusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel
              as="dd"
              className="mt-2 pr-12 space-y-3 pt-4 text-sm"
            >
              <p className="indent-8">{t("FAQ_Q3_PARAGRAPH_1")}</p>
              <p className="indent-8">{t("FAQ_Q3_PARAGRAPH_2")}</p>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q3_HOW_TO_STAKE")}
              </h2>
              <p className="indent-8">{t("FAQ_Q3_HOW_TO_STAKE_TEXT")}</p>
              <ul className="list-decimal list-inside indent-8 -ml-4">
                <li>{t("FAQ_Q3_LIST_1")}</li>
                <li>{t("FAQ_Q3_LIST_2")}</li>
                <li>{t("FAQ_Q3_LIST_3")}</li>
                <li>{t("FAQ_Q3_LIST_4")}</li>
                <li>{t("FAQ_Q3_LIST_5")}</li>
                <li>{t("FAQ_Q3_LIST_6")}</li>
              </ul>

              <br />
              <Divider className="pt-2" />
              <h2 className="text-lg font-semibold pt-2 pl-3">
                {t("FAQ_Q3_CONCLUSION_TITLE")}
              </h2>
              <p className="indent-8">{t("FAQ_Q3_CONCLUSION_TEXT")}</p>
            </DisclosurePanel>
          </Disclosure>

          {/* ---------------- Q4 ---------------- */}
          <Disclosure as="div" className="pt-6">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base font-semibold leading-7">
                  {t("FAQ_Q4_TITLE")}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  <PlusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 group-data-[open]:hidden"
                  />
                  <MinusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel
              as="dd"
              className="mt-2 pr-12 space-y-3 pt-4 text-sm"
            >
              <p className="indent-8 pb-2">{t("FAQ_Q4_PARAGRAPH_1")}</p>
              <Divider className="pt-3" />

              {/* Пункты 1..8 */}
              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_1_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_1_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_2_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_2_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_3_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_3_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_4_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_4_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_5_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_5_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_6_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_6_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_7_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_7_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q4_LIST_8_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_LIST_8_TEXT")}</p>

              <Divider className="pt-3" />
              <p className="indent-8">
                <strong>{t("FAQ_Q4_CONCLUSION_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q4_CONCLUSION_TEXT")}</p>
            </DisclosurePanel>
          </Disclosure>

          {/* ---------------- Q5 ---------------- */}
          <Disclosure as="div" className="pt-6">
            <dt>
              <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base font-semibold leading-7">
                  {t("FAQ_Q5_TITLE")}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  <PlusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 group-data-[open]:hidden"
                  />
                  <MinusSmallIcon
                    aria-hidden="true"
                    className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel
              as="dd"
              className="mt-2 pr-12 space-y-3 pt-4 text-sm"
            >
              <p className="indent-8 pb-3">{t("FAQ_Q5_PARAGRAPH_1")}</p>
              <Divider className="pt-3" />

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_1_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_SP_1_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_2_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_SP_2_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_3_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_SP_3_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_4_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_SP_4_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_5_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_SP_5_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_6_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_SP_6_TEXT")}</p>

              <p className="indent-8">
                <strong>{t("FAQ_Q5_SP_7_TITLE")}</strong>
              </p>
              <p className="indent-8 pb-3">{t("FAQ_Q5_SP_7_TEXT")}</p>

              <Divider className="pt-3" />
              <p className="indent-8">
                <strong>{t("FAQ_Q5_CONCLUSION_TITLE")}</strong>
              </p>
              <p className="indent-8">{t("FAQ_Q5_CONCLUSION_TEXT")}</p>
            </DisclosurePanel>
          </Disclosure>
        </dl>
      </div>
    </Block>
  );
}
