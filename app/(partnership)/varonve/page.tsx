import Sidebar from "@/components/Sidebar";
import React, { Suspense } from "react";
import { CardStackDemo } from "@/components/LotteryWP";
import VerifyEmailArea from "@/components/VerifyEmail";
import Spinner from "@/components/Spinner";
import VaronvePageArea from "./_components/Varonve";

type Props = {};

const VaronvePage = (props: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <VerifyEmailArea />
        <div className="lg:flex hidden sm:mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
          <VaronvePageArea />
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default VaronvePage;
