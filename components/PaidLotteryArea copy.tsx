// "use client";
// import {
//   A_PAIDTIMER_CONTRACT_ABI,
//   A_PAIDTIMER_CONTRACT_ADDRESS,
// } from "@/constants/contract";
// import { useEffect, useState } from "react";
// import { formatEther, parseEther } from "viem";
// import {
//   useAccount,
//   useReadContract,
//   useWaitForTransactionReceipt,
//   useWriteContract,
//   useWatchContractEvent,
// } from "wagmi";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { AOCW_WinnerInfo } from "@/components/AOCW_WinnerInfo";
// import { Progress } from "@nextui-org/react";

// type Props = {};

// const OCWLotteryArea = (props: Props) => {
//   const { address } = useAccount();
//   const { toast } = useToast();

//   const {
//     data: hash,
//     isPending,
//     writeContract,
//     error,
//   } = useWriteContract({
//     mutation: {
//       onSuccess: () => {
//         toast({
//           title: "Your transaction has been submitted",
//           duration: 3000,
//         });
//         refetch();
//       },
//       onError: (error) => {
//         const partToShow = error.message
//           .split(/Contract Call:|Request Arguments:|This error/)[0]
//           .trim();
//         toast({
//           title: "OCW: Your transaction failed." + partToShow,
//           duration: 5000,
//         });
//       },
//     },
//   });

//   const buyTicket = async () => {
//     writeContract({
//       abi: A_PAIDTIMER_CONTRACT_ABI,
//       address: A_PAIDTIMER_CONTRACT_ADDRESS,
//       account: address,
//       functionName: "buyEntry",
//       args: [BigInt(ticketAmount)],
//       value: parseEther(amountCostOnSubmit.toString()),
//     });
//   };

//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });

//   const [ticketAmount, setTicketAmount] = useState<any>(1);

//   const { data: entryFee } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "entryFee",
//   });

//   const entryCostInWei = entryFee ? formatEther(entryFee as bigint) : "0";
//   const commissionRate = 0.05; // %5 komisyon oranı

//   const amountCostOnSubmit =
//     parseFloat(entryCostInWei) * (1 + commissionRate) * ticketAmount;

//   const amountCost = parseFloat(entryCostInWei);

//   function increaseEntryAmount() {
//     setTicketAmount(ticketAmount + 1);
//   }

//   function decreaseEntryAmount() {
//     if (ticketAmount > 1) {
//       setTicketAmount(ticketAmount - 1);
//     }
//   }

//   const {
//     data: targetPrizeAmount,
//     isLoading: isTargetPrizeAmount,
//     error: errorTargetPrizeAmount,
//   } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "targetPrizeAmount",
//   });

//   const {
//     data: getTotalEntries,
//     isLoading: isGetTotalEntries,
//     error: errorGetTotalEntries,
//     refetch,
//   } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "getTotalEntries",
//   });

//   useEffect(() => {
//     if (isConfirmed) {
//       toast({
//         title: "You have successfully bought a ticket!",
//         duration: 3000,
//       });
//       refetch();
//       refetchMin();
//       refetchSec();
//       refetchStatus();
//     }
//   }, [isConfirmed, isConfirming]);

//   const {
//     data: getRemainingTimeMinutes,
//     isLoading: isGetRemainingTimeMinutes,
//     error: errorGetRemainingTimeMinutes,
//     refetch: refetchMin,
//   } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "getRemainingTimeMinutes",
//   });

//   const {
//     data: getRemainingTimeSeconds,
//     isLoading: isGetRemainingTimeSeconds,
//     error: errorGetRemainingTimeSeconds,
//     refetch: refetchSec,
//   } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "getRemainingTimeSeconds",
//   });

//   const {
//     data: raffleStatus,
//     isLoading: isRaffleStatus,
//     error: errorRaffleStatus,
//     refetch: refetchStatus,
//   } = useReadContract({
//     abi: A_PAIDTIMER_CONTRACT_ABI,
//     address: A_PAIDTIMER_CONTRACT_ADDRESS,
//     functionName: "raffleStatus",
//   });

