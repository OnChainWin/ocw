"use client";
import { OCWPaidBase } from "@/components/LotteryArea/(base)/OcwPaidBase";
import { OCWPaid } from "@/components/LotteryArea/(scroll)/OcwPaid";
import { CardStackDemo } from "@/components/LotteryWP";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import React, { Suspense } from "react";
import { useChainId } from "wagmi";

type Props = {};

const PaidOCWPage = (props: Props) => {
  const chainId = useChainId();
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <div className="lg:flex hidden mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
          {chainId == 534352 ? <OCWPaid /> : <OCWPaidBase />}
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default PaidOCWPage;
