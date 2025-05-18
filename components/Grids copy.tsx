// "use client";
// import React, { useEffect } from "react";
// import ShiftingCountdown from "./Countdown";
// import {
//   A_PAIDTIMER_CONTRACT_ABI,
//   A_PAIDTIMER_CONTRACT_ADDRESS,
//   ERC2O_ABI,
//   FREE3_CONTRACT_ABI,
//   FREE3_CONTRACT_ADDRESS,
//   FREE_PARTNERSHIP_CONTRACT_ADDRESS,
//   FREEOCW_CONTRACT_ABI,
//   FREEOCW_CONTRACT_ADDRESS,
//   TOKEN_PAIDTIMER_CONTRACT_ABI,
//   TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
// } from "@/constants/contract";
// import Link from "next/link";
// import TypewriterComponent from "typewriter-effect";
// import { Button } from "./ui/button";
// import { useReadContract } from "wagmi";
// import { formatEther } from "viem";
// import CountdownMinutesHome from "./home/CountdownHome";

// type Props = {};

// export const countdownDates = [
//   "8/01/2024 12:30:00",
//   "8/01/2024 11:00:00",
//   "8/01/2024 10:00:00",
//   "8/01/2024 9:00:00",
//   "12/12/2024 9:00:00",
// ];

// const Grids = (props: Props) => {
//   //  OCW 1
//   const { data: targetPrizeAmount } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "targetPrizeAmount",
//   });
//   const prizePaid = targetPrizeAmount
//     ? formatEther(targetPrizeAmount as any)
//     : "0";

//   const { data: entryFee } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "entryFee",
//   });

//   const entryCostInWei = entryFee ? formatEther(entryFee as bigint) : "0";
//   const amountCost = parseFloat(entryCostInWei);

//   const { data: raffleStatusPaid, refetch: refetchStatusPaid } =
//     useReadContract({
//       abi: A_PAIDTIMER_CONTRACT_ABI,
//       address: A_PAIDTIMER_CONTRACT_ADDRESS,
//       functionName: "raffleStatus",
//     });

//   const isActivePaid = raffleStatusPaid ? "Active" : "Not Active";

//   const { data: getRemainingTimeMinutesPaid, refetch: refetchMinPaid } =
//     useReadContract({
//       abi: A_PAIDTIMER_CONTRACT_ABI,
//       address: A_PAIDTIMER_CONTRACT_ADDRESS,
//       functionName: "getRemainingTimeMinutes",
//     });

//   const getRemainingMinutesPaid =
//     typeof getRemainingTimeMinutesPaid === "number"
//       ? getRemainingTimeMinutesPaid
//       : Number(getRemainingTimeMinutesPaid);

//   //  OCW  Free
//   const { data: prizeAmountFree } = useReadContract({
//     abi: FREEOCW_CONTRACT_ABI,
//     address: FREEOCW_CONTRACT_ADDRESS,
//     functionName: "prizeAmount",
//   });

//   const prizeFree = prizeAmountFree ? formatEther(prizeAmountFree as any) : "0";

//   const { data: raffleStatusFree, refetch: refetchStatusFree } =
//     useReadContract({
//       abi: FREEOCW_CONTRACT_ABI,
//       address: FREEOCW_CONTRACT_ADDRESS,
//       functionName: "raffleStatus",
//     });

//   const isActiveFree = raffleStatusFree ? "Active" : "Not Active";

//   const { data: getRemainingTimeMinutesFree, refetch: refetchMinFree } =
//     useReadContract({
//       abi: FREEOCW_CONTRACT_ABI,
//       address: FREEOCW_CONTRACT_ADDRESS,
//       functionName: "getRemainingTimeMin",
//     });

//   const getRemainingMinutesFree =
//     typeof getRemainingTimeMinutesFree === "number"
//       ? getRemainingTimeMinutesFree
//       : Number(getRemainingTimeMinutesFree);

//   //  OCW  Free 3

//   const { data: prizeAmountFree3 } = useReadContract({
//     abi: FREE3_CONTRACT_ABI,
//     address: FREE3_CONTRACT_ADDRESS,
//     functionName: "prizeAmount",
//   });

//   const prizeFree3 = prizeAmountFree3
//     ? formatEther(prizeAmountFree3 as any)
//     : "0";

