"use client";
import React, { useEffect, useState } from "react";
import ChristmasHomePage from "./Christmas";
import NewYearHomePage from "./NewYear";
import MiddleArea from "./MiddleArea";
import Link from "next/link";
import { Button } from "./ui/button";

const PopupNewYear = () => {
  const [countdown, setCountdown] = useState(5);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer items-center text-center">
      {/* Countdown Timer */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
        This popup will close in {countdown} {countdown === 1 ? 'second' : 'seconds'}
      </div>

      <h1 className="text-center text-2xl font-bold text-orange-600">
        OnChainWin Christmas & New Year Lottery
      </h1>
      <div className="mt-4 flex tems-center justify-center">
        {/* <Link href="/b2b">
          <ChristmasHomePage />
        </Link> */}
        
      </div>
      {/* New year */}
      {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-3 items-center justify-center">
        <Link href="/christmas">
          <ChristmasHomePage />
        </Link>
        <div>
          <MiddleArea />
        </div>
        <Link href="/newyear">
          <NewYearHomePage />
        </Link>
      </div> */}
      <Button className="">
        <Link href="/play">
          Play Now
        </Link>
      </Button>
    </div>
  );
};

export default PopupNewYear;
