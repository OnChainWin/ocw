// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import { CopyToClipboardPage } from "./_components/Copy";
// import Loading from "@/components/Loading";
// import TicketWidget from "./_components/Ticket";
// import VerifyEmailArea from "@/components/VerifyEmail";
// import Winner from "./_components/Winner";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { RiFileWarningFill } from "react-icons/ri";
// import { FaTwitter, FaHeart, FaRetweet, FaReply } from "react-icons/fa";
// import HoverText from "./_components/HoverText";
// import HoverTextWinner from "./_components/HoverTextWinner";
// import Link from "next/link";

// Kullanıcı verisi için bir interface tanımlıyoruz
// interface UserData {
//   _id: string;
//   email: string;
//   emailverified: boolean;
//   premium: boolean;
//   refcode: string;
//   wallet: string;
// }

// interface TicketData {
//   _id: string;
//   wallet: string;
//   raffeltype: string;
//   ticketcount: number;
//   time: string;
//   hash: string;
// }

// interface WinnerData {
//   _id: string;
//   wallet: string;
//   raffeltype: string;
//   time: string;
//   prizeamount?: string;
//   hash: string;
//   rewardToken?: string;
// }

// const ProfilePage: React.FC = () => {
//   const { address } = useAccount();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [ticketData, setTicketData] = useState<TicketData[]>([]);
//   const [winnerData, setWinnerData] = useState<WinnerData[]>([]); // Kazanan verisi için state
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showAllTickets, setShowAllTickets] = useState(false); // Biletlerin hepsini gösterme durumu
//   const [showAllWinners, setShowAllWinners] = useState(false); // Winner'ların hepsini gösterme durumu
//   const [isMobile, setIsMobile] = useState(false); // Ekran boyutunu kontrol etme durumu

//   useEffect(() => {
//     if (address) {
//       fetchUserData(address);
//       fetchUserTickets(address);
//       fetchUserWinners(address); // Kazananları çek
//     }

//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768); // 768px altındaki ekranları mobil olarak kabul ediyoruz
//     };

//     handleResize(); // İlk sayfa yüklendiğinde kontrol et
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [address]);

//   const fetchUserData = async (walletAddress: string) => {
//     try {
//       const response = await fetch("/api/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           querytype: "user",
//           query: walletAddress,
//         }),
//       });

//       const data = await response.json();

//       if (data.durum) {
//         setUserData(data.user);
//       } else {
//         setUserData(null);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setUserData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserTickets = async (walletAddress: string) => {
//     try {
//       const response = await fetch("/api/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           querytype: "ticket",
//           query: walletAddress,
//         }),
//       });

//       const data = await response.json();

//       if (data.durum) {
//         setTicketData(data.ticket);
//       } else {
//         console.error("Tickets not found");
//       }
//     } catch (error) {
//       console.error("Error fetching ticket data:", error);
//     }
//   };

//   const fetchUserWinners = async (walletAddress: string) => {
//     try {
//       const response = await fetch("/api/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           querytype: "winner",
//           query: walletAddress,
//         }),
//       });

//       const data = await response.json();

//       if (data.durum) {
//         setWinnerData(data.winner);
//       } else {
//         console.error("Winners not found");
//       }
//     } catch (error) {
//       console.error("Error fetching winner data:", error);
//     }
//   };

//   if (!address) {
//     return (
//       <div className="w-full h-full mx-auto items-center justify-center flex text-center min-h-screen flex-col">
//         <RiFileWarningFill className="size-12 fill-orange-500 border rounded-full p-2 border-orange-500 animate-ping duration-1000 transition-all ease-in-out mb-10" />
//         <p className="text-medium italic font-semibold p-2">
//           You need to connect your wallet to see your profile
//         </p>
//         <ConnectButton />
//       </div>
//     );
//   }

//   if (loading) {
//     return <Loading />;
//   }

//   if (!userData) {
//     return <VerifyEmailArea />;
//   }

//   const ticketsToShow = showAllTickets
//     ? ticketData.slice().reverse() 
//     : isMobile
//     ? ticketData.slice(-3).reverse() 
//     : ticketData.slice(-6).reverse();

