"use client";

import React, { useEffect, useState } from "react";
import Moralis from "moralis";
import { useAppKitAccount } from "@reown/appkit/react";
import { format, parseISO } from "date-fns";
import { Spinner } from "@heroui/react";
import { useTranslations } from "use-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { Heading } from "../../components/heading";
import Block from "../../template/block";
import { getTokenContract } from "../../contract/config";
import { Button } from "../../components/button";
import { Badge } from "../../components/badge";

export default function Transactions() {
  const t = useTranslations();
  const { address, isConnected } = useAppKitAccount();
  const tokenContract = getTokenContract();
  const [transactions, setTransactions] = useState(null);
  async function fetchTokenTransactions(address, tokenAddress) {
    return Moralis.EvmApi.token.getWalletTokenTransfers({
      address,
      chain: process.env.NEXT_PUBLIC_CHAIN_ID_HEX,
      order: "DESC",
      contractAddresses: [tokenAddress],
    });
  }

  useEffect(() => {
    if (address != null) {
      fetchTokenTransactions(address, tokenContract).then((r) => {
        console.log(r.raw.result);
        setTransactions(r.raw.result);
      });
    }
  }, [address]);

  const getTransactionBadge = (transaction) => {
    if (transaction.from_address === address?.toLowerCase()) {
      if (
        transaction.to_address === "0x0000000000000000000000000000000000000000"
      ) {
        return (
          <Badge color="yellow">{t("PAGE_TRANSACTIONS_STATUS_BURN")}</Badge>
        );
      }
      return (
        <Badge color="zinc">{t("PAGE_TRANSACTIONS_STATUS_OUTGOING")}</Badge>
      );
    }
    return <Badge color="lime">{t("PAGE_TRANSACTIONS_STATUS_INCOMING")}</Badge>;
  };

  const toFixed = (n, fixed) =>
    `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];

  return (
    <Block>
      <div className="flex items-end justify-between gap-4 pl-8 pt-8">
        <Heading>{t("PAGE_TRANSACTIONS_TITLE")}</Heading>
      </div>
      <div className="px-8 pb-8">
        {transactions != null && (
          <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
            <TableHead>
              <TableRow>
                <TableHeader>{t("PAGE_TRANSACTIONS_AMOUNT")}</TableHeader>
                <TableHeader>{t("PAGE_TRANSACTIONS_OPERATION")}</TableHeader>
                <TableHeader className="max-sm:hidden">
                  {t("PAGE_TRANSACTIONS_FROM")}
                </TableHeader>
                <TableHeader className="max-sm:hidden">
                  {t("PAGE_TRANSACTIONS_TO")}
                </TableHeader>
                <TableHeader>{t("PAGE_TRANSACTIONS_DATETIME")}</TableHeader>
                <TableHeader className="max-sm:hidden">
                  {t("PAGE_TRANSACTIONS_ACTION")}
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, i, arr) => (
                <TableRow
                  key={i}
                  onClick={() => {
                    window.open(
                      process.env.NEXT_PUBLIC_BSC_SCAN +
                        transaction.transaction_hash,
                    );
                  }}
                >
                  <TableCell
                    className={
                      i === arr.length - 1
                        ? "border-none font-medium"
                        : "font-medium"
                    }
                  >
                    {toFixed(parseFloat(transaction.value_decimal), 4)} DEF
                  </TableCell>
                  <TableCell
                    className={i === arr.length - 1 ? "border-none" : ""}
                  >
                    {getTransactionBadge(transaction)}
                  </TableCell>
                  <TableCell
                    className={
                      i === arr.length - 1
                        ? "border-none text-xs max-w-xs max-sm:hidden"
                        : "text-xs max-w-xs max-sm:hidden"
                    }
                  >
                    {transaction.from_address}
                  </TableCell>
                  <TableCell
                    className={
                      i === arr.length - 1
                        ? "border-none text-xs max-w-xs max-sm:hidden"
                        : "text-xs max-w-xs max-sm:hidden"
                    }
                  >
                    {transaction.to_address}
                  </TableCell>
                  <TableCell
                    className={
                      i === arr.length - 1 ? "border-none text-xs" : "text-xs"
                    }
                  >
                    {format(
                      parseISO(transaction.block_timestamp),
                      "yyyy-MM-dd HH:mm:ss",
                    )}
                  </TableCell>
                  <TableCell
                    className={
                      i === arr.length - 1
                        ? "border-none text-xs max-sm:hidden"
                        : "text-xs max-sm:hidden"
                    }
                  >
                    <Button
                      className="hover:cursor-pointer"
                      outline
                      onClick={() => {
                        window.open(
                          process.env.NEXT_PUBLIC_BSC_SCAN +
                            transaction.transaction_hash,
                        );
                      }}
                    >
                      {t("PAGE_TRANSACTIONS_VIEW_BUTTON")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {transactions == null && (
          <div className="text-center mt-4">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    </Block>
  );
}
