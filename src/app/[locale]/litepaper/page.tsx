"use client";

import React from "react";
import { useTranslations } from "use-intl";
import dynamic from "next/dynamic";
import { Spinner } from "@heroui/react";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import Block from "../../template/block";
import { Divider } from "../../components/divider";

// Dynamic import of PDF component (without SSR)
const PdfViewer = dynamic(() => import("@/app/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center">
      <Spinner className="p-10" size="lg" />
    </div>
  ),
});

function saveAsFile(fileUrl, fileName) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName; // Set the suggested file name

  // Append the lnk to the body (necessary for some browsers)
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Remove the link after download
  document.body.removeChild(link);
}

export default function Litepaper() {
  const t = useTranslations();

  return (
    <Block>
      <div className="flex items-end justify-between gap-4 px-8 pt-8">
        <Heading className="max-sm:text-xl">Litepaper</Heading>
        <Button
          onClick={() =>
            saveAsFile(`/${t("PAGE_LITEPAPER_PDF")}`, t("PAGE_LITEPAPER_PDF"))
          }
          className="-my-0.5 hover:cursor-pointer max-sm:text-sm"
        >
          {t("PAGE_DOWNLOAD_PDF")}
        </Button>
      </div>
      <Divider className="mt-6 mb-2" soft />
      <PdfViewer pdfFile={`/${t("PAGE_LITEPAPER_PDF")}`} />
    </Block>
  );
}
