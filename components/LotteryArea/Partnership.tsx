"use client";
import {
  FREE3_CONTRACT_ADDRESS,
  FREE3_CONTRACT_ABI,
} from "@/constants/contract";
import { Fragment, useEffect, useState } from "react";
import { formatEther, parseAbiItem, parseEther, parseGwei } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { publicClient } from "@/lib/client";

import { MotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FcDisplay } from "react-icons/fc";
import { countdownDates } from "./(scroll)/Grids";
import CountdownMinutes from "./Countdown";
import ShiftingCountdown2 from "../Countdown2";
import ProgOCW from "./Progress";
import Image from "next/image";

export const PartnershipPageArea = () => {
  const { address } = useAccount();
  const [players, setPlayers] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const { toast } = useToast();

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const [ticketAmount, setTicketAmount] = useState<any>(1);

  const FOCWEvents = async () => {
    const latestBlock = await publicClient.getBlockNumber();

    const fromBlock = BigInt(latestBlock) - 9999n;
    const entryFLogs = await publicClient.getLogs({
      address: FREE3_CONTRACT_ADDRESS,
      event: parseAbiItem(
        "event NewEntry(address indexed player, uint256 numberOfEntries)",
      ),
      fromBlock,
      toBlock: "latest",
    });
    // console.log(entryFLogs);
    setPlayers(() => {
      const newFPlayers = entryFLogs.map((logF) => ({
        player: logF.args.player?.toString(),
        numberOfEntries: logF.args.numberOfEntries?.toString(),
      }));
      const updatedFPlayers = [...newFPlayers].slice(-10);
      return updatedFPlayers;
    });
  };

  const FOCWWEvents = async () => {
    const latestBlock = await publicClient.getBlockNumber();

    const fromBlock = BigInt(latestBlock) - 9999n;
    const winnerFLogs = await publicClient.getLogs({
      address: FREE3_CONTRACT_ADDRESS,
      event: parseAbiItem(
        "event WinnerSelected(address winner, uint256 prizeAmount)",
      ),
      fromBlock,
      toBlock: "latest",
    });

    const newFWinners = winnerFLogs.map((logzF) => ({
      winner: logzF.args.winner?.toString(),
      prizeAmount: logzF.args.prizeAmount?.toString(),
    }));
    // console.log(winnerFLogs);
    setWinners(() => {
      const updatedFWinners = [...newFWinners].slice(-10);
      return updatedFWinners;
    });
  };

  const {
    data: hash,
    isPending,
    writeContract,
    error,
    status,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Your transaction has been submitted",
          duration: 3000,
        });
      },
      onError: (error) => {
        const partToShow = error.message
          .split(/Contract Call:|Request Arguments:/)[0]
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
      abi: FREE3_CONTRACT_ABI,
      address: FREE3_CONTRACT_ADDRESS,
      account: address,
      functionName: "getFreeTicket",
      gas: BigInt(757000),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const {
    data: prizeAmount,
    isLoading: isPrizeAmount,
    error: errorPrizeAmount,
  } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "prizeAmount",
  });

  const {
    data: ticketsSoldThisRound,
    isLoading: isTicketsSoldThisRound,
    error: errorTicketsSoldThisRound,
    refetch,
  } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "ticketsSoldThisRound",
  });

  const {
    data: getRemainingTimeSec,
    isLoading: isGetRemainingTimeSec,
    error: errorGetRemainingTimeSec,
    refetch: refetchSec,
  } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeSec",
  });

  const {
    data: raffleStatus,
    isLoading: isRaffleStatus,
    error: errorRaffleStatus,
    refetch: refetchStatus,
  } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "raffleStatus",
  });

  useEffect(() => {
    const getAllEvents = async () => {
      await FOCWEvents();
      await FOCWWEvents();
    };

    if (isConfirmed) {
      toast({
        title: "You have successfully bought a ticket!",
        duration: 3000,
      });
      refetch();
      refetchMin();
      refetchStatus();
      refetchTicket();
      getAllEvents();
    }
  }, [isConfirmed, isConfirming]);

  const prize = prizeAmount ? formatEther(prizeAmount as any) : "0";
  const ticketsSold = ticketsSoldThisRound ? ticketsSoldThisRound : "0";

  const isActive = raffleStatus ? "Active" : "Not Active";

  useEffect(() => {
    const getAllEvents = async () => {
      await FOCWEvents();
      await FOCWWEvents();
    };
    getAllEvents();
  }, [address]);

  const {
    data: getRemainingTimeMinutes,
    isLoading: isGetRemainingTimeMinutes,
    error: errorGetRemainingTimeMinutes,
    refetch: refetchMin,
  } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeMin",
  });

  const { data: getRaffleStartDuration, refetch: refetchStart } =
    useReadContract({
      abi: FREE3_CONTRACT_ABI,
      address: FREE3_CONTRACT_ADDRESS,
      functionName: "getRaffleStartDuration",
    });

  const { data: hasEntered, refetch: refetchTicket } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "hasEntered",
    args: [address],
  });

  const getRemainingMinutes =
    typeof getRemainingTimeMinutes === "number"
      ? getRemainingTimeMinutes
      : Number(getRemainingTimeMinutes);

  const raffleDuration =
    typeof getRaffleStartDuration === "number"
      ? getRaffleStartDuration
      : Number(getRaffleStartDuration);

  const getRemainingTime = getRemainingTimeMinutes
    ? (getRemainingTimeMinutes as number)
    : "0";

  const soldTicketsNumber: number =
    typeof ticketsSold === "bigint"
      ? Number(ticketsSold)
      : (ticketsSold as number);

  const perTicket = hasEntered ? 1 : 0;

  const perTicketNumber: number = parseFloat(perTicket.toString());
  const calculateChange: number = (perTicketNumber / soldTicketsNumber) * 100;

  const progressValue = raffleStatus
    ? Math.floor(
        ((raffleDuration - getRemainingMinutes) / raffleDuration) * 100 - 1,
      )
    : ((raffleDuration - getRemainingMinutes) / raffleDuration) * 100;

  return (
    <div className="min-h-screen px-4 py-12 text-zinc-50">
      <div className="flex flex-col items-center gap-2 my-4 text-center justify-center">
        <FcDisplay className="w-10 h-10" />
        <h1 className="text-black dark:text-white text-2xl font-bold font-sans">
          OCW x Varonve Partnership Raffle
        </h1>
        <Image
          src={"/varonve.jpeg"}
          alt="Varonve Logo"
          width={200}
          height={200}
        />
      </div>
      <div className="flex flex-row gap-2 sm:gap-10 items-center justify-center mb-5">
        <Image
          src={"/varonve1.webp"}
          alt="Varonve"
          width={200}
          height={200}
          className="rounded-md shadow-green-700 shadow-xl size-20 md:size-52"
        />
        <Image
          src={"/varonve2.webp"}
          alt="Varonve"
          width={200}
          height={200}
          className="rounded-md shadow-[#213330] shadow-xl size-20 md:size-52"
        />
        <Image
          src={"/varonve3.webp"}
          alt="Varonve"
          width={200}
          height={200}
          className="rounded-md shadow-yellow-800 shadow-xl size-20 md:size-52"
        />
      </div>
      <div className="flex flex-row gap-1 sm:gap-6 items-center justify-center mb-5">
        <Image
          src={"/vovo1.webp"}
          alt="Varonve"
          width={100}
          height={100}
          className="rounded-md shadow-violet-700 shadow-xl size-12 md:size-40"
        />
        <Image
          src={"/vovo2.webp"}
          alt="Varonve"
          width={100}
          height={100}
          className="rounded-md shadow-yellow-800 shadow-xl size-12 md:size-40"
        />
        <Image
          src={"/vovo3.webp"}
          alt="Varonve"
          width={100}
          height={100}
          className="rounded-md shadow-purple-700 shadow-xl size-12 md:size-40"
        />
        <Image
          src={"/vovo4.webp"}
          alt="Varonve"
          width={100}
          height={100}
          className="rounded-md shadow-pink-700 shadow-xl size-12 md:size-40"
        />
        <Image
          src={"/vovo5.webp"}
          alt="Varonve"
          width={100}
          height={100}
          className="rounded-md shadow-purple-700 shadow-xl size-12 md:size-40"
        />
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4">
        <Block className="col-span-12 row-span-2 md:col-span-6 justify-between flex flex-col">
          <div className="font-bold">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Total Prize
            </p>
            <p className="my-4 text-xl sm:text-3xl tracking-wider from-orange-400 to-orange-600 bg-gradient-to-bl bg-clip-text text-transparent md:text-4xl lg:text-7xl">
              {/* {prize} ETH */}5 Vovo & 3 Varonve NFT
            </p>
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
          className="col-span-6 bg-[#f1c88f] md:col-span-3">
          <h1 className="text-lg font-medium">Ticket Cost:</h1>
          <h2 className="font-bold text-sm mt-1">FREE</h2>
        </Block>
        <Block
          whileHover={{
            rotate: "-0.2deg",
            scale: 1.01,
          }}
          className="col-span-6 bg-green-600 md:col-span-3">
          <div className="text-lg font-medium">
            Sold Tickets: {ticketsSold?.toString()}
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
              <ShiftingCountdown2 endDate={countdownDates[1]} text="days" />
            </div>
          ) : (
            <Fragment></Fragment>
          )}
          <div>
            {raffleStatus && (getRemainingTime as number) < 2 ? (
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
                <div className="w-[400px] flex flex-row justify-center">
                  <span className="w-4/12 flex flex-col border-b-2 font-bold font-mono text-center rounded-sm items-center self-center">
                    ⌇ {ticketAmount} ⌇
                  </span>
                </div>
                <Button
                  variant={"outline"}
                  className="md:w-[400px] max-md:w-[240px] mt-3 text-white bg-zinc-700 hover:bg-zinc-400"
                  disabled={isPending || !address}
                  onClick={() => {
                    buyTicket();
                    setTicketAmount(1);
                  }}>{`Buy Ticket(s)`}</Button>
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
            {hasEntered ? "1" : "0"}
          </span>
          <span className="">
            {isNaN(calculateChange) ? "" : "Chance to win"}
          </span>
          <span className="font-bold text-lg">
            {isNaN(calculateChange) ? "" : calculateChange.toFixed(2) + "%"}
          </span>
        </Block>

        {/* Buy Ticket area */}
        <Block className="col-span-7 md:col-span-7 text-3xl flex flex-col items-center text-center leading-snug">
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
                    <td className="border px-4 py-2 text-center">1</td>
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
                  <th className="w-2/6 text-sm">Prize</th>
                </tr>
              </thead>
              <tbody className="max-md:text-sm text-black">
                {[...winners].reverse().map((win, index) => (
                  <tr key={index} className="hover:opacity-80">
                    <td className="border px-4 text-center py-2">
                      {truncateAddress(win.winner)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {parseFloat(formatEther(win.prizeAmount as any)).toFixed(
                        3,
                      )}{" "}
                      ETH
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

export default PartnershipPageArea;
