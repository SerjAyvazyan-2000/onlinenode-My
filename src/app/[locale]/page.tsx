"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import Landing from "../template/landing";
import Balance from "./balance";

export default function Home() {
  const searchParams = useSearchParams();
  const { isConnected, status } = useAppKitAccount();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const r = searchParams.get("r");
    if (r) {
      localStorage.setItem("r", r);
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      status == null ||
      status === "reconnecting" ||
      status === "connecting"
    ) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [status]);

  return (
    <>
      {!isConnected && showLoading && (
        <div className="mx-auto max-w-2xl  sm:py-48 lg:py-56">
          <div className="text-center">
            <Spinner size="lg" />
          </div>
        </div>
      )}
      {/*{isConnected && !showLoading && <Landing />}*/}
      {/*{isConnected && <Landing />}*/}
      {!showLoading && <Landing />}
    </>
  );
}
