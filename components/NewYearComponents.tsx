import React from "react";
import ChristmasHomePage from "./Christmas";
import NewYearHomePage from "./NewYear";
import MiddleArea from "./MiddleArea";
import Link from "next/link";

const NewYearComponents = () => {
  return (
    <div className="border-b-2 border-t-2 border-orange-200 bg-gradient-to-r from-[#232526] via-[#232526] to-[#414345] w-full">
      <h1 className="text-center text-2xl font-bold text-white py-8">
        OnChainWin Christmas & New Year Lottery
      </h1>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Column for md screens */}
          <div className="flex flex-col gap-8">
            {/* Christmas Card */}
            <Link href="/christmas" className="h-full">
              <div className="h-full">
                <ChristmasHomePage />
              </div>
            </Link>

            {/* New Year Card - Only shows in md screens in left column */}
            <div className="hidden md:block lg:hidden">
              <Link href="/newyear" className="h-full">
                <div className="h-full">
                  <NewYearHomePage />
                </div>
              </Link>
            </div>
          </div>

          {/* Middle Area - Centers in right column on md screens */}
          <div className="h-full flex items-center justify-center md:self-center">
            <MiddleArea />
          </div>

          {/* New Year Card - Shows in different positions based on screen size */}
          <div className="md:hidden lg:block">
            <Link href="/newyear" className="h-full">
              <div className="h-full">
                <NewYearHomePage />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewYearComponents;
