"use client"
import Sidebar from "@/components/Sidebar";
import React, { Suspense } from "react";
import { CardStackDemo } from "@/components/LotteryWP";
import OcwFree from "@/components/LotteryArea/OcwFree";
import VerifyEmailArea from "@/components/VerifyEmail";
import Spinner from "@/components/Spinner";
import { useChainId } from "wagmi";
import OcwFreeBase from "@/components/LotteryArea/(base)/OcwFreeBase";

type Props = {};

const FreeOCWPage = (props: Props) => {
  const chainId = useChainId();
  return (
    
    <Suspense fallback={<Spinner />}>
      <div>
        <VerifyEmailArea />
        <div className="lg:flex hidden sm:mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
          {chainId == 534352 ? <OcwFree /> : <OcwFreeBase />}
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default FreeOCWPage;
