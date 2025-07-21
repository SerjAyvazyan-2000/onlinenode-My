"use client";

import React, { useEffect, useState } from "react";
import Moralis from "moralis";
import { Providers } from "../[locale]/providers";
import Header from "./header";
import { moralisApiKey } from "../config/moralis";
import Footer from "./footer";

export default function Template({
  children,
  xMobileApp,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobilePadding, setMobilePadding] = useState(false);

  useEffect(() => {
    initMoralis().then((r) => {});
  }, []);

  useEffect(() => {
    if (xMobileApp != null && xMobileApp != "") {
      if (!mobilePadding) {
        setMobilePadding(true);
      }
    } else if (mobilePadding) {
      setMobilePadding(false);
    }
  }, [xMobileApp]);

  const initMoralis = async () => {
    await Moralis.start({ apiKey: moralisApiKey });
  };

  return (
    <div className="bg-white overflow-hidden">
      <Header xMobileApp={xMobileApp} />
      <div
        className={`relative isolate ${
          mobilePadding ? " mt-6" : ""
        }`}>

        <Providers>{children}</Providers>

      </div>
      <Footer/>
    </div>
  );
}
