"use client";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { PartyPopper } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import CountdownMinutesNY from "./NYCountdown";
import { useReadContract } from "wagmi";
import { NY_CONTRACT_ADDRESS, NY_CONTRACT_ABI } from "@/constants/contract";
import CountdownMinutesNY2 from "./NY2Countdown";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";

const NewYearHomePage = () => {
  const { data: getRemainingTimeMinutesPaid, refetch: refetchMinPaid } =
    useReadContract({
      abi: NY_CONTRACT_ABI,
      address: NY_CONTRACT_ADDRESS,
      functionName: "getRemainingTimeMinutes",
    });

  const getRemainingMinutesPaid =
    typeof getRemainingTimeMinutesPaid === "number"
      ? getRemainingTimeMinutesPaid
      : Number(getRemainingTimeMinutesPaid);
  return (
    <div className="relative w-full bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-100 hover:border-orange-600 hover:bg-orange-200 hover:shadow-2xl hover:shadow-orange-500 duration-500 ease-in-out transition-all">
      <div className="absolute -right-4 -top-4 w-16 h-16">
        <div className="w-full h-full bg-orange-600 rounded-lg transform rotate-45">
          <div className="absolute bottom-1/4 w-full h-4 bg-white"></div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-200 rounded-full"></div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-orange-600">
            Happy New Year!
          </h2>
          <PartyPopper className="text-orange-500" size={28} />
        </div>

        <CountdownMinutesNY2 minutes={getRemainingMinutesPaid} />

        <div className="rounded-xl bg-orange-100  py-2 px-4">
          <p className="text-orange-600 text-2xl font-bold">Until New Year</p>
          <p className="text-orange-600 text-base font-bold">1 Lucky Winner</p>
        </div>

        <div className="flex border-none mt-6 rounded-xl bg-orange-100 justify-between py-2 px-10 items-center ">
          <Image
            src={"/prizeeth.png"}
            alt="ny_grand_prize"
            width={150}
            height={150}
          />

          <div className="items-center justify-center flex flex-col">
            <div className="flex flex-row gap-2 items-center text-center">
              <p className="text-orange-800 text-4xl font-semibold">10</p>
              <FaEthereum className="text-orange-800 size-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewYearHomePage;
