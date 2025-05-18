"use client";
import Footer from "@/components/Footer";
import HeyYou2 from "@/components/HeyYou2";
import Grids from "@/components/LotteryArea/(scroll)/Grids";
import Community from "@/components/Community";
import Popup from "@/components/Popup";
import { useAccount, useChainId } from "wagmi";
import { WPInfo } from "@/components/WPInfo";
import RequestETH from "@/components/RequestETH";
import VerifyEmailArea from "@/components/VerifyEmail";
import { Suspense } from "react";
import { ReferralCodeHandler } from "@/components/ReferralCodeHandler";
import GridsBase from "@/components/LotteryArea/(base)/GridsBase";

export default function PlayHome() {
  const account = useAccount();
  const chainId = useChainId();

  return (
    <main>
      <Suspense>
        <ReferralCodeHandler />
        <div className="w-full h-full justify-center text-center overflow-x-hidden ">
          {account.address == undefined ? <Popup /> : ""}
          <VerifyEmailArea />
          <RequestETH />
          {/* <NewYearComponents /> */}
          {chainId == 534352 ? <Grids /> : <GridsBase />}
          <WPInfo />
          <HeyYou2 />
          {/* <Roadmap /> */}
          <div className="py-24">

          <Community />
          </div>
          {/* <Updates /> */}
          <div>
            <Footer />
          </div>
        </div>
      </Suspense>
    </main>
  );
}
