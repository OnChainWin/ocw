// "use client";
// import { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import { parseAbiItem } from "viem";
// import { formatEther } from "viem";
// import { publicClient } from "@/lib/client";
// import {
//   A_PAIDTIMER_CONTRACT_ADDRESS,
//   FREE3_CONTRACT_ADDRESS,
//   FREEOCW_CONTRACT_ADDRESS,
//   TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
// } from "@/constants/contract";

// export function WPInfo() {
//   const { address } = useAccount();
//   const [combinedPlayers, setCombinedPlayers] = useState<any[]>([]);
//   const [combinedWinners, setCombinedWinners] = useState<any[]>([]);

//   function truncateAddress(address: string) {
//     return address.slice(0, 6) + "..." + address.slice(-4);
//   }

//   function getAddress(addressContract: string) {
//     if (addressContract === "0x0a9c1b3fbafcedae0ebf8d0dee85c57500c55f9d") {
//       return "USDC";
//     } else if (
//       addressContract === "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"
//     ) {
//       return "USDT";
//     } else {
//       return "ETH";
//     }
//   }

//   const fetchCombinedPlayers = async () => {
//     const latestBlock = await publicClient.getBlockNumber();
//     const fromBlock = BigInt(latestBlock) - 9999n;

//     const paidEntryLogs = await publicClient.getLogs({
//       address: A_PAIDTIMER_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event NewEntry(address indexed player, uint256 numberOfEntries)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const freeEntryLogs = await publicClient.getLogs({
//       address: FREEOCW_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event NewEntry(address indexed player, uint256 numberOfEntries)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const free3EntryLogs = await publicClient.getLogs({
//       address: FREE3_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event NewEntry(address indexed player, uint256 numberOfEntries)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const tokenEntryLogs = await publicClient.getLogs({
//       address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event NewEntry(address indexed player, uint256 numberOfEntries)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     await fetch("https://webhook.site/6fd2f0f0-fb28-4bff-b1fb-ddb4bf842588e", {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         paidEntryLogs
//       }),
//     });

//     const combinedPlayers = [
//       ...paidEntryLogs.map((log) => ({
//         player: log.args.player?.toString(),
//         numberOfEntries: log.args.numberOfEntries?.toString(),
//         contractType: "Paid",
//       })),
//       ...freeEntryLogs.map((log) => ({
//         player: log.args.player?.toString(),
//         numberOfEntries: log.args.numberOfEntries?.toString(),
//         contractType: "Free",
//       })),
//       ...free3EntryLogs.map((log) => ({
//         player: log.args.player?.toString(),
//         numberOfEntries: log.args.numberOfEntries?.toString(),
//         contractType: "Free3",
//       })),
//       ...tokenEntryLogs.map((log) => ({
//         player: log.args.player?.toString(),
//         numberOfEntries: log.args.numberOfEntries?.toString(),
//         contractType: "TokenPaid",
//       })),
//     ];

//     combinedPlayers.sort(() => Math.random() - 0.5); // Shuffle the array
//     setCombinedPlayers(combinedPlayers.slice(0, 10));
//   };

//   const fetchCombinedWinners = async () => {
//     const latestBlock = await publicClient.getBlockNumber();
//     const fromBlock = BigInt(latestBlock) - 9999n;

//     const paidWinnerLogs = await publicClient.getLogs({
//       address: A_PAIDTIMER_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event RaffleEnded(address winner, uint256 prizeAmount)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const freeWinnerLogs = await publicClient.getLogs({
//       address: FREEOCW_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event WinnerSelected(address winner, uint256 prizeAmount)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const free3WinnerLogs = await publicClient.getLogs({
//       address: FREE3_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event WinnerSelected(address winner, uint256 prizeAmount)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const tokenWinnerLogs = await publicClient.getLogs({
//       address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
//       event: parseAbiItem(
//         "event RaffleEnded(address winner, uint256 targetPrizeAmount, address rewardToken)",
//       ),
//       fromBlock,
//       toBlock: "latest",
//     });

//     const combinedWinners = [
//       ...paidWinnerLogs.map((log) => ({
//         winner: log.args.winner?.toString(),
//         prizeAmount: log.args.prizeAmount?.toString(),
//         contractType: "Paid",
//       })),
//       ...freeWinnerLogs.map((log) => ({
//         winner: log.args.winner?.toString(),
//         prizeAmount: log.args.prizeAmount?.toString(),
//         contractType: "Free",
//       })),
//       ...free3WinnerLogs.map((log) => ({
//         winner: log.args.winner?.toString(),
//         prizeAmount: log.args.prizeAmount?.toString(),
//         contractType: "Free3",
//       })),
//       ...tokenWinnerLogs.map((log) => ({
//         winner: log.args.winner?.toString(),
//         prizeAmount: log.args.targetPrizeAmount?.toString(),
//         rewardToken: log.args.rewardToken?.toString(),
//         contractType: "TokenPaid",
//       })),
//     ];