//   const { data: raffleStatusFree3, refetch: refetchStatusFree3 } =
//     useReadContract({
//       abi: FREE3_CONTRACT_ABI,
//       address: FREE3_CONTRACT_ADDRESS,
//       functionName: "raffleStatus",
//     });

//   const isActiveFree3 = raffleStatusFree3 ? "Active" : "Not Active";

//   const { data: getRemainingTimeMinutesFree3, refetch: refetchMinFree3 } =
//     useReadContract({
//       abi: FREE3_CONTRACT_ABI,
//       address: FREE3_CONTRACT_ADDRESS,
//       functionName: "getRemainingTimeMin",
//     });

//   const getRemainingMinutesFree3 =
//     typeof getRemainingTimeMinutesFree3 === "number"
//       ? getRemainingTimeMinutesFree3
//       : Number(getRemainingTimeMinutesFree3);

//   //  OCW Token
//   const { data: targetPrizeAmountToken } = useReadContract({
//     abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//     address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "targetPrizeAmount",
//   });
//   const prizeToken = targetPrizeAmountToken
//     ? Number(targetPrizeAmountToken) / 1000000
//     : "0";

//   // ETH

//   const { data: entryFeeToken } = useReadContract({
//     abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//     address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "entryFee",
//   });

//   const entryCostInWeiToken = entryFeeToken
//     ? formatEther(entryFeeToken as bigint)
//     : "0";
//   const amountCostToken = parseFloat(entryCostInWeiToken);

//   // USDC

//   const { data: entryFeeUSDC } = useReadContract({
//     abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//     address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "entryFeeUSDC",
//   });

//   const entryCostUSDCInWei = entryFeeUSDC
//     ? formatEther(entryFeeUSDC as bigint)
//     : "0";

//   const amountCostUSDC = Number(entryFeeUSDC) / 1000000;

//   // USDT

//   const { data: entryFeeUSDT } = useReadContract({
//     abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//     address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "entryFeeUSDT",
//   });

//   const entryCostUSDTInWei = entryFeeUSDT
//     ? formatEther(entryFeeUSDT as bigint)
//     : "0";

//   const amountCostUSDT = Number(entryFeeUSDT) / 1000000;

//   const { data: raffleStatusToken, refetch: refetchStatusToken } =
//     useReadContract({
//       abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//       address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//       functionName: "raffleStatus",
//     });

//   const isActiveToken = raffleStatusToken ? "Active" : "Not Active";

//   const { data: getRemainingTimeMinutesToken, refetch: refetchMinToken } =
//     useReadContract({
//       abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//       address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//       functionName: "getRemainingTimeMinutes",
//     });

//   const getRemainingMinutesToken =
//     typeof getRemainingTimeMinutesToken === "number"
//       ? getRemainingTimeMinutesToken
//       : Number(getRemainingTimeMinutesToken);

//   const {
//     data: getRewardToken,
//     isLoading: isgetRewardToken,
//     error: errogetRewardToken,
//     refetch: refetchGetRewardToken,
//   } = useReadContract({
//     abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
//     address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "getRewardToken",
//   });

//   const { data: getName, refetch: refetchGetName } = useReadContract({
//     abi: ERC2O_ABI,
//     address: getRewardToken as any | "0",
//     functionName: "name",
//   });

//   function getAddress(addressContract: string) {
//     const lowercaseAddress = addressContract?.toLowerCase();
//     if (addressContract === "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4") {
//       return "USDC";
//     } else if (
//       addressContract === "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"
//     ) {
//       return "USDT";
//     } else {
//       return "Other";
//     }
//   }

//   return (
//     <div>
//       <section className="dark:bg-[#fdffec] bg-[#2b2b2b] pb-12">
//         <div className="mx-auto max-w-screen-2xl py-2 dark:text-black text-white">
//           <div className="mx-auto max-w-lg text-center">
//             <h1 className="text-3xl font-bold sm:text-4xl">
//               <TypewriterComponent
//                 options={{
//                   strings: [
//                     "Active Raffles, Join Now!",
//                     "Active Raffles, Play Now!",
//                     "Active Raffles, Buy Now!",
//                   ],
//                   autoStart: true,
//                   loop: true,
//                 }}
//               />
//             </h1>
//           </div>

