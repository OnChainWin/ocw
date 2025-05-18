import Footer from "@/components/Footer";
import BlogSection from "@/components/landing/blog/BlogSection";
import HeroSection from "@/components/landing/home/HeroSection";
import OfferingsSection from "@/components/landing/offerings/OfferingsSection";
import UsSection from "@/components/landing/us/UsSection";
import PopupNewYear from "@/components/PopupNewYear";
import { ReferralCodeHandler } from "@/components/ReferralCodeHandler";
import Spinner from "@/components/Spinner";
import CallToAction from "@/components/tests/CallToAction";
import Features from "@/components/tests/Features";
import VerifyEmailArea from "@/components/VerifyEmail";
import { WPInfo } from "@/components/WPInfo";
import React, { Suspense } from "react";

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<Spinner />}>
        <ReferralCodeHandler />
        {/* <PopupNewYear /> */}
        <div className="min-h-screen relative mx-auto">
          <div className="overflow-hidden">
            <HeroSection />
          </div>
          {/* <SupportSection /> */}
          <OfferingsSection />
          <Features />
          <UsSection />
          <WPInfo />
          <BlogSection />
          <CallToAction />
          <Footer />
          {/* <div className="md:flex hidden mr-10 fixed"> */}
          {/* <Sidebar /> */}
          {/* http://onchainwin.com/?ref=berke */}
          {/* <GridsTest />  bunu genişleticem */}
          {/* </div> */}

          <VerifyEmailArea />
        </div>
      </Suspense>
    </main>
  );
}
