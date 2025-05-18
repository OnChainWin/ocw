"use client";
import {
  A_PAIDTIMER_CONTRACT_ABI,
  A_PAIDTIMER_CONTRACT_ADDRESS,
} from "@/constants/contract";
import { useEffect, useState } from "react";
import { formatEther, parseAbiItem, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@nextui-org/react";
import Loading from "./Loading";
import { publicClient } from "@/lib/client";

type Props = {};

const OCWLotteryArea = (props: Props) => {
  const { address } = useAccount();
  const [players, setPlayers] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const { toast } = useToast();

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const contractAddress = A_PAIDTIMER_CONTRACT_ADDRESS;
  const {
    data: deneme,
    isLoading: isLoadingBalance,
    error: errorBalance,
  } = useReadContract({
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "owner",
  });

  const OCWEvents = async () => {
    const latestBlock = await publicClient.getBlockNumber();

    const fromBlock = BigInt(latestBlock) - 9999n;
    const entryLogs = await publicClient.getLogs({
      address: A_PAIDTIMER_CONTRACT_ADDRESS,
      event: parseAbiItem(
        "event NewEntry(address indexed player, uint256 numberOfEntries)",
      ),
      fromBlock,
      toBlock: "latest",
    });
    // console.log(latestBlock);
    // console.log(entryLogs);
    setPlayers(() => {
      const newPlayers = entryLogs.map((log) => ({
        player: log.args.player?.toString(),
        numberOfEntries: log.args.numberOfEntries?.toString(),
      }));
      const updatedPlayers = [...newPlayers].slice(-10);
      return updatedPlayers;
    });
  };

  const OCWWEvents = async () => {
    const latestBlock = await publicClient.getBlockNumber();

    const fromBlock = BigInt(latestBlock) - 9999n;
    const winnerLogs = await publicClient.getLogs({
      address: A_PAIDTIMER_CONTRACT_ADDRESS,
      event: parseAbiItem(
        "event RaffleEnded(address winner, uint256 prizeAmount)",
      ),
      fromBlock,
      toBlock: "latest",
    });

    const newWinners = winnerLogs.map((logz) => ({
      winner: logz.args.winner?.toString(),
      prizeAmount: logz.args.prizeAmount?.toString(),
    }));
    // console.log(winnerLogs);
    setWinners(() => {
      const updatedWinners = [...newWinners].slice(-10);
      return updatedWinners;
    });
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
      onError: (error) => {
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
      abi: A_PAIDTIMER_CONTRACT_ABI,
      address: A_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "buyEntry",
      args: [BigInt(ticketAmount)],
      value: parseEther(amountCostOnSubmit.toString()),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hashy,
    });

  const [ticketAmount, setTicketAmount] = useState<any>(1);

  const { data: entryFee } = useReadContract({
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "entryFee",
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
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "targetPrizeAmount",
  });

  const {
    data: getTotalEntries,
    isLoading: isGetTotalEntries,
    error: errorGetTotalEntries,
    refetch,
  } = useReadContract({
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getTotalEntries",
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
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeMinutes",
  });

  const {
    data: getRemainingTimeSeconds,
    isLoading: isGetRemainingTimeSeconds,
    error: errorGetRemainingTimeSeconds,
    refetch: refetchSec,
  } = useReadContract({
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getRemainingTimeSeconds",
  });

  const {
    data: raffleStatus,
    isLoading: isRaffleStatus,
    error: errorRaffleStatus,
    refetch: refetchStatus,
  } = useReadContract({
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "raffleStatus",
  });

  const prize = targetPrizeAmount ? formatEther(targetPrizeAmount as any) : "0";
  const soldTickets = getTotalEntries ? getTotalEntries : "0";
  const getRemainingTime = getRemainingTimeMinutes
    ? (getRemainingTimeMinutes as number)
    : "0";

  const isActive = raffleStatus ? "Active" : "Not Active";

  // const calculateResult = () => {
  //   const cost = amountCost; // parseFloat ile çevrildiği için bu zaten bir number türünde.
  //   const prizeValue = parseFloat(prize); // prize'ı number'a çeviriyoruz.
  //   const ticketsSold = parseFloat(soldTickets); // soldTickets'ı number'a çeviriyoruz, eğer bu zaten bir string ise.

  //   // Şimdi tüm değerler number türünde olduğu için BigInt ile ilgili bir hata almayacağız.
  //   return cost !== 0 ? prizeValue / cost - ticketsSold : -ticketsSold;
  // };

  // const deneme = useWatchContractEvent({
  //   abi: A_PAIDTIMER_CONTRACT_ABI,
  //   address: A_PAIDTIMER_CONTRACT_ADDRESS,
  //   batch: true,
  //   eventName: "NewEntry",
  //   onLogs(logs) {
  //     console.log("New logs!", logs);
  //   },
  // });

  return (
    <div className=" justify-center items-center text-center">
      <div className="text-2xl mt-4">LotteryArea</div>
      {/* <div>
        Hesaplama:
        {calculateResult()}
      </div> */}
      <div className="text-indigo-500 font-mono">
        <div className="text-xl">Prize: {prize}</div>
        <div className="mb-5">Ticket Cost: {amountCost}</div>
        <div className="justify-center text-center items-center flex mb-5">
          <Progress
            size="sm"
            radius="sm"
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default rounded-xl",
              indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
              label: "tracking-wider font-medium text-default-600",
              value: "text-foreground/60",
            }}
            label="Progress"
            value={35}
            showValueLabel={true}
          />
        </div>
        <div>Total Process: </div>
        <div className="mb-5">
          Sold Tickets: {soldTickets?.toString()}
        </div>{" "}
        {getRemainingTime == "0" ? (
          <div className=""></div>
        ) : (
          <div>Remaining Time(min): {getRemainingTime?.toString()}</div>
        )}
        <div>
          {raffleStatus && (getRemainingTime as number) < 1
            ? "Last ticket(s)"
            : ""}
        </div>
        <div className="font-bold">
          Status:{" "}
          <span className={raffleStatus ? "text-lime-500" : "text-red-500"}>
            {isActive}
          </span>
        </div>
      </div>
      <div className="text-2xl mt-5 font-extrabold border-t-2 border-blue-100">
        Buy Tickets
      </div>
      <div>
        {address ? (
          <>
            <div className="flex justify-center m-3">
              <Button onClick={decreaseEntryAmount} variant={"outline"}>
                -
              </Button>
              <span className="w-1/12 border-b-2 font-bold font-mono text-center rounded-sm items-center self-center">
                ⌁ {ticketAmount} ⌁
              </span>
              <Button onClick={increaseEntryAmount} variant={"outline"}>
                +
              </Button>
            </div>
            <Button
              variant={"outline"}
              onClick={() => {
                buyTicket();
                setTicketAmount(1);
              }}>{`Buy Ticket(s)`}</Button>
          </>
        ) : (
          <p className="mt-2">Please connect your wallet to buy ticket!</p>
        )}
      </div>

      {/* Player & Winner */}
      <div className="mt-5 font-mono">
        Paid OCW WinnerInfo Area
        <div className="mt-4 flex flex-col">
          <h2>Players</h2>
          <ul className="relative flex max-w-[500px] h-[240px] w-full flex-col self-center bg-center bg-lime-400 rounded-3xl border hover:border-lime-400 hover:shadow-xl hover:shadow-lime-600/20 dark:hover:border-lime-300/80">
            {[...players].reverse().map((play) => (
              <li
                className="hover:text-lime-600 w-full text-center items-center self-center bg-center justify-center flex font-mono italic "
                key={crypto.randomUUID()}>
                Player: {truncateAddress(play.player)}, Ticket:
                {play.numberOfEntries}
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-3xl font-bold">Winners</h3>
          <div className="flex flex-col justify-center items-center p-3">
            <div className="relative flex max-w-[500px] h-[540px] w-full flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
              <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pt-2 shadow-2xl shadow-gray-100 dark:!bg-navy-700 dark:shadow-none">
                <h4 className="text-lg font-bold text-navy-700 dark:text-gray-950">
                  Last Winner(s)
                </h4>
                {/* <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-dark-950/5 dark:text-gray-950 dark:hover:bg-dark-950/10 dark:active:bg-gray-900/20">
                See all
              </button> */}
              </div>
              <div className="w-full overflow-x-scroll px-4 md:overflow-x-hidden">
                <table role="table" className="w-full overflow-x-scroll">
                  <thead className="text-center items-center justify-center">
                    <tr>
                      <th role="columnheader" title="Toggle SortBy">
                        <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs ">
                          Wallet
                        </div>
                      </th>
                      <th
                        role="columnheader"
                        className="justify-end text-right flex"
                        title="Toggle SortBy">
                        <div className="flex pb-2 pt-4 !text-right uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                          Reward
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup" className=" text-gray-800">
                    {[...winners].reverse().map((win, index) => (
                      <tr
                        role="row"
                        key={index}
                        className="hover:text-lime-500 ">
                        <td className="py-3 text-sm text-left" role="cell">
                          {truncateAddress(win.winner)}
                        </td>
                        <td className="py-3 text-sm text-right" role="cell">
                          {parseFloat(formatEther(win.prizeAmount)).toFixed(4)}{" "}
                          ETH
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCWLotteryArea;