//           <div className="mt-4 grid grid-cols-1 text-black max-md:mx-2 gap-8 md:grid-cols-2 xl:grid-cols-3">
//             <Link href="/ocw">
//               <div className="block rounded-tr-[100px] rounded-bl-[100px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-orange-600/40 bg-orange-300">
//                 <span className="mt-1 text-3xl font-semibold">
//                   Maximum Prize: {prizePaid} ETH
//                 </span>
//                 <p className="mt-2 border-t-2 border-black"></p>

//                 {!raffleStatusPaid ? (
//                   <div className="text-lg m-2">
//                     Next Raffle Starts in
//                     <p>⬇</p>
//                     <ShiftingCountdown
//                       startDate={countdownDates[0]}
//                       text="days"
//                     />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusPaid && getRemainingMinutesPaid > 1 ? (
//                   <div className="text-lg m-2">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <CountdownMinutesHome minutes={getRemainingMinutesPaid} />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusPaid && getRemainingMinutesPaid < 1 ? (
//                   <div className="text-lg m-2 ">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
//                       <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 border-black ">
//                         Last Ticket(s)
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <p className="text-xs">
//                   Contract Address: {A_PAIDTIMER_CONTRACT_ADDRESS}
//                 </p>
//                 <div className="mx-auto flex">
//                   <h2 className="text-xl mt-2 border-t-2 border-black border-dotted px-7 rounded-3xl mx-auto font-bold">
//                     Raffle 1
//                   </h2>
//                 </div>
//                 <p className="text-md font-semibold">
//                   Entry Cost: {amountCost} ETH
//                 </p>
//                 <div className="font-bold flex-row flex justify-center items-center gap-2 ">
//                   <p>Status:</p>
//                   <span
//                     className={
//                       raffleStatusPaid
//                         ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
//                         : "text-red-500"
//                     }>
//                     {isActivePaid}
//                   </span>
//                 </div>
//                 <div className="gap-2 my-2 border-b-2 border-black" />

//                 <Button
//                   variant={"outline"}
//                   className="text-black dark:text-white w-1/3">
//                   Buy Tickets
//                 </Button>
//                 {/* <ArrowButton text="Buy Tickets" borderColor="white" buttonOverlayColor="black" /> */}
//               </div>
//             </Link>

//             {/* Free Lottery */}

//             <Link href="/freeocw">
//               <div className="block rounded-tr-[100px] rounded-bl-[100px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-orange-600/40 bg-orange-300">
//                 <span className="mt-1 text-3xl font-semibold">
//                   Prize: {prizeFree} ETH
//                 </span>
//                 <p className="italic text-xs mt-2 border-t-2 border-black"></p>

//                 {!raffleStatusFree ? (
//                   <div className="text-lg m-2">
//                     Next Raffle Starts in
//                     <p>⬇</p>
//                     <ShiftingCountdown
//                       startDate={countdownDates[1]}
//                       text="days"
//                     />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusFree && getRemainingMinutesFree > 1 ? (
//                   <div className="text-lg m-2">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <CountdownMinutesHome minutes={getRemainingMinutesFree} />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusFree && getRemainingMinutesFree < 1 ? (
//                   <div className="text-lg m-2 ">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
//                       <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 divide-black border-black ">
//                         Last Ticket(s)
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <p className="text-xs">
//                   Contract Address: {FREEOCW_CONTRACT_ADDRESS}
//                 </p>
//                 <div className="mx-auto flex">
//                   <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 border-black rounded-3xl mx-auto  font-bold">
//                     Raffle 2
//                   </h2>
//                 </div>
//                 <p className="text-md font-semibold">Entry Cost: FREE</p>
//                 <div className="font-bold flex-row flex justify-center items-center gap-2 ">
//                   <p>Status:</p>
//                   <span
//                     className={
//                       raffleStatusPaid
//                         ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
//                         : "text-red-500"
//                     }>
//                     {isActivePaid}
//                   </span>
//                 </div>
//                 <div className="gap-2 my-2 border-b-2 border-black" />

