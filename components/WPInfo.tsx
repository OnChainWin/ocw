"use client";
import { useEffect, useState, Suspense } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Link from "next/link";
import { RiSearchEyeFill } from "react-icons/ri";

export async function getDatafromdb() {
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "ticket",
      query: "all",
      limit: 10,
    }),
  });
  const data = await response.json();
  return data.ticket;
}
export async function getDatafromdbwinner() {
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "winner",
      query: "all",
      limit: 10,
    }),
  });

  const data = await response.json();
  return data.winner;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="border px-4 py-2 text-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto"></div>
    </td>
    <td className="border px-4 py-2 text-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto"></div>
    </td>
    <td className="border px-4 py-2 text-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto"></div>
    </td>
    <td className="border px-4 py-2 text-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-8 mx-auto"></div>
    </td>
  </tr>
);

const SuspenseFallback = () => (
  <div className="flex flex-col w-full h-full justify-center items-center my-8">
    <div className="text-3xl mb-5 border-black dark:border-white border-b-2 font-bold">
      Not Only Trust But Verify
    </div>
    <div className="flex flex-col lg:flex-row gap-4 xl:gap-40">
      <div className="text-black rounded-3xl">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
              <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-start rounded-t-3xl -top-[38px] -z-10 py-[0.65rem] bg-orange-200 shadow-lg shadow-base-300">
                <p className="my-0 text-sm text-orange-700 font-bold text-center">
                  Players
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 relative flex max-w-[600px] h-auto w-full flex-col self-center bg-center bg-orange-400 rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-e-3xl">
          <LoadingSpinner />
        </div>
      </div>
      <div className="text-black rounded-3xl">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
              <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-end rounded-t-3xl -top-[38px] -z-10 py-[0.65rem] bg-gray-300">
                <p className="my-0 text-sm text-gray-800 font-bold text-center">
                  Winners
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 relative flex max-w-[600px] h-auto w-full flex-col self-center bg-center bg-white rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-l-3xl">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  </div>
);

