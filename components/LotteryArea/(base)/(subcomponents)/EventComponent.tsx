"use client";
import React from "react";
import ShiftingCountdown from "../../../Countdown";
import {
  BASE_ERC20_ABI,
  BASE_FREEOCW_CONTRACT_ABI,
  BASE_FREEOCW_CONTRACT_ADDRESS,
  BASE_MULTIPLE_FREE_TIMER_CONTRACT_ADDRESS,
  BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
  BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
} from "@/constants/contractBase";
import Link from "next/link";
import TypewriterComponent from "typewriter-effect";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import CountdownMinutesHome from "../../../home/CountdownHome";
import { ArrowRight } from "lucide-react";

type Props = {};

export const countdownDates = [
  "01/02/2025 12:00:00",
  "01/02/2025 12:00:00",
  "01/02/2025 12:00:00",
  "01/02/2025 12:00:00",
  "01/02/2025 9:00:00",
];

const GridsBase = (props: Props) => {
  //  Partnership1

  const { data: raffleStatusPartnership, refetch: refetchStatusPartnership } =
    useReadContract({
      abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
      address: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActivePartnership = raffleStatusPartnership ? "Active" : "Not Active";

  const {
    data: getRemainingTimeMinutesPartnership,
    refetch: refetchMinPartnership,
  } = useReadContract({
    abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
    address: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeMin",
  });

  const getRemainingMinutesPartnership =
    typeof getRemainingTimeMinutesPartnership === "number"
      ? getRemainingTimeMinutesPartnership
      : Number(getRemainingTimeMinutesPartnership);

  //  Partnership2

  const { data: raffleStatusPartnership2, refetch: refetchStatusPartnership2 } =
    useReadContract({
      abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
      address: BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActivePartnership2 = raffleStatusPartnership2
    ? "Active"
    : "Not Active";

  // const {
  //   data: getRemainingTimeMinutesPartnership2,
  //   refetch: refetchMinPartnership2,
  // } = useReadContract({
  //   abi: B2B_CONTRACT_ABI,
  //   address: B2B_CONTRACT_ADDRESS,
  //   functionName: "getRemainingTimeMin",
  // });

  // const getRemainingMinutesPartnership2 =
  //   typeof getRemainingTimeMinutesPartnership2 === "number"
  //     ? getRemainingTimeMinutesPartnership2
  //     : Number(getRemainingTimeMinutesPartnership2);

  const { data: entryFeeSales } = useReadContract({
    abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
    address: BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const entryCostInWeiSales = entryFeeSales
    ? formatEther(entryFeeSales as bigint)
    : "0";
  const amountCostSales = parseFloat(entryCostInWeiSales);

  //  OCW  Free
  const { data: prizeAmountFree } = useReadContract({
    abi: BASE_FREEOCW_CONTRACT_ABI,
    address: BASE_FREEOCW_CONTRACT_ADDRESS,
    functionName: "prizeAmount",
  });

  const prizeFree = prizeAmountFree ? formatEther(prizeAmountFree as any) : "0";

  const { data: raffleStatusFree, refetch: refetchStatusFree } =
    useReadContract({
      abi: BASE_FREEOCW_CONTRACT_ABI,
      address: BASE_FREEOCW_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActiveFree = raffleStatusFree ? "Active" : "Not Active";

  const { data: getRemainingTimeMinutesFree, refetch: refetchMinFree } =
    useReadContract({
      abi: BASE_FREEOCW_CONTRACT_ABI,
      address: BASE_FREEOCW_CONTRACT_ADDRESS,
      functionName: "getRemainingTimeMin",
    });

  const getRemainingMinutesFree =
    typeof getRemainingTimeMinutesFree === "number"
      ? getRemainingTimeMinutesFree
      : Number(getRemainingTimeMinutesFree);

  // Sales Raffle
  const { data: requiredEntries } = useReadContract({
    abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
    address: BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
    functionName: "requiredEntries",
  });

  // Sales Raffle
  const { data: totalEntries } = useReadContract({
    abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
    address: BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
    functionName: "totalEntries",
  });

  function getAddress(addressContract: string) {
    const lowercaseAddress = addressContract?.toLowerCase();
    if (addressContract === "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913") {
      return "USDC";
    } else if (
      addressContract === "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2"
    ) {
      return "USDT";
    } else {
      return "Other";
    }
  }

  return (
    <div>
      <section className="py-12">
        <div className="mx-auto max-w-screen-2xl py-2 dark:text-black text-white">

          <div className="grid grid-cols-1 text-black max-md:mx-2 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {/* Free Lottery */}

            {/* yeni 3 eski 5. partnership raffle */}
            <Link href="/partnership">
            <div className="block rounded-[100px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-bl from-blue-200 via-blue-600 to-blue-500">
                <span className="mt-1 text-3xl font-semibold">
                  3 BaseBridge Merch
                </span>
                <p className="italic text-xs mt-2 border-t-2 border-black"></p>

                {!raffleStatusPartnership ? (
                  <div className="text-lg m-2">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <ShiftingCountdown
                      startDate={countdownDates[5]}
                      text="days"
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusPartnership &&
                getRemainingMinutesPartnership > 1 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <CountdownMinutesHome
                      minutes={getRemainingMinutesPartnership}
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusPartnership &&
                getRemainingMinutesPartnership < 1 ? (
                  <div className="text-lg m-2 ">
                    Raffle Ends in
                    <p>⬇</p>
                    <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
                      <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 border-black ">
                        Last Ticket(s)
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <p className="text-xs">
                  Contract Address: {BASE_MULTIPLE_FREE_TIMER_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto  font-bold border-black">
                    OCW
                  </h2>
                </div>
                <p className="text-md font-semibold">Entry Cost: FREE</p>
                <div className="font-bold flex-row flex justify-center items-center gap-2 ">
                  <p>Status:</p>
                  <span
                    className={
                      raffleStatusPartnership
                        ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
                        : "text-red-700 bg-red-400/80 rounded-full py-1 px-2"
                    }>
                    {isActivePartnership}
                  </span>
                </div>
                <div className="gap-2 my-2 border-b-2 border-black" />

                <button className="bg-gradient-to-r to-lime-500 from-green-300 p-[1px] rounded-full transition-all duration-300 hover:from-lime-500 hover:to-green-600 group">
                  <p className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline  md:font-semibold flex items-center gap-2">
                    Join Free
                    <ArrowRight
                      size={16}
                      className="group-hover:rotate-90 transition-all duration-200 ease-out"
                    />
                  </p>
                </button>
                {/* <ArrowButton text="Buy Tickets" borderColor="white" buttonOverlayColor="black" /> */}
              </div>
            </Link>

            <Link href="/freeocw">
            <div className="block rounded-[100px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-bl from-blue-200 via-blue-600 to-blue-500">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: 100 USDC
                </span>
                <p className="italic text-xs mt-2 border-t-2 border-black"></p>

                {!raffleStatusFree ? (
                  <div className="text-lg m-2">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <ShiftingCountdown
                      startDate={countdownDates[1]}
                      text="days"
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusFree && getRemainingMinutesFree > 1 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <CountdownMinutesHome minutes={getRemainingMinutesFree} />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusFree && getRemainingMinutesFree < 1 ? (
                  <div className="text-lg m-2 ">
                    Raffle Ends in
                    <p>⬇</p>
                    <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
                      <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 divide-black border-black ">
                        Last Ticket(s)
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <p className="text-xs">
                  Contract Address: {BASE_FREEOCW_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 border-black rounded-3xl mx-auto  font-bold">
                    OCW
                  </h2>
                </div>
                <p className="text-md font-semibold">Entry Cost: FREE</p>
                <div className="font-bold flex-row flex justify-center items-center gap-2 ">
                  <p>Status:</p>
                  <span
                    className={
                      raffleStatusFree
                        ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
                        : "text-red-700 bg-red-400/80 rounded-full py-1 px-2"
                    }>
                    {isActiveFree}
                  </span>
                </div>
                <div className="gap-2 my-2 border-b-2 border-black" />

                <button className="bg-gradient-to-r to-lime-500 from-green-300 p-[1px] rounded-full transition-all duration-300 hover:from-lime-500 hover:to-green-600 group">
                  <p className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline  md:font-semibold flex items-center gap-2">
                    Join Free
                    <ArrowRight
                      size={16}
                      className="group-hover:rotate-90 transition-all duration-200 ease-out"
                    />
                  </p>
                </button>
              </div>
            </Link>

            {/* yeni 6. partnership raffle */}
            <Link href="/partnershipocw">
            <div className="block rounded-[100px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-bl from-blue-200 via-blue-600 to-blue-500">
                <span className="mt-1 text-3xl font-semibold">
                  3 BaseBridge Merch
                </span>
                <p className="italic text-xs mt-2 border-t-2 border-black"></p>

                {!raffleStatusPartnership2 ? (
                  <div className="text-lg m-2">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <ShiftingCountdown
                      startDate={countdownDates[5]}
                      text="days"
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusPartnership2 &&
                getRemainingMinutesPartnership > 1 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <CountdownMinutesHome
                      minutes={getRemainingMinutesPartnership}
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusPartnership2 &&
                getRemainingMinutesPartnership < 1 ? (
                  <div className="text-lg m-2 ">
                    Raffle Ends in
                    <p>⬇</p>
                    <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
                      <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 border-black ">
                        Last Ticket(s)
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <p className="text-xs">
                  Contract Address: {BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto  font-bold border-black">
                    OCW
                  </h2>
                </div>
                <p className="text-md font-semibold">Entry Cost: FREE</p>
                <div className="font-bold flex-row flex justify-center items-center gap-2 ">
                  <p>Status:</p>
                  <span
                    className={
                      raffleStatusPartnership2
                        ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
                        : "text-red-700 bg-red-400/80 rounded-full py-1 px-2"
                    }>
                    {isActivePartnership2}
                  </span>
                </div>
                <div className="gap-2 my-2 border-b-2 border-black" />

                <button className="bg-gradient-to-r to-lime-500 from-green-300 p-[1px] rounded-full transition-all duration-300 hover:from-lime-500 hover:to-green-600 group">
                  <p className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline  md:font-semibold flex items-center gap-2">
                    Join Free
                    <ArrowRight
                      size={16}
                      className="group-hover:rotate-90 transition-all duration-200 ease-out"
                    />
                  </p>
                </button>
              </div>
            </Link>

            {/* 6. sonu */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GridsBase;