//                 <Button
//                   variant={"default"}
//                   className="dark:text-black text-white w-1/3">
//                   Join Free
//                 </Button>
//               </div>
//             </Link>

//             {/* Free 3 Lottery */}

//             <Link href="/freeocw3">
//               <div className="block rounded-tr-[100px] rounded-bl-[100px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-orange-600/40 bg-orange-300">
//                 <span className="mt-1 text-3xl font-semibold">
//                   Prize: {prizeFree3} ETH
//                 </span>
//                 <p className="italic text-xs mt-2 border-t-2 border-black"></p>
//                 {!raffleStatusFree3 ? (
//                   <div className="text-lg m-2">
//                     Next Raffle Starts in
//                     <p>⬇</p>
//                     <ShiftingCountdown
//                       startDate={countdownDates[2]}
//                       text="days"
//                     />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusFree3 && getRemainingMinutesFree3 > 1 ? (
//                   <div className="text-lg m-2">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <CountdownMinutesHome minutes={getRemainingMinutesFree3} />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusFree3 && getRemainingMinutesFree3 < 1 ? (
//                   <div className="text-lg m-2 ">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
//                       <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 divide-black border-black ">
//                         Last Ticket(s)
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <p className="text-xs">
//                   Contract Address: {FREE3_CONTRACT_ADDRESS}
//                 </p>
//                 <div className="mx-auto flex">
//                   <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto border-black font-bold">
//                     Raffle 3
//                   </h2>
//                 </div>
//                 <p className="text-md font-semibold">Entry Cost: FREE</p>
//                 <div className="font-bold flex-row flex justify-center items-center gap-2 ">
//                   <p>Status:</p>
//                   <span
//                     className={
//                       raffleStatusPaid
//                         ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
//                         : "text-red-500"
//                     }>
//                     {isActivePaid}
//                   </span>
//                 </div>
//                 <div className="gap-2 my-2 border-b-2 border-black" />

//                 <Button
//                   variant={"default"}
//                   className="dark:text-black text-white w-1/3">
//                   Join Free
//                 </Button>
//               </div>
//             </Link>

//             {/* Token Lottery */}

//             <Link href="/tokenocw">
//               <div className="block rounded-tr-[100px] rounded-bl-[100px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-orange-600/40 bg-orange-200">
//                 <span className="mt-1 text-3xl font-semibold">
//                   Prize: {prizeToken} {getAddress(getRewardToken as any)}
//                 </span>
//                 <p className="italic text-xs mt-2 border-t-2 border-black"></p>

//                 {!raffleStatusToken ? (
//                   <div className="text-lg m-2">
//                     Next Raffle Starts in
//                     <p>⬇</p>
//                     <ShiftingCountdown
//                       startDate={countdownDates[3]}
//                       text="days"
//                     />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusToken && getRemainingMinutesToken > 1 ? (
//                   <div className="text-lg m-2">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <CountdownMinutesHome minutes={getRemainingMinutesToken} />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusToken && getRemainingMinutesToken < 1 ? (
//                   <div className="text-lg m-2 ">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
//                       <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 divide-black border-black ">
//                         Last Ticket(s)
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <p className="text-xs">
//                   Contract Address: {TOKEN_PAIDTIMER_CONTRACT_ADDRESS}
//                 </p>
//                 <div className="mx-auto flex">
//                   <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto border-black  font-bold">
//                     Raffle 4
//                   </h2>
//                 </div>
//                 <p className="text-md font-semibold">
//                   Entry Cost: {amountCostToken} ETH | {amountCostUSDC} USDC |{" "}
//                   {amountCostUSDT} USDT
//                 </p>
//                 <div className="font-bold flex-row flex justify-center items-center gap-2 ">
//                   <p>Status:</p>
//                   <span
//                     className={
//                       raffleStatusPaid
//                         ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
//                         : "text-red-500"
//                     }>
//                     {isActivePaid}
//                   </span>
//                 </div>
//                 <div className="gap-2 my-2 border-b-2 border-black" />

//                 <Button
//                   variant={"outline"}
//                   className="text-black dark:text-white w-1/3">
//                   Buy Tickets
//                 </Button>
//               </div>
//             </Link>

