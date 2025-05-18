"use client";
import {} from "@/constants/contract";
import { Fragment, useEffect, useState } from "react";
import { formatEther, maxUint256, parseEther } from "viem";
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
import ShiftingCountdown2 from "../../Countdown2";
import CountdownMinutes from "../Countdown";
import ProgOCW from "../Progress";
import Link from "next/link";
import {
  BASE_ERC20_ABI,
  BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
  BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
  BASE_USDC_ADDRESS,
  BASE_USDT_ADDRESS,
} from "@/constants/contractBase";
import { countdownDates } from "./GridsBase";

export async function getDatafromdb() {
  // send post request to /api/query
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "ticket",
      query: "TokenPaidBase",
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
      query: "TokenPaidBase",
    }),
  });

  const data = await response.json();
  return data.winner;
}

export const OCWTokenPaidBase = () => {
  const { address } = useAccount();
  const [players, setPlayers] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const { toast } = useToast();

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

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

  const OCWEvents = async () => {
    let playersTokenPaid: {
      player: any;
      contractType: any;
      numberOfEntries: any;
    }[] = [];
    const playersfromdb = await getDatafromdb();
    playersfromdb.forEach((x: any) => {
      playersTokenPaid.push({
        player: x.wallet,
        contractType: x.raffeltype,
        numberOfEntries: x.ticketcount,
      });
    });
    setPlayers(playersTokenPaid.slice(-10));
  };

  const OCWWEvents = async () => {
    let winnersTokenPaid: {
      winner: any;
      contractType: any;
      prizeAmount: any;
      rewardToken: any;
    }[] = [];
    const winnersfromdb = await getDatafromdbwinner();
    winnersfromdb.forEach((x: any) => {
      winnersTokenPaid.push({
        winner: x.wallet,
        contractType: x.raffeltype,
        prizeAmount: parseInt(x.prizeamount).toString(),
        rewardToken: x.rewardToken,
      });
    });
    setWinners(winnersTokenPaid.slice(-10));
  };

  const { data: hashy, writeContract } = useWriteContract({
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

  // Allowance
  const { data: allowanceUSDC } = useReadContract({
    address: BASE_USDC_ADDRESS,
    abi: BASE_ERC20_ABI,
    functionName: "allowance",
    args: [address, BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS],
  });

  const { data: allowanceUSDT } = useReadContract({
    address: BASE_USDT_ADDRESS,
    abi: BASE_ERC20_ABI,
    functionName: "allowance",
    args: [address, BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS],
  });

  const { data: balanceUSDC } = useReadContract({
    address: BASE_USDC_ADDRESS,
    abi: BASE_ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    const fetchData = async () => {
      (await balanceUSDC) as any;
      // (await balanceUSDT) as any;
      (await allowanceUSDC) as any;
      (await allowanceUSDT) as any;
    };

    fetchData();
  }, [address]);

  const buyTicket = async () => {
    writeContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "buyEntry",
      args: [BigInt(ticketAmount)],
      value: parseEther(amountCostOnSubmit.toString()),
    });
  };

  const buyTicketUSDC = async () => {
    if (amountCostUSDCOnSubmit > (balanceUSDC as any)) {
      toast({
        title: "You don't have enough USDC.",
        duration: 3000,
      });
      return;
    }

    if ((!allowanceUSDC as any) > 0) {
      writeContract({
        abi: BASE_ERC20_ABI,
        address: BASE_USDC_ADDRESS,
        account: address,
        functionName: "approve",
        args: [BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS, maxUint256],
      });
    }

    writeContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "buyEntryUSDC",
      args: [BigInt(ticketAmount)],
      value: 1n,
    });
  };

  const buyTicketUSDT = async () => {
    if ((!allowanceUSDT as any) > 0) {
      writeContract({
        abi: BASE_ERC20_ABI,
        address: BASE_USDT_ADDRESS,
        account: address,
        functionName: "approve",
        args: [BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS, maxUint256],
      });
    }

    writeContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "buyEntryUSDT",
      args: [BigInt(ticketAmount)],
      value: BigInt(1),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hashy,
    });

  const [ticketAmount, setTicketAmount] = useState<any>(1);

  // ETH

  const { data: entryFee } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFee",
  });

  const entryCostInWei = entryFee ? formatEther(entryFee as bigint) : "0";
  const commissionRate = 0.05; // %5 komisyon oranı

  const amountCostOnSubmit =
    parseFloat(entryCostInWei) * (1 + commissionRate) * ticketAmount;

  const amountCost = parseFloat(entryCostInWei);

  // USDC

  const { data: entryFeeUSDC } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFeeUSDC",
  });

  const entryCostUSDCInWei = entryFeeUSDC
    ? formatEther(entryFeeUSDC as bigint)
    : "0";

  const amountCostUSDCOnSubmit =
    parseFloat(entryCostUSDCInWei) * (1 + commissionRate) * ticketAmount;

  const amountCostUSDC = parseFloat(entryCostUSDCInWei);

  const amountCostUSDC6 = Number(entryFeeUSDC);
  const realTokenUSDC = amountCostUSDC6 / 1000000;

  // USDT

  const { data: entryFeeUSDT } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFeeUSDT",
  });

  const entryCostUSDTInWei = entryFeeUSDT
    ? formatEther(entryFeeUSDT as bigint)
    : "0";

  const amountCostUSDTOnSubmit =
    parseFloat(entryCostUSDTInWei) * (1 + commissionRate) * ticketAmount;

  const amountCostUSDT = parseFloat(entryCostUSDTInWei);
  const amountCostUSDT6 = Number(entryFeeUSDT);
  const realTokenUSDT = amountCostUSDT6 / 1000000;

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
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "targetPrizeAmount",
  });

  const {
    data: getTotalEntries,
    isLoading: isGetTotalEntries,
    error: errorGetTotalEntries,
    refetch,
  } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getTotalEntries",
  });

  const { data: getNumberOfTicketsPerPlayers, refetch: refetchTicket } =
    useReadContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
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
      refetchMin();
      refetchSec();
      refetchStatus();
      refetchTicket();
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
    data: getRemainingTimeMinutes,
    isLoading: isGetRemainingTimeMinutes,
    error: errorGetRemainingTimeMinutes,
    refetch: refetchMin,
  } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeMinutes",
  });

  const {
    data: getRemainingTimeSeconds,
    isLoading: isGetRemainingTimeSeconds,
    error: errorGetRemainingTimeSeconds,
    refetch: refetchSec,
  } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeSec",
  });

  const {
    data: raffleStatus,
    isLoading: isRaffleStatus,
    error: errorRaffleStatus,
    refetch: refetchStatus,
  } = useReadContract({
    abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "raffleStatus",
  });

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

  const perTicket = getNumberOfTicketsPerPlayers
    ? getNumberOfTicketsPerPlayers
    : 0;
  const prize = targetPrizeAmount ? Number(targetPrizeAmount) / 1000000 : "0";
  const soldTickets = getTotalEntries ? getTotalEntries : "0";

  const getRemainingTime = getRemainingTimeMinutes
    ? (getRemainingTimeMinutes as number)
    : "0";
  const soldTicketsNumber: number =
    typeof soldTickets === "bigint"
      ? Number(soldTickets)
      : (soldTickets as number);

  const perTicketNumber: number = parseFloat(perTicket.toString());
  const calculateChange: number = (perTicketNumber / soldTicketsNumber) * 100;
  const isActive = raffleStatus ? "Active" : "Not Active";

  const { data: getRaffleStartDuration, refetch: refetchStart } =
    useReadContract({
      abi: BASE_TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: BASE_TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      functionName: "getRaffleStartDuration",
    });

  const getRemainingMinutes =
    typeof getRemainingTimeMinutes === "number"
      ? getRemainingTimeMinutes
      : Number(getRemainingTimeMinutes);

  const raffleDuration =
    typeof getRaffleStartDuration === "number"
      ? getRaffleStartDuration
      : Number(getRaffleStartDuration);

  const progressValue = raffleStatus
    ? Math.floor(
        ((raffleDuration - getRemainingMinutes) / raffleDuration) * 100 - 1,
      )
    : ((raffleDuration - getRemainingMinutes) / raffleDuration) * 100;

  return (
    <div className="min-h-screen px-4 py-12 text-zinc-50">
      <div className="flex items-center gap-2 text-center flex-row justify-center">
        <FcDisplay className="w-10 h-10" />
        <h1 className="text-black dark:text-white text-2xl font-bold font-sans">
          OCW Raffle 4 Base
        </h1>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4">
        <Block className="col-span-12 row-span-2 md:col-span-6 justify-between flex flex-col">
          <div className="text-xl font-bold justify-between flex flex-row gap-5">
            <div className="font-bold">
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
                Total Prize
              </p>
              <p className="my-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                {prize}
              </p>
            </div>
            <Link
              href={`https://basescan.org/token/${getRewardToken}`}
              target="_blank">
              <h2 className="text-lg text-end flex bg-orange-400 text-orange-800 border p-3 rounded-full hover:shadow-orange-400 shadow-lg cursor-pointer">
                {getName as string}
              </h2>
            </Link>
          </div>

          <div className="text-lg text-orange-400">
            {!raffleStatus && (getRemainingTime as number) < 1 ? (
              <div className="text-orange-300">Raffle Ended</div>
            ) : (
              <div className="text-orange-300"> </div>
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
          className="col-span-6 bg-blue-400 md:col-span-3">
          <h1 className="text-lg font-medium">Ticket Cost:</h1>
          <h2 className="font-bold text-sm mt-1">{amountCost} ETH</h2>
          <h2 className="font-bold text-sm mt-1">{realTokenUSDC} USDC</h2>
          <h2 className="font-bold text-sm mt-1">{realTokenUSDT} USDT</h2>
        </Block>
        <Block
          whileHover={{
            rotate: "-0.2deg",
            scale: 1.01,
          }}
          className="col-span-6 bg-green-600 md:col-span-3">
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
          className="col-span-12 bg-zinc-500 md:col-span-6">
          {raffleStatus && (getRemainingTime as number) > 1 ? (
            <div>
              <p className="mb-2">Raffle Ends in:</p>
              <CountdownMinutes minutes={getRemainingMinutes} />
            </div>
          ) : (
            ""
          )}
          {!raffleStatus && (getRemainingTime as number) < 1 ? (
            <div className="">
              <p className="mb-2">Next Raffle Starts in:</p>
              <ShiftingCountdown2 endDate={countdownDates[0]} text="days" />
            </div>
          ) : (
            <Fragment></Fragment>
          )}
          <div>
            {raffleStatus && (getRemainingTime as number) < 1 ? (
              "Last ticket(s)"
            ) : (
              <Fragment></Fragment>
            )}
          </div>
        </Block>
        {/* <Block
          whileHover={{
            rotate: "2.5deg",
            scale: 1.1,
          }}
          className="col-span-6 bg-blue-500 md:col-span-3"></Block> */}

        {/* Big area */}
        <Block className="col-span-12 flex flex-col justify-between md:col-span-12 text-center items-center">
          <div className="text-2xl m-3 font-extrabold border-blue-100">
            Buy Tickets
          </div>
          <div className="">
            {address ? (
              <Fragment>
                <div className="flex flex-row justify-center items-center self-center bg-center text-center">
                  <Button
                    onClick={decreaseEntryAmount}
                    variant={"outline"}
                    className="text-white bg-zinc-700 hover:bg-zinc-400">
                    -
                  </Button>
                  <span className="w-6/12 md:w-3/12 border-b-2 font-bold font-mono text-center rounded-sm items-center self-center">
                    ⌁ {ticketAmount} ⌁
                  </span>
                  <Button
                    onClick={increaseEntryAmount}
                    variant={"outline"}
                    className="text-white bg-zinc-700 hover:bg-zinc-400">
                    +
                  </Button>
                </div>

                <div className="flex flex-col gap-3 mt-4 md:flex-row  ">
                  <Button
                    variant={"outline"}
                    className=" mt-3 text-white bg-zinc-700 hover:bg-zinc-400"
                    onClick={() => {
                      buyTicketUSDC();
                      setTicketAmount(1);
                    }}>{`Buy Ticket(s) with USDC`}</Button>
                  <Button
                    variant={"outline"}
                    className=" mt-3 text-white bg-zinc-700 border-2 border-zinc-400 border-dashed hover:bg-zinc-400"
                    onClick={() => {
                      buyTicket();
                      setTicketAmount(1);
                    }}>{`Buy Ticket(s) with ETH`}</Button>
                  <Button
                    variant={"outline"}
                    className=" mt-3 text-white bg-zinc-700 hover:bg-zinc-400"
                    onClick={() => {
                      buyTicketUSDT();
                      setTicketAmount(1);
                    }}>{`Buy Ticket(s) with USDT`}</Button>
                </div>
              </Fragment>
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
          {/* <Progress
            size="sm"
            radius="sm"
            classNames={{
              base: "max-w-4xl",
              track: "drop-shadow-md border border-orange-400 rounded-xl",
              indicator: "bg-gradient-to-r from-orange-700 to-orange-500",
              label: "tracking-wider font-medium text-default-600",
              value: "text-orange-400",
            }}
            label="Progress"
            value={progressValue}
            showValueLabel={true}
          /> */}
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
                  <th className="w-1/5 text-sm">Ticket Entry</th>
                </tr>
              </thead>
              <tbody className="max-md:text-sm">
                {[...players].reverse().map((play, index) => (
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
              <thead className="">
                <tr className="hover:opacity-80 hover:font-bold">
                  <th className="w-6/12 text-sm">Winner Address</th>
                  <th className="w-3/12 text-sm">Prize</th>
                  <th className="w-3/12 text-sm">Prize Token</th>
                </tr>
              </thead>
              <tbody className="max-md:text-sm text-black">
                {[...winners].reverse().map((win, index) => (
                  <tr key={index} className="hover:opacity-80">
                    <td className="border px-6 text-center py-2">
                      {truncateAddress(win.winner)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {(Number(win.prizeAmount) / 1000000).toFixed(3)}
                    </td>

                    <td className="border px-4 py-2 text-center">
                      <Link
                        href={`https://basescan.org/token/${win.rewardToken}`}
                        target="_blank"
                        className="hover:text-orange-400">
                        {getAddress(win.rewardToken)}
                      </Link>
                    </td>
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
        className,
      )}
      {...rest}
    />
  );
};
