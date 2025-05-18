import { OCWNewYear } from "@/components/LotteryArea/NewYear";
import { CardStackDemo } from "@/components/LotteryWP";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import React, { Suspense } from "react";

type Props = {};

const OCWNewyearPage = (props: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <div className="lg:flex hidden mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
          <OCWNewYear />
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default OCWNewyearPage;
