import Spinner from "@/components/Spinner";
import VerifyEmailArea from "@/components/VerifyEmail";
import React, { Suspense } from "react";

type Props = {};

const TestPage = (props: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="min-h-screen relative mx-auto"> 
        {/* <SupportSection /> */}
        {/* <OfferingsSection /> */}
        <div className="md:flex hidden mr-10 fixed">
          {/* <Sidebar /> */}
          {/* http://onchainwin.com/?ref=berke */}
          {/* <GridsTest />  bunu genişleticem */}
        </div>

        <VerifyEmailArea />
      </div>
    </Suspense>
  );
};

export default TestPage;