//   const winnersToShow = showAllWinners
//     ? winnerData.slice().reverse() 
//     : isMobile
//     ? winnerData.slice(-3).reverse() 
//     : winnerData.slice(-6).reverse();

//   return (
//     <div>
//       <div className="text-black flex flex-col justify-between max-h-screen w-full h-full mx-auto">
//         <div className="flex sm:flex-row flex-col text-black dark:text-white">
//           <section className="m-auto w-full h-full sm:border-r">
//             <div className="w-full lg:w-12/12 px-4 mx-auto">
//               <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg mt-16">
//                 <div className="px-6">
//                   <div className="flex flex-col justify-center rounded-full items-center self-center bg-center">
//                     <Image
//                       src={"/logow.webp"}
//                       width={120}
//                       height={120}
//                       alt="logo"
//                       className="flex justify-center rounded-full"
//                     />
//                     <div className="w-full px-4 text-center">
//                       <div className="flex flex-col justify-center py-4 lg:pt-4">
//                         <span className="text-xs font-medium block tracking-wide">
//                           {address}
//                         </span>
//                         <div className="text-center flex flex-col mt-5">
//                           <span className="text-xl font-semibold font-mono text-orange-500">
//                             Referral Code
//                           </span>
//                           <div className="flex flex-row items-center justify-center text-center">
//                             {userData?.refcode || "Loading..."}
//                             {userData?.refcode && (
//                               <CopyToClipboardPage
//                                 textToCopy={`https://onchainwin.com/?ref=${
//                                   userData.refcode ?? ""
//                                 }`}
//                               />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <div className="">
//                       {userData?.emailverified
//                         ? "Email verified"
//                         : "Email is not verified"}
//                     </div>
//                     <h3 className="text-lg font-semibold leading-normal text-orange-500 ">
//                       {userData?.email || "Loading..."}
//                     </h3>

//                     <div className="text-sm leading-normal font-bold">
//                       <p className="mt-5">
//                         {" "}
//                         Paid Raffle: {userData?.premium ? "Yes" : "No"}
//                       </p>
//                     </div>

//                     <div className="mb-5">ID: {userData?._id || "N/A"}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Twitter Bölümü */}
//           <section className="container mt-4 m-auto items-center px-10 mx-auto rounded-lg my-4 p-4">
//             <div className="flex items-start">
//               <img
//                 src="/logo.png"
//                 alt="OnChainWin Logo"
//                 className="w-12 h-12 rounded-full mr-4 border inline-block p-1"
//               />
//               <div className="w-full">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-bold">OnChainWin</span> ·{" "}
//                     <span className="text-gray-500">@onchainwinx</span>
//                   </div>
//                   <a
//                     href="https://x.com/intent/follow?screen_name=OnChainWinX"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm font-medium hover:bg-blue-600 bg-blue-500 px-4 py-2 rounded-full">
//                     Follow
//                   </a>
//                 </div>
//                 <p className="text-gray-400 mt-2">
//                   Join the OnchainWin community and stay updated with the latest
//                   developments!
//                 </p>
//                 <div className="flex items-center justify-between mt-2 text-gray-500">
//                   <div className="flex items-center space-x-2 cursor-pointer hover:text-red-500">
//                     <Link
//                       href={
//                         "https://x.com/intent/like?tweet_id=1838939236159926448"
//                       }
//                       target="_blank">
//                       <FaHeart />
//                     </Link>
//                   </div>
//                   <div className="flex items-center space-x-2 cursor-pointer hover:text-green-500">
//                     <Link
//                       href={
//                         "https://x.com/intent/retweet?tweet_id=1838939236159926448"
//                       }
//                       className="p-1 rounded-full hover:bg-green-500/20 text-gray-500"
//                       target="_blank">
//                       <FaRetweet />
//                     </Link>
//                   </div>
//                   <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500">
//                     <Link
//                       href={
//                         "https://x.com/intent/comment?tweet_id=1838939236159926448"
//                       }
//                       className="p-1 rounded-full"
//                       target="_blank">
//                       <FaReply />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col space-y-2 mt-4">
//               <p className="text-3xl font-bold">TASKS</p>
//               <Link
//                 target="_blank"
//                 href={"https://x.com/intent/follow?screen_name=OnChainWinX"}
//                 className="border p-2 px-2 rounded-md border-neutral-900 bg-neutral-900 hover:border hover:border-white">
//                 Follow OnChainWin on X
//               </Link>
//               <Link
//                 target="_blank"
//                 href={"https://x.com/intent/like?tweet_id=1838939236159926448"}
//                 className="border p-2 px-2 rounded-md border-neutral-900 bg-neutral-900 hover:border hover:border-white">
//                 Like our tweet
//               </Link>
//               <Link
//                 target="_blank"
//                 href={
//                   "https://x.com/intent/retweet?tweet_id=1838939236159926448"
//                 }
//                 className="border p-2 px-2 rounded-md border-neutral-900 bg-neutral-900 hover:border hover:border-white">
//                 Retweet our tweet
//               </Link>
//               <Link
//                 target="_blank"
//                 href={
//                   "https://x.com/intent/tweet?text=Hey+%40onchainwinx%20%23OnChainWin"
//                 }
//                 className="border p-2 px-2 rounded-md border-neutral-900 bg-neutral-900 hover:border hover:border-white">
//                 Create a post on X about @OnChainWin
//               </Link>

