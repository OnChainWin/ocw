"use client";
import Footer from "@/components/Footer";
import Popup from "@/components/Popup";
import { useAccount, useChainId } from "wagmi";
import RequestETH from "@/components/RequestETH";
import VerifyEmailArea from "@/components/VerifyEmail";
import { Suspense } from "react";
import { ReferralCodeHandler } from "@/components/ReferralCodeHandler";
import EventComponent from "@/components/LotteryArea/(base)/(subcomponents)/EventComponent";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BaseSwitcher from "@/components/LotteryArea/(base)/BaseSwitcher";
import { WPInfo } from "@/components/WPInfo";
import Community from "@/components/Community";

export default function PlayHome() {
  const chainId = useChainId();
  const account = useAccount();

  return (
    <main>
      <Suspense>
        <ReferralCodeHandler />
        <div className="w-full h-full justify-center text-center overflow-x-hidden ">
          {account.address == undefined ? <Popup /> : ""}
          <VerifyEmailArea />
          <div className="flex flex-col gap-4 items-center justify-center">
            {chainId == 534352 ? <BaseSwitcher /> : <EventComponent />}
          </div>
          <WPInfo />
          <div className="pt-6 pb-24">

          <Community />
          </div>

          <div>
            <Footer />
          </div>
        </div>
      </Suspense>
    </main>
  );
}
