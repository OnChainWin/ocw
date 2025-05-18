"use client"
import Sidebar from "@/components/Sidebar";
import React, { Suspense } from "react";
import { CardStackDemo } from "@/components/LotteryWP";
import VerifyEmailArea from "@/components/VerifyEmail";
import Spinner from "@/components/Spinner";
import { B2BPageArea } from "./_components/B2B";
import { useChainId } from "wagmi";
import { B2BPageAreaBase } from "@/components/LotteryArea/(base)/B2BBase";

type Props = {};

const ClipperPage = (props: Props) => {
  const chainId = useChainId();
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <VerifyEmailArea />
        <div className="lg:flex hidden sm:mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
        {chainId == 534352 ?  <B2BPageArea />:<B2BPageAreaBase />}
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default ClipperPage;
