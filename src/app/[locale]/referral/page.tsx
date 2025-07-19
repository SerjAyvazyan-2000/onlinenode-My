"use client";

import React, { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { Heading } from "../../components/heading";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import Block from "../../template/block";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { getReferrals } from "../../contract/config";

export default function Referral() {
  const locale = useLocale();
  const t = useTranslations();
  const { address } = useAppKitAccount();
  const [copy, setCopy] = useState(false);
  const [referrals, setReferrals] = useState(null);

  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 3000);
    }
  }, [copy]);

  useEffect(() => {
    if (address != null) {
      getReferrals(address)
        .then((referer) => {
          if (referer.referrals != null && referer.referrals.length > 0) {
            const updatedReferrals = referer.referrals.map((referral) => {
              const date = new Date(referral.created_at);
              // Проверка валидности даты
              if (Number.isNaN(date.getTime())) {
                console.error(
                  `Invalid referral date.created_at: ${referral.created_at}`,
                );
                return { ...referral }; // Возвращаем исходный объект без изменений
              }

              // TODO: С бэка приходит некорректное время в формате UTC, на 3 часа больше.
              // Поэтому отнимаем 3 часа. Позже как починим бэк, нужно будет актуализировать этот код.
              // Заведен тикет в Backlog: ON#130
              date.setHours(date.getHours() - 3);
              return {
                ...referral,
                created_at: date.toISOString(),
              };
            });

            setReferrals(updatedReferrals);
          }
        })
        .catch((error) => {
          console.error("Error when requesting referrals:", error);
        });
    }
  }, [address]);

  return (
    <Block small>
      <div className="flex items-center text-center justify-between gap-4 px-8 pt-8">
        <Heading>{t("PAGE_REFERRAL_LINK")}</Heading>
      </div>
      <div className="px-8 pb-8 pt-6" align="center">
        <div className="max-w-2xl pb-4">
          {address != null && (
            <div className="flex max-w-2xl">
              <Input
                type="text"
                aria-label="referral"
                name="referral"
                value={`https://defcoin.app/?r=${address}`}
                readOnly
              />

              {!copy && (
                <Button
                  className="ml-2 hover:cursor-pointer"
                  onClick={() => {
                    if (navigator.clipboard && window.isSecureContext) {
                      navigator.clipboard
                        .writeText(`https://defcoin.app/?r=${address}`)
                        .then(() => {
                          setCopy(true);
                        });
                    }
                  }}
                >
                  {t("PAGE_COPY")}
                </Button>
              )}
              {copy && (
                <Button className="ml-2" disabled>
                  {t("PAGE_COPY")}
                </Button>
              )}
            </div>
          )}
        </div>

        {referrals != null && (
          <dl className="border-t-1 border-b-1 mb-5 pb-5 mt-4 space-y-6 divide-y divide-gray-900/10">
            <Disclosure key="1" as="div" className="pt-6">
              <dt>
                <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                  <span className="text-base font-semibold leading-7">
                    {t("PAGE_YOUR_REFERRALS")}
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
                <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                  <TableHead>
                    <TableRow>
                      <TableHeader>{t("PAGE_REFERRAL")}</TableHeader>
                      <TableHeader>{t("PAGE_DATE")}</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referrals.map((r, i, arr) => (
                      <TableRow key={i}>
                        <TableCell
                          className={i === arr.length - 1 ? "border-none" : ""}
                        >
                          {r.referee}
                        </TableCell>
                        <TableCell
                          className={i === arr.length - 1 ? "border-none" : ""}
                        >
                          {new Date(r.created_at).toLocaleString(locale, {
                            dateStyle: "medium",
                            timeStyle: "medium",
                            hour12: false,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DisclosurePanel>
            </Disclosure>
          </dl>
        )}
        {locale === "en" && (
          <>
            <div className="mt-10">
              <h3 className="font-bold">
                Distribution of a 5% Fee with the Use of a Referral System.
              </h3>
              <img
                className="max-w-2xl max-sm:max-w-sm"
                src="/smartfees.png"
                alt="Referral system"
              />
            </div>

            <div className="mt-10 pt-4 text-left text-sm">
              <p className="indent-8">
                <b>Element 1: Burning.</b>
              </p>

              <p className="mt-4 indent-8">
                2.25% of the coins are transferred to the "Complete Burn"
                wallet, where they are permanently removed from circulation.
                This element systematically reduces the circulating supply of
                coins, intensifying deflation.
              </p>

              <p className="mt-4 indent-8">
                <b>Element 2: Partner Marketing.</b>
              </p>

              <p className="mt-4 indent-8">
                When Wallet A is created using the referral link of Wallet N,
                2.25% of the coins from any transaction made by Wallet A are
                transferred to Wallet N as a reward for participating in the
                referral program. If Wallet A is not registered via a referral
                link, the distribution of smart commissions will follow the
                first scenario described earlier.
              </p>

              <p className="mt-4 indent-8">
                <b>Element 3: Discount on Commissions for Referred Users</b>
              </p>

              <p className="mt-4 indent-8">
                If Wallet A is created via the referral link of Wallet N, all
                future transactions of Wallet A will receive a 0.5% discount on
                the standard 5% commission. As a result, the commission for
                Wallet A will be reduced to 4.5%. This element, combined with
                Element 2, enhances the effectiveness of the partner marketing
                program.
              </p>
            </div>
          </>
        )}
        {locale === "ru" && (
          <>
            <div className="mt-10">
              <h3 className="font-bold">
                Распределение комиссии в размере 5% при использовании
                реферальной системы.
              </h3>
              <img
                className="max-w-2xl max-sm:max-w-sm"
                src="/referal_ru.png"
                alt="Реферальная система"
              />
            </div>

            <div className="mt-10 pt-4 text-left text-sm">
              <p className="indent-8">
                <b>Элемент 1: Сжигание.</b>
              </p>

              <p className="mt-4 indent-8">
                2,25% монет переводится на кошелек «Полное сжигание», где
                удаляются из обращения навсегда. Данный элемент будет
                систематически уменьшать предложение монет в обращение, усиливая
                дефляцию.
              </p>

              <p className="mt-4 indent-8">
                <b>Элемент 2: Партнерский маркетинг.</b>
              </p>

              <p className="mt-4 indent-8">
                Когда кошелек A был создан по реферальной ссылке кошелька N, то
                2,25% монет от суммы любой транзакций кошелька A переводится на
                кошелек N в качестве вознаграждения за участие в партнёрской
                программе. Если кошелёк A не был зарегистрирован по реферальной
                ссылке, то распределение смарт-комиссий будет осуществляться по
                первому сценарию, описанному ранее.
              </p>

              <p className="mt-4 indent-8">
                <b>Элемент 3: Скидка на комиссии приглашенному пользователю.</b>
              </p>

              <p className="mt-4 indent-8">
                Если кошелёк A создан по реферальной ссылке кошелька N, на все
                его будущие транзакции будет действовать скидка 0,5% от
                стандартной комиссии в 5%. В результате комиссия для кошелька A
                составит 4,5%. Этот элемент, в сочетании с элементом 2,
                усиливает эффективность партнёрского маркетинга.
              </p>
            </div>
          </>
        )}
      </div>
    </Block>
  );
}
