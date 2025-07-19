import "../globals.css";
import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { NextIntlClientProvider } from "next-intl";
import Template from "../template/template";
import ContextProvider from "../context";
import Script from "next/script";

const SUPPORTED_LOCALES = ["en", "ru"];
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const messagesFilePath = path.join(
    process.cwd(),
    "src/messages",
    `${locale}.json`,
  );
  const messages = JSON.parse(fs.readFileSync(messagesFilePath, "utf-8"));

  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  const xMobileApp = headersObj.get("x-mobile-app");
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html>
        <head>
          <title>DeflationCoin Online Node</title>
          <link rel="stylesheet" href="/inter.css" />
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-EWJVYK99JR"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EWJVYK99JR');
            `}
          </Script>
          <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        </head>
        <body className="text-zinc-950 antialiased">
          <ContextProvider cookies={cookies}>
            <Template xMobileApp={xMobileApp}>{children}</Template>
          </ContextProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
