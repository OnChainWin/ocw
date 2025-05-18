"use client";
import BaseSwitcher from "@/components/LotteryArea/(base)/BaseSwitcher";
import { BasePartnershipArea2 } from "@/components/LotteryArea/(base)/OcwPartnership2";
import { CardStackDemo } from "@/components/LotteryWP";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import React, { Suspense } from "react";
import { useChainId } from "wagmi";

type Props = {};

const PartnershipOCWPage = (props: Props) => {
  const chainId = useChainId();
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <div className="lg:flex hidden mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
          {chainId == 534352 ? <BaseSwitcher /> : <BasePartnershipArea2 />}
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default PartnershipOCWPage;
