"use client"
import { HistoricalDataPage } from "@/components/HistoricalData";
import Spinner from "@/components/Spinner";
import VerifyEmailArea from "@/components/VerifyEmail";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { Suspense } from "react";
import { RiFileWarningFill } from "react-icons/ri";
import { useAccount } from "wagmi";

const HistoricalDataSection = () => {
  const { address } = useAccount();
  if (!address) {
    return (
      <div className="w-full h-full mx-auto items-center justify-center flex text-center min-h-screen flex-col">
        <RiFileWarningFill className="size-12 fill-orange-500 border rounded-full p-2 border-orange-500 animate-ping duration-1000 transition-all ease-in-out mb-10" />
        <p className="text-medium italic font-semibold p-2">
          You need to connect your wallet to see historical data!
        </p>
        <ConnectButton />
      </div>
    );
  }
  return (
    <Suspense fallback={<Spinner />}>
      <section className="min-h-screen relative mx-auto">
        <HistoricalDataPage />
        <VerifyEmailArea />
      </section>
    </Suspense>
  );
};

export default HistoricalDataSection;
