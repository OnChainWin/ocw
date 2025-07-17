"use client";
import React from "react";
import ShiftingCountdown from "../../Countdown";
import {
  BASE_ERC20_ABI,
  BASE_FREE3_CONTRACT_ABI,
  BASE_FREE3_CONTRACT_ADDRESS,
  BASE_FREEOCW_CONTRACT_ABI,
  BASE_FREEOCW_CONTRACT_ADDRESS,
  BASE_OCW_CONTRACT_ABI,
  BASE_OCW_CONTRACT_ADDRESS,
  BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
  BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
  BASE_MULTIPLE_FREE_TIMER_CONTRACT_ADDRESS,
  BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
  BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
  BASE_B2B_CONTRACT_ABI,
  BASE_B2B_CONTRACT_ADDRESS,
} from "@/constants/contractBase";
import Link from "next/link";
import TypewriterComponent from "typewriter-effect";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import CountdownMinutesHome from "../../home/CountdownHome";
import { ArrowDown, ArrowRight } from "lucide-react";

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
      abi: BASE_B2B_CONTRACT_ABI,
      address: BASE_B2B_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActivePartnership2 = raffleStatusPartnership2
    ? "Active"
    : "Not Active";

  const {
    data: getRemainingTimeMinutesPartnership2,
    refetch: refetchMinPartnership2,
  } = useReadContract({
    abi: BASE_B2B_CONTRACT_ABI,
    address: BASE_B2B_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeMin",
  });

  const getRemainingMinutesPartnership2 =
    typeof getRemainingTimeMinutesPartnership2 === "number"
      ? getRemainingTimeMinutesPartnership2
      : Number(getRemainingTimeMinutesPartnership2);

  //  OCW 1
  const { data: targetPrizeAmount } = useReadContract({
    abi: BASE_OCW_CONTRACT_ABI,
    address: BASE_OCW_CONTRACT_ADDRESS,
    functionName: "targetPrizeAmount",
  });
  const prizePaid = targetPrizeAmount
    ? formatEther(targetPrizeAmount as any)
    : "0";

  const { data: entryFee } = useReadContract({
    abi: BASE_OCW_CONTRACT_ABI,
    address: BASE_OCW_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const { data: entryFeeSales } = useReadContract({
    abi: BASE_MULTIPLE_FREE_TIMER_CONTRACT_ABI,
    address: BASE_MULTIPLE2_FREE_TIMER_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const entryCostInWei = entryFee ? formatEther(entryFee as bigint) : "0";
  const amountCost = parseFloat(entryCostInWei);

  const { data: entryFeeB2B } = useReadContract({
    abi: BASE_B2B_CONTRACT_ABI,
    address: BASE_B2B_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const entryCostInWeiSales = entryFeeSales
    ? formatEther(entryFeeSales as bigint)
    : "0";
  const amountCostSales = parseFloat(entryCostInWeiSales);

  const entryCostInWeiB2B = entryFeeB2B
  ? formatEther(entryFeeB2B as bigint)
  : "0";
const amountCostB2B = parseFloat(entryCostInWeiB2B);

  const { data: raffleStatusPaid, refetch: refetchStatusPaid } =
    useReadContract({
      abi: BASE_OCW_CONTRACT_ABI,
      address: BASE_OCW_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActivePaid = raffleStatusPaid ? "Active" : "Not Active";

  const { data: getRemainingTimeMinutesPaid, refetch: refetchMinPaid } =
    useReadContract({
      abi: BASE_OCW_CONTRACT_ABI,
      address: BASE_OCW_CONTRACT_ADDRESS,
      functionName: "getRemainingTimeMinutes",
    });

  const getRemainingMinutesPaid =
    typeof getRemainingTimeMinutesPaid === "number"
      ? getRemainingTimeMinutesPaid
      : Number(getRemainingTimeMinutesPaid);

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

  //  OCW  Free 3

  const { data: prizeAmountFree3 } = useReadContract({
    abi: BASE_FREE3_CONTRACT_ABI,
    address: BASE_FREE3_CONTRACT_ADDRESS,
    functionName: "prizeAmount",
  });

  const prizeFree3 = prizeAmountFree3
    ? formatEther(prizeAmountFree3 as any)
    : "0";

  const { data: raffleStatusFree3, refetch: refetchStatusFree3 } =
    useReadContract({
      abi: BASE_FREE3_CONTRACT_ABI,
      address: BASE_FREE3_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActiveFree3 = raffleStatusFree3 ? "Active" : "Not Active";

  const { data: getRemainingTimeMinutesFree3, refetch: refetchMinFree3 } =
    useReadContract({
      abi: BASE_FREE3_CONTRACT_ABI,
      address: BASE_FREE3_CONTRACT_ADDRESS,
      functionName: "getRemainingTimeMin",
    });

  const getRemainingMinutesFree3 =
    typeof getRemainingTimeMinutesFree3 === "number"
      ? getRemainingTimeMinutesFree3
      : Number(getRemainingTimeMinutesFree3);

  //  OCW Token
  const { data: targetPrizeAmountToken } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "targetPrizeAmount",
  });
  const prizeToken = targetPrizeAmountToken
    ? Number(targetPrizeAmountToken) / 1000000
    : "0";

  // ETH

  const { data: entryFeeToken } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const entryCostInWeiToken = entryFeeToken
    ? formatEther(entryFeeToken as bigint)
    : "0";
  const amountCostToken = parseFloat(entryCostInWeiToken);

  // USDC

  const { data: entryFeeUSDC } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFeeUSDC",
  });

  const entryCostUSDCInWei = entryFeeUSDC
    ? formatEther(entryFeeUSDC as bigint)
    : "0";

  const amountCostUSDC = Number(entryFeeUSDC) / 1000000;

  // USDT

  const { data: entryFeeUSDT } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFeeUSDT",
  });

  const entryCostUSDTInWei = entryFeeUSDT
    ? formatEther(entryFeeUSDT as bigint)
    : "0";

  const amountCostUSDT = Number(entryFeeUSDT) / 1000000;

  const { data: raffleStatusToken, refetch: refetchStatusToken } =
    useReadContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      functionName: "raffleStatus",
    });

  const isActiveToken = raffleStatusToken ? "Active" : "Not Active";

  const { data: getRemainingTimeMinutesToken, refetch: refetchMinToken } =
    useReadContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      functionName: "getRemainingTimeMinutes",
    });

  const getRemainingMinutesToken =
    typeof getRemainingTimeMinutesToken === "number"
      ? getRemainingTimeMinutesToken
      : Number(getRemainingTimeMinutesToken);

  const {
    data: getRewardToken,
    isLoading: isgetRewardToken,
    error: errogetRewardToken,
    refetch: refetchGetRewardToken,
  } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getRewardToken",
  });

  const { data: getName, refetch: refetchGetName } = useReadContract({
    abi: BASE_ERC20_ABI,
    address: getRewardToken as any | "0",
    functionName: "name",
  });

  // Sales Raffle
  const { data: requiredEntries } = useReadContract({
    abi: BASE_B2B_CONTRACT_ABI,
    address: BASE_B2B_CONTRACT_ADDRESS,
    functionName: "requiredEntries",
  });

  // Sales Raffle
  const { data: totalEntries } = useReadContract({
    abi: BASE_B2B_CONTRACT_ABI,
    address: BASE_B2B_CONTRACT_ADDRESS,
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
      <section className="dark:bg-[#fdffec] bg-[#2b2b2b] pb-12">
        <div className="mx-auto max-w-screen-2xl py-2 dark:text-black text-white">
          <div className="mx-auto max-w-lg text-center my-4">
            <h1 className="text-3xl font-bold sm:text-4xl">
              <TypewriterComponent
                options={{
                  strings: [
                    "Active Raffles, Join Now!",
                    "Active Raffles, Play Now!",
                    "Active Raffles, Buy Now!",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
          </div>

          <div className="mt-4 grid grid-cols-1 text-black max-md:mx-2 gap-8 lg:grid-cols-3">
            <Link href="/ocw">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Maximum Prize: {prizePaid} ETH
                </span>
                <p className="mt-2 border-t-2 border-black"></p>

                {!raffleStatusPaid ? (
                  <div className="text-lg m-2">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <ShiftingCountdown
                      startDate={countdownDates[0]}
                      text="days"
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusPaid && getRemainingMinutesPaid > 1 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <CountdownMinutesHome minutes={getRemainingMinutesPaid} />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusPaid && getRemainingMinutesPaid < 1 ? (
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
                  Contract Address: {BASE_OCW_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-black border-dotted px-7 rounded-3xl mx-auto font-bold">
                    {/* Raffle 1 */}
                  </h2>
                </div>
                <p className="text-md font-semibold">
                  Entry Cost: {amountCost} ETH
                </p>
                <div className="font-bold flex-row flex justify-center items-center gap-2 ">
                  <p>Status:</p>
                  <span
                    className={
                      raffleStatusPaid
                        ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
                        : "text-red-700 bg-red-400/80 rounded-full py-1 px-2"
                    }>
                    {isActivePaid}
                  </span>
                </div>
                <div className="gap-2 my-2 border-b-2 border-black" />

                <button className="bg-gradient-to-r to-lime-500 from-green-300 p-[1px] rounded-full transition-all duration-300 hover:from-lime-500 hover:to-green-600 group">
                  <p className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline  md:font-semibold flex items-center gap-2">
                    Buy Tickets
                    <ArrowRight
                      size={16}
                      className="group-hover:rotate-90 transition-all duration-200 ease-out"
                    />
                  </p>
                </button>
              </div>
            </Link>
            {/* Free Lottery */}
            <Link href="/freeocw">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: {prizeFree} ETH
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
                  <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 border-black rounded-3xl mx-auto  font-bold"></h2>
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
            {/* yeni 3 eski 5. partnership raffle */}
            {/* <Link href="/partnership">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: BaseBridge Merch
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
                    Partnership Raffle
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
                {/* <ArrowButton text="Buy Tickets" borderColor="white" buttonOverlayColor="black" />
              </div>
            </Link> */}
            {/* yeni 5 eski 3Free 3 Lottery */}
            {/* <Link href="/freeocw3">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: {prizeFree3} ETH
                </span>
                <p className="italic text-xs mt-2 border-t-2 border-black"></p>
                {!raffleStatusFree3 ? (
                  <div className="text-lg m-2">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <ShiftingCountdown
                      startDate={countdownDates[2]}
                      text="days"
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusFree3 && getRemainingMinutesFree3 > 1 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <CountdownMinutesHome minutes={getRemainingMinutesFree3} />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusFree3 && getRemainingMinutesFree3 < 1 ? (
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
                  Contract Address: {BASE_FREE3_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto border-black font-bold">
                  </h2>
                </div>
                <p className="text-md font-semibold">Entry Cost: FREE</p>
                <div className="font-bold flex-row flex justify-center items-center gap-2 ">
                  <p>Status:</p>
                  <span
                    className={
                      raffleStatusFree3
                        ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
                        : "text-red-700 bg-red-400/80 rounded-full py-1 px-2"
                    }>
                    {isActiveFree3}
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
            </Link> */}
            {/*5. yani 4. kontratToken Lottery */}
            <Link href="/tokenocw">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: {prizeToken} {getAddress(getRewardToken as any)}
                </span>
                <p className="italic text-xs mt-2 border-t-2 border-black"></p>

                {!raffleStatusToken ? (
                  <div className="text-lg m-2">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <ShiftingCountdown
                      startDate={countdownDates[3]}
                      text="days"
                    />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusToken && getRemainingMinutesToken > 1 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <CountdownMinutesHome minutes={getRemainingMinutesToken} />
                  </div>
                ) : (
                  ""
                )}

                {raffleStatusToken && getRemainingMinutesToken < 1 ? (
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
                  Contract Address: {BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto border-black  font-bold">
                    {/* Raffle 4 */}
                  </h2>
                </div>
                <p className="text-md font-semibold">
                  Entry Cost: {amountCostToken} ETH | {amountCostUSDC} USDC |{" "}
                  {amountCostUSDT} USDT
                </p>
                <div className="font-bold flex-row flex justify-center items-center gap-2 ">
                  <p>Status:</p>
                  <span
                    className={
                      raffleStatusToken
                        ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
                        : "text-red-700 bg-red-400/80 rounded-full py-1 px-2"
                    }>
                    {isActiveToken}
                  </span>
                </div>
                <div className="gap-2 my-2 border-b-2 border-black" />

                <button className="bg-gradient-to-r to-lime-500 from-green-300 p-[1px] rounded-full transition-all duration-300 hover:from-lime-500 hover:to-green-600 group">
                  <p className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline  md:font-semibold flex items-center gap-2">
                    Buy Tickets
                    <ArrowRight
                      size={16}
                      className="group-hover:rotate-90 transition-all duration-200 ease-out"
                    />
                  </p>
                </button>
              </div>
            </Link>

            <div />
            {/* 6. partnership raffle */}
            {/* <Link href="/b2b">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: 1 GoMining NFT
                </span>
                <p className="italic text-xs mt-2 border-t-2 border-black"></p>

                {raffleStatusPartnership2 ? (
                  <div className="text-lg m-2">
                    Raffle Ends in
                    <p>⬇</p>
                    <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
                      <div className="font-sans font-bold text-3xl border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 border-black ">
                        {`${totalEntries} / ${requiredEntries}`} Tickets
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-lg m-2 ">
                    Next Raffle Starts in
                    <p>⬇</p>
                    <p className="text-4xl font-bold py-6">01 March 2025</p>
                  </div>
                )}

                <p className="text-xs">
                  Contract Address: {BASE_B2B_CONTRACT_ADDRESS}
                </p>
                <div className="mx-auto flex">
                  <h2 className="text-xl mt-2 border-t-2 border-black border-dotted px-7 rounded-3xl mx-auto  font-bold">
                    Sales Raffle
                  </h2>
                </div>
                <p className="text-md font-semibold">
                  Entry Cost: {amountCostB2B} ETH
                </p>
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
                    Buy Tickets
                    <ArrowRight
                      size={16}
                      className="group-hover:rotate-90 transition-all duration-200 ease-out"
                    />
                  </p>
                </button>
              </div>
            </Link> */}
            {/* yeni 6. partnership raffle */}
            {/* <Link href="/partnershipocw">
              <div className="block rounded-tr-[76px] rounded-bl-[76px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-blue-600/40 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600">
                <span className="mt-1 text-3xl font-semibold">
                  Prize: BaseBridge Merch
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
                    Partnership Raffle
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
            </Link> */}
            {/* 6. sonu */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GridsBase;
