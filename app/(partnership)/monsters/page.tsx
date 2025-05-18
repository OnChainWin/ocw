import Sidebar from "@/components/Sidebar";
import React, { Suspense } from "react";
import { CardStackDemo } from "@/components/LotteryWP";
import VerifyEmailArea from "@/components/VerifyEmail";
import Spinner from "@/components/Spinner";
import MonsterPageArea from "./_components/Monster";

type Props = {};

const MonsterPage = (props: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <VerifyEmailArea />
        <div className="lg:flex hidden sm:mr-10 fixed">
          <Sidebar />
        </div>
        <div className="px-20 max-sm:px-4">
          <MonsterPageArea />
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default MonsterPage;
