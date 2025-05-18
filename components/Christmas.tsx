"use client";
import React from "react";
import { PartyPopper } from "lucide-react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import CountdownMinutesNY from "./NYCountdown";
import { useReadContract } from "wagmi";
import {
  NY_CONTRACT_ABI,
  NY_DAILY_CONTRACT_ADDRESS,
} from "@/constants/contract";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";

const ChristmasHomePage = () => {
  const { data: getRemainingTimeMinutesPaid, refetch: refetchMinPaid } =
    useReadContract({
      abi: NY_CONTRACT_ABI,
      address: NY_DAILY_CONTRACT_ADDRESS,
      functionName: "getRemainingTimeMinutes",
    });

  const getRemainingMinutesPaid =
    typeof getRemainingTimeMinutesPaid === "number"
      ? getRemainingTimeMinutesPaid
      : Number(getRemainingTimeMinutesPaid);
  return (
    <div className="relative w-full bg-green-50 rounded-xl shadow-lg overflow-hidden border-2 border-green-100 hover:border-green-600 hover:bg-green-200 hover:shadow-2xl hover:shadow-green-500 duration-500 ease-in-out transition-all">
      <div className="absolute -left-4 -top-4 w-16 h-16">
        <div className="w-full h-full bg-green-600 rounded-lg transform rotate-45">
          <div className="absolute bottom-1/4 w-full h-4 bg-white"></div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-200 rounded-full"></div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <PartyPopper className="text-green-500 -rotate-90" size={28} />
          <h2 className="text-3xl text-end font-bold text-green-600">
            Merry Christmas!
          </h2>
        </div>

        <CountdownMinutesNY minutes={getRemainingMinutesPaid} />

        <div className="rounded-xl bg-green-100 text-green-600 text-2xl font-bold py-2 px-4">
          <p className="text-green-600 text-2xl font-bold">Daily</p>
          <p className="text-green-600 text-base font-bold">1 Lucky Winner</p>
        </div>

        <div className="flex border-none mt-6 rounded-xl bg-green-100 justify-between py-2 px-10 items-center ">
          <Image
            src={"/prizeeth.png"}
            alt="ny_grand_prize"
            width={150}
            height={150}
          />

          <div className="items-center justify-center flex flex-col">
            <div className="flex flex-row gap-2 items-center text-center">
              <p className="text-green-800 text-4xl font-semibold">1</p>
              <FaEthereum className="text-green-800 size-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChristmasHomePage;
