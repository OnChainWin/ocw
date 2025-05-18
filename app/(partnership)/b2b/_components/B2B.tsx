"use client";
import { B2B_CONTRACT_ABI, B2B_CONTRACT_ADDRESS } from "@/constants/contract";
import React, { useEffect, useState } from "react";
import { formatEther, parseAbiItem, parseEther, parseGwei } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { MotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FcDisplay } from "react-icons/fc";
import ProgOCW from "@/components/LotteryArea/Progress";
import Image from "next/image";

export async function getDatafromdb() {
  // send post request to /api/query
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "ticket",
      query: "Sales",
    }),
  });
  const data = await response.json();
  return data.ticket;
}

export async function getDatafromdbwinner() {
  // send post request to /api/query
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "winner",
      query: "Sales",
    }),
  });

  const data = await response.json();
  return data.winner;
}

export const B2BPageArea = () => {
  const { address } = useAccount();
  const [players, setPlayers] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const { toast } = useToast();

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const OCWEvents = async () => {
    let playersPaid: {
      player: any;
      contractType: any;
      numberOfEntries: any;
    }[] = [];
    const playersfromdb = await getDatafromdb();
    playersfromdb.forEach((x: any) => {
      playersPaid.push({
        player: x.wallet,
        contractType: x.raffeltype,
        numberOfEntries: x.ticketcount,
      });
    });
    setPlayers(playersPaid.slice(-10).reverse());
  };

  const OCWWEvents = async () => {
    let winnersarray: {
      winner: any;
      contractType: any;
      prizeAmount: any;
      rewardToken: any;
    }[] = [];
    const winnersfromdb = await getDatafromdbwinner();
    winnersfromdb.forEach((x: any) => {
      winnersarray.push({
        winner: x.wallet,
        contractType: x.raffeltype,
        prizeAmount: parseInt(x.prizeamount).toString(),
        rewardToken: x.rewardToken,
      });
    });
    setWinners(winnersarray.slice(-10).reverse());
  };

  const {
    data: hashy,
    isPending,
    writeContract,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Your transaction has been submitted",
          duration: 3000,
        });
      },
      onError: (error: any) => {
        const partToShow = error.message
          .split(/Contract Call:|Request Arguments:|This error/)[0]
          .trim();
        toast({
          title: "OCW: Your transaction failed." + partToShow,
          duration: 5000,
        });
      },
    },
  });

  const buyTicket = async () => {
    writeContract({
      abi: B2B_CONTRACT_ABI,
      address: B2B_CONTRACT_ADDRESS,
      account: address,
      functionName: "buyEntry",
      args: [BigInt(ticketAmount)],
      value: parseEther(amountCostOnSubmit.toString()),
      gas: BigInt(650000),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hashy,
    });

  const [ticketAmount, setTicketAmount] = useState<any>(1);

  const { data: entryFee } = useReadContract({
    abi: B2B_CONTRACT_ABI,
    address: B2B_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const { data: prizePool, refetch: refetchPool } = useReadContract({
    abi: B2B_CONTRACT_ABI,
    address: B2B_CONTRACT_ADDRESS,
    functionName: "prizePool",
  });

  const entryCostInWei = entryFee ? formatEther(entryFee as bigint) : "0";
  const commissionRate = 0.05; // %5 komisyon oranı

  const amountCostOnSubmit =
    parseFloat(entryCostInWei) * (1 + commissionRate) * ticketAmount;

  const amountCost = parseFloat(entryCostInWei);

  function increaseEntryAmount() {
    setTicketAmount(ticketAmount + 1);
  }

  function decreaseEntryAmount() {
    if (ticketAmount > 1) {
      setTicketAmount(ticketAmount - 1);
    }
  }

  const {
    data: targetPrizeAmount,
    isLoading: isTargetPrizeAmount,
    error: errorTargetPrizeAmount,
  } = useReadContract({
    abi: B2B_CONTRACT_ABI,
    address: B2B_CONTRACT_ADDRESS,
    functionName: "targetPrizeAmount",
  });

  const { data: requiredEntries } = useReadContract({
    abi: B2B_CONTRACT_ABI,
    address: B2B_CONTRACT_ADDRESS,
    functionName: "requiredEntries",
  });

  const { data: totalEntries, refetch } = useReadContract({
    abi: B2B_CONTRACT_ABI,
    address: B2B_CONTRACT_ADDRESS,
    functionName: "totalEntries",
  });

  const { data: getNumberOfTicketsPerPlayers, refetch: refetchTicket } =
    useReadContract({
      abi: B2B_CONTRACT_ABI,
      address: B2B_CONTRACT_ADDRESS,
      functionName: "getNumberOfTicketsPerPlayer",
      args: [address],
    });

  useEffect(() => {
    const getAllEvents = async () => {
      await OCWEvents();
      await OCWWEvents();
    };

    if (isConfirmed) {
      toast({
        title: "You have successfully bought a ticket!",
        duration: 3000,
      });

      refetch();
      refetchStatus();
      refetchTicket();
      refetchPool();
      getAllEvents();
    }
  }, [isConfirmed, isConfirming]);

  useEffect(() => {
    const getAllEvents = async () => {
      await OCWEvents();
      await OCWWEvents();
    };
    getAllEvents();
  }, [address]);

  const {
    data: raffleStatus,
    isLoading: isRaffleStatus,
    error: errorRaffleStatus,
    refetch: refetchStatus,
  } = useReadContract({
    abi: B2B_CONTRACT_ABI,
    address: B2B_CONTRACT_ADDRESS,
    functionName: "raffleStatus",
  });

  const perTicket = getNumberOfTicketsPerPlayers
    ? getNumberOfTicketsPerPlayers
    : 0;
  const prize = targetPrizeAmount ? formatEther(targetPrizeAmount as any) : "0";
  const soldTickets = totalEntries ? totalEntries : "0";
  const soldTicketsNumber: number =
    typeof soldTickets === "bigint"
      ? Number(soldTickets)
      : (soldTickets as number);

  const perTicketNumber: number = parseFloat(perTicket.toString());
  const calculateChange: number = (perTicketNumber / soldTicketsNumber) * 100;

  const isActive = raffleStatus ? "Active" : "Not Active";

  const totalEntriesNumber: number = Number(totalEntries);
  const amountCostNumber: number = Number(amountCost);
  const targetPrizeAmountNumber: number = Number(prize);

  const requiredTix: number =
    typeof requiredEntries === "bigint"
      ? Number(requiredEntries)
      : Number(requiredEntries || 0);

  // Yeni progress hesaplaması: totalEntries/requiredEntries * 100
  const progressValue = (totalEntriesNumber / requiredTix) * 100;

  return (
    <div className="min-h-screen px-4 py-12 text-zinc-50">
      <div className="flex items-center gap-2 text-center flex-row justify-center">
        <FcDisplay className="w-10 h-10" />
        <h1 className="text-black dark:text-white text-2xl font-bold font-sans">
          OCW Raffle
        </h1>
      </div>
      <div className="flex justify-center py-4">
        <Image
          src="/sales/clipper1312.webp"
          alt="logo"
          width={250}
          height={250}
          className="rounded-md size-48"
        />
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4"
      >
        <Block className="col-span-12 row-span-2 md:col-span-6 justify-between flex flex-col">
          <div className="font-bold">
            <p className="text-2xl text-lime-300 sm:text-3xl md:text-4xl lg:text-5xl">
              Prize
            </p>
            <p className="my-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              1 Clipper NFT
            </p>
          </div>
          <div className="border-t-2 border-collapse border-white/90" />
          <div className="text-lg text-orange-400">
            {!raffleStatus && 1 < 1 ? (
              <div className="text-orange-300">Raffle Ended</div>
            ) : (
              <div className="text-orange-300"></div>
            )}
          </div>
          {/* <a
            href="#"
            className="flex items-center gap-1 text-red-300 hover:underline">
            Contact me <FiArrowRight />
          </a> */}
        </Block>

        {/* Sağ 4 */}

        <Block
          whileHover={{
            rotate: "0deg",
            scale: 1.01,
          }}
          className="col-span-6 bg-[#f1c88f] md:col-span-3"
        >
          <h1 className="text-lg font-medium">Ticket Cost:</h1>
          <h2 className="font-bold text-sm mt-1">{amountCost} ETH</h2>
        </Block>
        <Block
          whileHover={{
            rotate: "-0.2deg",
            scale: 1.01,
          }}
          className="col-span-6 bg-green-600 md:col-span-3"
        >
          <div className="text-lg font-medium">
            Sold Tickets: {soldTickets?.toString()}
          </div>

          <div className="font-bold">
            Status:{" "}
            <span className={raffleStatus ? "text-lime-300" : "text-red-500"}>
              {isActive}
            </span>
          </div>
        </Block>
        <Block
          whileHover={{
            rotate: "+2.5deg",
            scale: 1.05,
          }}
          className="col-span-12 bg-zinc-500 md:col-span-6"
        >
          {requiredEntries ? (
            <div className="text-lg font-medium">
              Total Tickets: {requiredEntries.toString()}
            </div>
          ) : (
            <div className="text-lg font-medium">Total Tickets: 0</div>
          )}
          <div></div>
        </Block>

        {/* Big area */}
        <Block className="col-span-12 flex flex-col justify-between md:col-span-12 text-center items-center">
          <div className="text-2xl m-3 font-extrabold border-blue-100">
            Buy Tickets
          </div>
          <div className="">
            {address ? (
              <>
                <div className="flex flex-row justify-center">
                  <Button
                    onClick={decreaseEntryAmount}
                    variant={"outline"}
                    className="text-white  bg-zinc-700 hover:bg-zinc-400"
                  >
                    -
                  </Button>
                  <span className="w-4/12 flex flex-col border-b-2 font-bold font-mono text-center rounded-sm items-center self-center">
                    ⌁ {ticketAmount} ⌁
                  </span>
                  <Button
                    onClick={increaseEntryAmount}
                    variant={"outline"}
                    className="text-white  bg-zinc-700 hover:bg-zinc-400"
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant={"outline"}
                  className="md:w-[400px] max-md:w-[240px] mt-3 text-white bg-zinc-700 hover:bg-zinc-400"
                  onClick={() => {
                    buyTicket();
                    setTicketAmount(1);
                  }}
                >{`Buy Ticket(s)`}</Button>
              </>
            ) : (
              <p className="mt-2">Please connect your wallet to buy ticket!</p>
            )}
          </div>
        </Block>

        {/* My Tickets area */}

        <Block className="col-span-5 md:col-span-5 flex flex-col items-center text-center justify-center">
          <p className="text-lg mb-3">My Tickets:</p>
          <span className="text-5xl text-orange-400 border p-4 ">
            {perTicket.toString()}
          </span>
          <span className="">
            {isNaN(calculateChange) ? "" : "Chance to win"}
          </span>
          <span className="font-bold text-lg">
            {isNaN(calculateChange) ? "" : calculateChange.toFixed(2) + "%"}
          </span>
        </Block>

        {/* Buy Ticket area */}
        <Block className="col-span-7 md:col-span-7 text-3xl flex flex-col items-center text-center justify-center">
          <p className="text-orange-400">Progress</p>
          <ProgOCW percentage={progressValue} colour="orange" />
        </Block>

        {/* Raffle P&W */}

        <Block className="col-span-12 flex flex-col md:col-span-6 text-center items-center">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
              <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-end rounded-t-3xl -top-[38px] -right-[30px] sm:right-[27px] -z-10 py-[0.65rem] bg-orange-200 shadow-lg shadow-base-300">
                <p className="my-0 text-sm text-orange-700 font-bold text-center">
                  Players
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 relative flex max-w-[500px] h-auto w-full flex-col self-center bg-center bg-orange-400 rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-e-3xl">
            <table className="table-fixed w-full text-white">
              <thead>
                <tr className="">
                  <th className="w-2/5 text-sm">Player Address</th>
                  <th className="w-1/5 text-sm"> Entry</th>
                </tr>
              </thead>
              <tbody className="max-md:text-sm">
                {players.map((play, index) => (
                  <tr key={index} className="hover:opacity-80">
                    <td className="border px-4 text-center py-2">
                      {truncateAddress(play.player)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {play.numberOfEntries}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block className="col-span-12 flex flex-col md:col-span-6 text-center items-center">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
              <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-start rounded-t-3xl -top-[38px] -left-[30px] sm:left-[27px] -z-10 py-[0.65rem] bg-gray-300 ">
                <p className="my-0 text-sm text-gray-800 font-bold text-center">
                  Winners
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 relative flex max-w-[500px] h-auto w-full flex-col self-center bg-center bg-white rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-l-3xl">
            <table className="table-fixed w-full text-black">
              <thead>
                <tr className="hover:opacity-80 hover:font-bold">
                  <th className="w-2/6 text-sm">Winner Address</th>
                  {/* <th className="w-2/6 text-sm">Prize</th> */}
                </tr>
              </thead>
              <tbody className="max-md:text-sm text-black">
                {winners.map((win, index) => (
                  <tr key={index} className="hover:opacity-80">
                    <td className="border px-4 text-center py-2">
                      {truncateAddress(win.winner)}
                    </td>
                    {/* <td className="border px-4 py-2 text-center">
                      {parseFloat(formatEther(win.prizeAmount as any)).toFixed(
                        5,
                      )}{" "}
                      ETH
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      </motion.div>
    </div>
  );
};

type BlockProps = {
  className?: string;
} & MotionProps;

const Block = ({ className, ...rest }: BlockProps) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={twMerge(
        "col-span-4 rounded-lg border border-zinc-700 bg-zinc-900 p-6",
        className
      )}
      {...rest}
    />
  );
};