//               <Link
//                 target="_blank"
//                 href={
//                   "https://discord.gg/SufJnfDkN6"
//                 }
//                 className="border p-2 px-2 rounded-md border-neutral-900 bg-neutral-900 hover:border hover:border-white">
//                 Join our Discord
//               </Link>
//             </div>
//           </section>
//         </div>

//         {/* Tickets bölümü */}
//         <div className="text-center border-t border-white">
//           <div className="flex flex-row justify-center mt-10">
//             <div className="w-full">
//               <div className="mx-auto text-5xl my-2 font-sans mt-2 text-orange-500 text-center font-bold">
//                 <HoverText text="Tickets" />
//               </div>
//               {ticketData.length > 0 ? (
//                 <div className="flex flex-row flex-wrap items-center justify-center text-center">
//                   {ticketsToShow.map((ticket) => (
//                     <div
//                       key={ticket._id}
//                       className="flex flex-row justify-center items-center text-center p-4 rounded-lg">
//                       <TicketWidget
//                         raffleType={ticket.raffeltype}
//                         ticketCount={ticket.ticketcount}
//                         time={new Date(ticket.time).toLocaleString()}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p>No tickets found</p>
//               )}
//               {ticketData.length > (isMobile ? 3 : 6) && !showAllTickets && (
//                 <div className="mt-4">
//                   <button
//                     onClick={() => setShowAllTickets(true)}
//                     className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
//                     See All Tickets
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Winner bölümü */}
//         <div className="text-center mt-5">
//           <div className="text-5xl my-2 font-sans text-green-500 text-center font-bold">
//             <HoverTextWinner text="Winners" />
//           </div>
//           {winnerData.length > 0 ? (
//             <div className="flex flex-row flex-wrap items-center justify-center text-center">
//               {winnersToShow.map((winner) => {
//                 return (
//                   <div
//                     key={winner._id}
//                     className="flex flex-row justify-center items-center text-center p-4 rounded-lg">
//                     <Winner
//                       raffleType={winner.raffeltype}
//                       prizeAmount={winner.prizeamount ?? ""}
//                       time={new Date(winner.time).toLocaleString()}
//                       numberOfWinners={1}
//                       rewardToken={
//                         winner.rewardToken === "notoken"
//                           ? "0x0000000000000000000000000000000000000000"
//                           : winner.rewardToken
//                       }
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p>No winners found</p>
//           )}
//           {winnerData.length > (isMobile ? 3 : 6) && !showAllWinners && (
//             <div className="mt-4">
//               <button
//                 onClick={() => setShowAllWinners(true)}
//                 className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
//                 See All Winners
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
