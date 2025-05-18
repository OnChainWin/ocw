"use client";
import { OCWTokenPaidBase } from "@/components/LotteryArea/(base)/OcwTokenPaidBase";
import { OCWTokenPaid } from "@/components/LotteryArea/OcwTokenPaid";
import { CardStackDemo } from "@/components/LotteryWP";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import VerifyEmailArea from "@/components/VerifyEmail";

import React, { Suspense } from "react";
import { useChainId } from "wagmi";

type Props = {};

const TestPage = (props: Props) => {
  const chainId = useChainId();
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <VerifyEmailArea />
        <div className="xl:flex hidden mr-10 fixed">
          <Sidebar />
        </div>
        {chainId == 534352 ? <OCWTokenPaid /> : <OCWTokenPaidBase />}
        <CardStackDemo />
      </div>
    </Suspense>
  );
};

export default TestPage;