//             {/* 5. partnership raffle */}
//             <Link href="/varonve">
//               <div className="block rounded-tr-[100px] rounded-bl-[100px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-orange-600/40 bg-orange-300">
//                 <span className="mt-1 text-3xl font-semibold">Prize: TBA</span>
//                 <p className="italic text-xs mt-2 border-t-2 border-black"></p>

//                 {!raffleStatusPaid ? (
//                   <div className="text-lg m-2">
//                     Next Raffle Starts in
//                     <p>⬇</p>
//                     <ShiftingCountdown
//                       startDate={countdownDates[0]}
//                       text="days"
//                     />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusPaid && getRemainingMinutesPaid > 1 ? (
//                   <div className="text-lg m-2">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <CountdownMinutesHome minutes={getRemainingMinutesPaid} />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusPaid && getRemainingMinutesPaid < 1 ? (
//                   <div className="text-lg m-2 ">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
//                       <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 border-black ">
//                         Last Ticket(s)
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <p className="text-xs">
//                   Contract Address: {FREE_PARTNERSHIP_CONTRACT_ADDRESS}
//                 </p>
//                 <div className="mx-auto flex">
//                   <h2 className="text-xl mt-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto  font-bold">
//                     Partnership Raffle
//                   </h2>
//                 </div>
//                 <p className="text-md font-semibold">Entry Cost: FREE</p>
//                 <div className="font-bold flex-row flex justify-center items-center gap-2 ">
//                   <p>Status:</p>
//                   <span
//                     className={
//                       raffleStatusPaid
//                         ? "text-lime-700 bg-lime-300 rounded-full py-1 px-2"
//                         : "text-red-500"
//                     }>
//                     {isActivePaid}
//                   </span>
//                 </div>
//                 <div className="gap-2 my-2 border-b-2 border-black" />

//                 <Button
//                   variant={"outline"}
//                   className="text-black dark:text-white w-1/3">
//                   Buy Tickets
//                 </Button>
//                 {/* <ArrowButton text="Buy Tickets" borderColor="white" buttonOverlayColor="black" /> */}
//               </div>
//             </Link>

//             {/* 6. Partnership2 Lottery */}

//             <Link href="/monsters">
//               <div className="block rounded-tr-[100px] rounded-bl-[100px] p-4 shadow-xl transition duration-500 ease-in-out hover:shadow-orange-600/40 bg-orange-200">
//                 <span className="mt-1 text-3xl font-semibold">Prize: TBA</span>
//                 <p className="italic text-xs mt-2 border-t-2 divide-cyan-300"></p>

//                 {!raffleStatusFree ? (
//                   <div className="text-lg m-2">
//                     Next Raffle Starts in
//                     <p>⬇</p>
//                     <ShiftingCountdown
//                       startDate={countdownDates[1]}
//                       text="days"
//                     />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusFree && getRemainingMinutesFree > 1 ? (
//                   <div className="text-lg m-2">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <CountdownMinutesHome minutes={getRemainingMinutesFree} />
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 {raffleStatusFree && getRemainingMinutesFree < 1 ? (
//                   <div className="text-lg m-2 ">
//                     Raffle Ends in
//                     <p>⬇</p>
//                     <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
//                       <div className="font-sans font-bold italic border-b-4 border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 border-slate-200 dark:border-black ">
//                         Last Ticket(s)
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <p className="text-xs">
//                   Contract Address: {FREEOCW_CONTRACT_ADDRESS}
//                 </p>
//                 <div className="mx-auto flex">
//                   <h2 className="text-xl m-2 border-t-2 border-dotted px-7 rounded-3xl mx-auto  font-bold">
//                     Partnership Raffle [2]
//                   </h2>
//                 </div>
//                 <p className="text-md font-semibold">Entry Cost: FREE</p>
//                 <div className="flex flex-row items-center justify-center gap-2 my-2 font-bold border-b-2 border-gray-80">
//                   <p>Status:</p>
//                   <span
//                     className={
//                       raffleStatusFree ? "text-lime-600" : "text-red-700"
//                     }>
//                     {isActiveFree}
//                   </span>
//                 </div>

//                 <Button
//                   variant={"default"}
//                   className="dark:text-black text-white w-1/3">
//                   Join Free
//                 </Button>
//               </div>
//             </Link>
//             {/* 6. sonu */}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Grids;