export function WPInfo() {
  const { address } = useAccount();
  const [combinedPlayers, setCombinedPlayers] = useState<any[]>([]);
  const [combinedWinners, setCombinedWinners] = useState<any[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingWinners, setIsLoadingWinners] = useState(true);

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  function getAddress(addressContract: string, network: string) {
    // Base ağı için token adresleri
    if (network === "Base") {
      if (addressContract === "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913") {
        return "USDC";
      } else if (
        addressContract === "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2"
      ) {
        return "USDT";
      }
      return "ETH";
    }
    // Diğer tüm durumlar için Scroll token adresleri
    if (addressContract === "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4") {
      return "USDC";
    } else if (
      addressContract === "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df"
    ) {
      return "USDT";
    }
    return "ETH";
  }

  const fetchCombinedPlayers = async () => {
    try {
      setIsLoadingPlayers(true);
      let playersarray: {
        player: any;
        contractType: any;
        numberOfEntries: any;
        giveawayHash: any;
        date: any;
        network: any;
      }[] = [];
      const playersfromdb = await getDatafromdb();
      playersfromdb.forEach((x: any) => {
        playersarray.push({
          player: x.wallet,
          contractType: x.raffeltype,
          numberOfEntries: x.ticketcount,
          giveawayHash: x.giveawayhash,
          date: x.time,
          network: x.network,
        });
      });
      setCombinedPlayers(playersarray);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setIsLoadingPlayers(false);
    }
  };

  const fetchCombinedWinners = async () => {
    try {
      setIsLoadingWinners(true);
      let winnersarray: {
        winner: any;
        contractType: any;
        prizeAmount: any;
        rewardToken: any;
        date: any;
        network: any;
      }[] = [];
      const winnersfromdb = await getDatafromdbwinner();
      winnersfromdb.forEach((x: any) => {
        winnersarray.push({
          winner: x.wallet,
          contractType: x.raffeltype,
          prizeAmount: parseInt(x.prizeamount).toString(),
          rewardToken: x.rewardToken,
          date: x.time,
          network: x.network,
        });
      });
      setCombinedWinners(winnersarray);
    } catch (error) {
      console.error("Error fetching winners:", error);
    } finally {
      setIsLoadingWinners(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCombinedPlayers();
      await fetchCombinedWinners();
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center my-8">
      <div className="text-3xl mb-5 border-black dark:border-white border-b-2 font-bold">
        Not Only Trust But Verify
      </div>
      <div className="flex flex-col lg:flex-row gap-4 xl:gap-40">
        <div className=" text-black rounded-3xl">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="z-10">
              <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
                <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-start rounded-t-3xl -top-[38px] -z-10 py-[0.65rem] bg-orange-200 shadow-lg shadow-base-300">
                  <p className="my-0 text-sm text-orange-700 font-bold text-center">
                    Players
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 relative flex max-w-[600px] h-auto w-full flex-col self-center bg-center bg-orange-400 rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-e-3xl">
            <table className="table-fixed w-full text-white text-sm">
              <thead>
                <tr className="">
                  <th className="w-2/12 text-sm">Date</th>
                  <th className="w-2/12 text-sm">Chain</th>
                  <th className="w-4/12 text-sm">Player Address</th>
                  <th className="w-1/12 text-sm">Entry</th>
                </tr>
              </thead>
              <tbody className="max-md:text-sm">
                {isLoadingPlayers ? (
                  <>
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                  </>
                ) : (
                  combinedPlayers.map((player: any, index: any) => {
                    const date = new Date(Date.parse(player.date));
                    const isValidDate = !isNaN(date.getTime());

                    return (
                      <tr
                        key={index}
                        className="hover:opacity-80 sm:text-xs text-[8px]">
                        <td className="border px-4 py-2 text-center">
                          {isValidDate
                            ? new Intl.DateTimeFormat("tr-TR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(date)
                            : "Invalid Date"}
                        </td>
                        <td className="border px-4 text-center py-2">
                          {player.network == "Scroll" ? "Scroll" : "Base"}
                        </td>
                        <td className="border px-4 text-center py-2">
                          {truncateAddress(player.player)}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {player.contractType === "Paid" ||
                          player.contractType === "TokenPaid" ||
                          player.contractType === "Sales" ||
                          player.contractType === "Christmas" ||
                          player.contractType === "NewYear" ||
                          player.contractType === "B2B"
                            ? `${player.numberOfEntries}`
                            : "1"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className=" text-black rounded-3xl">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="z-10">
              <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary flex flex-col mt-10 relative">
                <div className="h-[2.4rem] w-[10.5rem] bg-base-300 absolute self-end rounded-t-3xl -top-[38px] -z-10 py-[0.65rem] bg-gray-300 ">
                  <p className="my-0 text-sm text-gray-800 font-bold text-center">
                    Winners
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 relative flex max-w-[600px] h-auto w-full flex-col self-center bg-center bg-white rounded-b-3xl hover:shadow-xl hover:shadow-orange-600/20 rounded-l-3xl">
            <table className="table-fixed w-full text-sm">
              <thead>
                <tr className="hover:opacity-80 hover:font-semibold">
                  <th className="w-3/12 text-sm">Date</th>
                  <th className="w-2/12 text-sm">Chain</th>
                  <th className="w-3/12 text-sm">Winner Address</th>
                  <th className="w-4/12 text-sm">Prize</th>
                </tr>
              </thead>
              <tbody className="max-md:text-xs">
                {isLoadingWinners ? (
                  <>
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                  </>
                ) : (
                  combinedWinners.map((winner, index) => {
                    const date = new Date(Date.parse(winner.date));
                    const isValidDate = !isNaN(date.getTime());

                    return (
                      <tr
                        key={index}
                        className="hover:opacity-80 sm:text-xs text-[8px]">
                        <td className="border px-4 py-2 text-center">
                          {isValidDate
                            ? new Intl.DateTimeFormat("tr-TR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(date)
                            : "Invalid Date"}
                        </td>
                        <td className="border px-2 text-center py-2">
                          {winner.network == "Base" ? "Base" : "Scroll"}
                        </td>
                        <td className="border px-4 text-center py-2">
                          {truncateAddress(winner.winner)}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {winner.contractType === "TokenPaid" ||
                          winner.contractType === "TokenPaidBase"
                            ? (Number(winner.prizeAmount) / 1000000).toFixed(1)
                            : winner.contractType === "Partnership" &&
                              winner.prizeAmount == 777
                            ? "Clipper Whitelist"
                            : winner.contractType === "Partnership" &&
                              winner.prizeAmount == 666
                            ? "Varonve NFT"
                            : winner.contractType === "Partnership" &&
                              winner.prizeAmount == 6660
                            ? "Vovo NFT"
                            : winner.contractType === "Partnership" &&
                              winner.prizeAmount == 6003
                            ? "Ducks NFT"
                            : winner.contractType === "Partnership2" &&
                              winner.prizeAmount == 1111
                            ? "Monsters NFT"
                            : winner.contractType == "Sales" &&
                              winner.prizeAmount == 1
                            ? "Clipper NFT"
                            : winner.contractType == "Sales"
                            ? "Test"
                            : winner.contractType == "BasePartnership2Free" &&
                              winner.rewardToken == "Yedek"
                            ? "BaseBridge (Reserve)"
                            : winner.contractType == "BasePartnershipFree" &&
                              winner.rewardToken == "Yedek"
                            ? "BaseBridge (Reserve)"
                            : winner.contractType == "BasePartnership2Free"
                            ? "BaseBridge"
                            : winner.contractType == "BasePartnershipFree"
                            ? "BaseBridge"
                            : winner.contractType == "FreeBase" &&
                              winner.rewardToken == "100USDC"
                            ? "100 USDC"
                            : winner.contractType == "B2B"
                            ? "1 GoMining NFT"
                            : parseFloat(
                                formatEther(winner.prizeAmount as any),
                              ).toFixed(6)}{" "}
                          {!(
                            winner.contractType === "Partnership" ||
                            winner.contractType === "Partnership2" ||
                            winner.contractType === "Sales" ||
                            winner.contractType === "BasePartnership2Free" ||
                            winner.contractType === "BasePartnershipFree" ||
                            winner.rewardToken === "100USDC" ||
                            winner.contractType === "B2B"
                          ) && getAddress(winner.rewardToken, winner.network)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Link
        href="/historicaldata"
        target="_blank"
        className="bg-gradient-to-r mt-7 to-orange-500 from-blue-300 p-[1px] rounded-full transition-all duration-300 hover:from-blue-500 hover:to-orange-600">
        <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] hover:bg-[#0a0a0a]/85 rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-2 hover:gap-4">
          <span>See All</span>
          <RiSearchEyeFill size={16} />
        </button>
      </Link>
    </div>
  );
}

// Suspense ile wrap edilmiş ana component
export default function WPInfoWithSuspense() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <WPInfo />
    </Suspense>
  );
}