//   const prize = targetPrizeAmount ? formatEther(targetPrizeAmount as any) : "0";
//   const soldTickets = getTotalEntries ? getTotalEntries : "0";
//   const getRemainingTime = getRemainingTimeMinutes
//     ? (getRemainingTimeMinutes as number)
//     : "0";

//   const isActive = raffleStatus ? "Active" : "Not Active";

//   // const calculateResult = () => {
//   //   const cost = amountCost; // parseFloat ile çevrildiği için bu zaten bir number türünde.
//   //   const prizeValue = parseFloat(prize); // prize'ı number'a çeviriyoruz.
//   //   const ticketsSold = parseFloat(soldTickets); // soldTickets'ı number'a çeviriyoruz, eğer bu zaten bir string ise.

//   //   // Şimdi tüm değerler number türünde olduğu için BigInt ile ilgili bir hata almayacağız.
//   //   return cost !== 0 ? prizeValue / cost - ticketsSold : -ticketsSold;
//   // };

//   // const deneme = useWatchContractEvent({
//   //   abi: A_PAIDTIMER_CONTRACT_ABI,
//   //   address: A_PAIDTIMER_CONTRACT_ADDRESS,
//   //   batch: true,
//   //   eventName: "NewEntry",
//   //   onLogs(logs) {
//   //     console.log("New logs!", logs);
//   //   },
//   // });

//   return (
//     <div className=" justify-center items-center text-center">
//       <div className="text-2xl mt-4">LotteryArea</div>
//       {/* <div>
//         Hesaplama:
//         {calculateResult()}
//       </div> */}
//       <div className="text-indigo-500 font-mono">
//         <div className="text-xl">Prize: {prize}</div>
//         <div className="mb-5">Ticket Cost: {amountCost}</div>
//         <div className="justify-center text-center items-center flex mb-5">
//           <Progress
//             size="sm"
//             radius="sm"
//             classNames={{
//               base: "max-w-md",
//               track: "drop-shadow-md border border-default rounded-xl",
//               indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
//               label: "tracking-wider font-medium text-default-600",
//               value: "text-foreground/60",
//             }}
//             label="Progress"
//             value={35}
//             showValueLabel={true}
//           />
//         </div>
//         <div>Total Process: </div>
//         <div className="mb-5">Selled Tickets: {soldTickets?.toString()}</div>       {getRemainingTime == "0" ? (
//           <div className=""></div>
//         ) : (
//           <div>Remaining Time(min): {getRemainingTime?.toString()}</div>
//         )}
//         <div>
//           {raffleStatus && (getRemainingTime as number) < 1
//             ? "Last ticket(s)"
//             : ""}
//         </div>
//         <div className="font-bold">
//           Status:{" "}
//           <span className={raffleStatus ? "text-lime-500" : "text-red-500"}>
//             {isActive}
//           </span>
//         </div>
//       </div>
//       <div className="text-2xl mt-5 font-extrabold border-t-2 border-blue-100">
//         Buy Tickets
//       </div>
//       <div>
//         {address ? (
//           <>
//             <div className="flex justify-center m-3">
//               <Button onClick={decreaseEntryAmount} variant={"outline"}>
//                 -
//               </Button>
//               <span className="w-1/12 border-b-2 font-bold font-mono text-center rounded-sm items-center self-center">
//                 ⌁ {ticketAmount} ⌁
//               </span>
//               <Button onClick={increaseEntryAmount} variant={"outline"}>
//                 +
//               </Button>
//             </div>
//             <Button
//               variant={"outline"}
//               onClick={() => {
//                 buyTicket();
//                 setTicketAmount(1);
//               }}>{`Buy Ticket(s)`}</Button>
//           </>
//         ) : (
//           <p className="mt-2">Please connect your wallet to buy ticket!</p>
//         )}
//       </div>
//       <AOCW_WinnerInfo />
//     </div>
//   );
// };

// export default OCWLotteryArea;