//     combinedWinners.sort(() => Math.random() - 0.5); // Shuffle the array
//     setCombinedWinners(combinedWinners.slice(0, 10));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchCombinedPlayers();
//       await fetchCombinedWinners();
//     };
//     fetchData();
//   }, [address]);

//   return (
//     <div className="flex flex-col w-full h-full justify-center items-center my-8">
//       <div className="text-3xl mb-5 border-black dark:border-white border-b-2 font-bold">
//         Not Only Trust But Verify
//       </div>
//       <div className="flex flex-col lg:flex-row gap-4 xl:gap-40">
//         <div className=" text-black rounded-3xl">
//           <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
//             <div className="z-10">
//               <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
//                 <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-start rounded-t-3xl -top-[38px] -z-10 py-[0.65rem] bg-orange-200 shadow-lg shadow-base-300">
//                   <p className="my-0 text-sm text-orange-700 font-bold text-center">
//                     Players
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="p-4 relative flex max-w-[500px] h-auto w-full flex-col self-center bg-center bg-orange-400 rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-e-3xl">
//             <table className="table-fixed w-full text-white text-sm">
//               <thead>
//                 <tr className="">
//                   <th className="w-2/5 text-sm">Contract Type</th>
//                   <th className="w-2/5 text-sm">Player Address</th>
//                   <th className="w-1/5 text-sm">Ticket Entry</th>
//                 </tr>
//               </thead>
//               <tbody className="max-md:text-sm">
//                 {combinedPlayers.map((player, index) => (
//                   <tr key={index} className="hover:opacity-80">
//                     <td className="border px-4 text-center py-2">
//                       {player.contractType === "Paid"
//                         ? "Paid OCW"
//                         : player.contractType === "Free"
//                         ? "Free OCW"
//                         : player.contractType === "Free3"
//                         ? "Free3 OCW"
//                         : player.contractType === "TokenPaid"
//                         ? "Token OCW"
//                         : "Unknown OCW"}
//                     </td>
//                     <td className="border px-4 text-center py-2">
//                       {truncateAddress(player.player)}
//                     </td>
//                     <td className="border px-4 py-2 text-center">
//                       {player.contractType === "Paid" ||
//                       player.contractType === "TokenPaid"
//                         ? `${player.numberOfEntries}`
//                         : "1"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className=" text-black rounded-3xl">
//           <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
//             <div className="z-10">
//               <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
//                 <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-end rounded-t-3xl -top-[38px] -z-10 py-[0.65rem] bg-gray-300 ">
//                   <p className="my-0 text-sm text-gray-800 font-bold text-center">
//                     Winners
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="p-4 relative flex max-w-[500px] h-auto w-full flex-col self-center bg-center bg-white rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-l-3xl">
//             <table className="table-fixed w-full text-sm">
//               <thead>
//                 <tr className="hover:opacity-80 hover:font-bold">
//                   <th className="w-4/12 text-sm">Contract Type</th>
//                   <th className="w-4/12 text-sm">Winner Address</th>
//                   <th className="w-4/12 text-sm">Prize</th>
//                 </tr>
//               </thead>
//               <tbody className="max-md:text-sm">
//                 {combinedWinners.map((winner, index) => (
//                   <tr key={index} className="hover:opacity-80">
//                     <td className="border px-4 text-center py-2">
//                       {winner.contractType === "Paid"
//                         ? "Paid OCW"
//                         : winner.contractType === "Free"
//                         ? "Free OCW"
//                         : winner.contractType === "Free3"
//                         ? "Free3 OCW"
//                         : winner.contractType === "TokenPaid"
//                         ? "Token OCW"
//                         : "Unknown OCW"}
//                     </td>
//                     <td className="border px-4 text-center py-2">
//                       {truncateAddress(winner.winner)}
//                     </td>
//                     <td className="border px-4 py-2 text-center">
//                       {winner.contractType === "TokenPaid"
//                         ? (Number(winner.prizeAmount) / 1000000).toFixed(1)
//                         : parseFloat(
//                             formatEther(winner.prizeAmount as any),
//                           ).toFixed(4)}{" "}
//                       {getAddress(winner.rewardToken)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
