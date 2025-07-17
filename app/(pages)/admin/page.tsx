"use client";

import NotFoundPage from "@/app/not-found";
import Spinner from "@/components/Spinner";
import { Suspense, useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

async function getDatafromdb() {
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "ticket",
      query: "all",
    }),
  });
  const data = await response.json();
  return data.ticket;
}

async function getDatafromdbwinner() {
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "winner",
      query: "all",
    }),
  });
  const data = await response.json();
  return data.winner;
}

async function getUserData(wallet: string) {
  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      querytype: "user",
      query: wallet,
    }),
  });
  const data = await response.json();
  return data;
}

export default function AdminPage() {
  const { address } = useAccount();
  const account = useAccount();
  const [tickets, setTickets] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [walletSearch, setWalletSearch] = useState("");
  const [userResult, setUserResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTickets: 0,
    scrollTickets: 0,
    baseTickets: 0,
    totalWinners: 0,
    raffleTypes: {} as { [key: string]: number },
    networkDistribution: {} as { [key: string]: number },
    raffleDetails: {} as {
      [key: string]: {
        totalTickets: number;
        scrollTickets: number;
        baseTickets: number;
        totalPrize: string;
        scrollPrize: string;
        basePrize: string;
        transactionCount: number;
      };
    },
  });

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const handleWalletSearch = async () => {
    if (!walletSearch.trim()) return;

    setSearchLoading(true);
    try {
      const result = await getUserData(walletSearch.trim());
      setUserResult(result);
    } catch (error) {
      console.error("Error searching user:", error);
      setUserResult({ durum: false, error: "Search failed" });
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await getDatafromdb();
      const winnerData = await getDatafromdbwinner();

      const processedTicketData = ticketData.map((ticket: any) => ({
        ...ticket,
        raffletype: ticket.raffeltype, // Fix field name from raffeltype to raffletype
        network: ticket.network || "Scroll",
      }));

      const processedWinnerData = winnerData.map((winner: any) => ({
        ...winner,
        raffletype: winner.raffeltype, // Fix field name from raffeltype to raffletype
        network: winner.network || "Scroll",
      }));

      setTickets(processedTicketData);
      setWinners(processedWinnerData);

      // Calculate total tickets correctly
      const totalTicketsCount = processedTicketData.reduce(
        (sum: number, ticket: any) => {
          // Free raffles: each entry = 1 ticket
          const freeRaffleTypes = [
            "Free",
            "Free3",
            "FreeBase",
            "BaseFree",
            "BasePartnership2Free",
            "BasePartnershipFree",
            "Sales",
            "Partnership",
            "Partnership2",
          ];

          const isFreeRaffle = freeRaffleTypes.includes(ticket.raffletype);
          const ticketCount = isFreeRaffle
            ? 1
            : Number(ticket.ticketcount) || 1;

          return sum + ticketCount;
        },
        0,
      );

      const scrollTicketsCount = processedTicketData
        .filter((t: any) => t.network === "Scroll")
        .reduce((sum: number, ticket: any) => {
          const freeRaffleTypes = [
            "Free",
            "Free3",
            "FreeBase",
            "BaseFree",
            "BasePartnership2Free",
            "BasePartnershipFree",
            "Sales",
            "Partnership",
            "Partnership2",
          ];

          const isFreeRaffle = freeRaffleTypes.includes(ticket.raffletype);
          const ticketCount = isFreeRaffle
            ? 1
            : Number(ticket.ticketcount) || 1;
          return sum + ticketCount;
        }, 0);

      const baseTicketsCount = processedTicketData
        .filter((t: any) => t.network === "Base")
        .reduce((sum: number, ticket: any) => {
          const freeRaffleTypes = [
            "Free",
            "Free3",
            "FreeBase",
            "BaseFree",
            "BasePartnership2Free",
            "BasePartnershipFree",
            "Sales",
            "Partnership",
            "Partnership2",
          ];

          const isFreeRaffle = freeRaffleTypes.includes(ticket.raffletype);
          const ticketCount = isFreeRaffle
            ? 1
            : Number(ticket.ticketcount) || 1;
          return sum + ticketCount;
        }, 0);

      const stats = {
        totalTickets: totalTicketsCount,
        scrollTickets: scrollTicketsCount,
        baseTickets: baseTicketsCount,
        totalWinners: processedWinnerData.length,
        raffleTypes: {} as { [key: string]: number },
        networkDistribution: {} as { [key: string]: number },
        raffleDetails: {} as {
          [key: string]: {
            totalTickets: number;
            scrollTickets: number;
            baseTickets: number;
            totalPrize: string;
            scrollPrize: string;
            basePrize: string;
            transactionCount: number;
          };
        },
      };

      processedTicketData.forEach((ticket: any) => {
        const freeRaffleTypes = [
          "Free",
          "Free3",
          "FreeBase",
          "BaseFree",
          "BasePartnership2Free",
          "BasePartnershipFree",
          "Sales",
          "Partnership",
          "Partnership2",
        ];

        const isFreeRaffle = freeRaffleTypes.includes(ticket.raffletype);
        const ticketCount = isFreeRaffle ? 1 : Number(ticket.ticketcount) || 1;
        stats.networkDistribution[ticket.network] =
          (stats.networkDistribution[ticket.network] || 0) + ticketCount;
      });

      const raffleTypes = new Set([
        ...processedTicketData.map((t: any) => t.raffletype),
        ...processedWinnerData.map((w: any) => w.raffletype),
      ]);

      raffleTypes.forEach((type) => {
        const typeTickets = processedTicketData.filter(
          (t: any) => t.raffletype === type,
        );
        const typeWinners = processedWinnerData.filter(
          (w: any) => w.raffletype === type,
        );
        const freeRaffleTypes = [
          "Free",
          "Free3",
          "FreeBase",
          "BaseFree",
          "BasePartnership2Free",
          "BasePartnershipFree",
          "Sales",
          "Partnership",
          "Partnership2",
        ];

        const isFreeRaffle = freeRaffleTypes.includes(type);

        const totalTicketCount = isFreeRaffle
          ? typeTickets.length // Free raffles: each entry = 1 ticket
          : typeTickets.reduce(
              (sum: any, t: any) => sum + Number(t.ticketcount),
              0,
            ); // Paid raffles: use actual ticketcount

        let totalPrize = 0;
        let scrollPrize = 0;
        let basePrize = 0;

        typeWinners.forEach((winner: any) => {
          // Add null checks for winner.prizeamount and winner.raffletype
          if (!winner.prizeamount || !winner.raffletype) {
            return;
          }

          const prizeAmount = winner.raffletype.includes("TokenPaid")
            ? Number(winner.prizeamount) / 1000000
            : Number(formatEther(winner.prizeamount || "0"));

          totalPrize += prizeAmount;
          if (winner.network === "Scroll") {
            scrollPrize += prizeAmount;
          } else if (winner.network === "Base") {
            basePrize += prizeAmount;
          }
        });

        stats.raffleDetails[type as string] = {
          totalTickets: totalTicketCount,
          scrollTickets: isFreeRaffle
            ? typeTickets.filter((t: any) => t.network === "Scroll").length
            : typeTickets
                .filter((t: any) => t.network === "Scroll")
                .reduce((sum: any, t: any) => sum + Number(t.ticketcount), 0),
          baseTickets: isFreeRaffle
            ? typeTickets.filter((t: any) => t.network === "Base").length
            : typeTickets
                .filter((t: any) => t.network === "Base")
                .reduce((sum: any, t: any) => sum + Number(t.ticketcount), 0),
          totalPrize: totalPrize.toFixed(4),
          scrollPrize: scrollPrize.toFixed(4),
          basePrize: basePrize.toFixed(4),
          transactionCount: typeTickets.length,
        };

        stats.raffleTypes[type as string] = totalTicketCount;
      });

      setStats(stats);
    };

    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      {account.address !== "0x0C81eAb0896b32AAB44175872462cC4126AaB0F7" &&
      address !== "0xC635335D042e4a80560156FBb91329266022B9eD" ? (
        <NotFoundPage />
      ) : (
        <div className="min-h-screen p-8 text-center bg-neutral-100 dark:bg-neutral-900">
          <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">
            Admin Dashboard
          </h1>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              User Wallet Search
            </h2>
            <div className="flex gap-4 max-w-lg mx-auto">
              <input
                type="text"
                value={walletSearch}
                onChange={(e) => setWalletSearch(e.target.value)}
                placeholder="Enter wallet address or email..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-neutral-700 dark:text-white"
                onKeyPress={(e) => e.key === "Enter" && handleWalletSearch()}
              />
              <button
                onClick={handleWalletSearch}
                disabled={searchLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Search Results */}
            {userResult && (
              <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                {userResult.durum ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <strong className="dark:text-white">Wallet:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                        {userResult.user.wallet}
                      </p>
                    </div>
                    <div>
                      <strong className="dark:text-white">Email:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {userResult.user.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <strong className="dark:text-white">
                        Email Verified:
                      </strong>
                      <p
                        className={`text-sm font-medium ${
                          userResult.user.emailverified
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                        {userResult.user.emailverified
                          ? "✓ Verified"
                          : "✗ Not Verified"}
                      </p>
                    </div>
                    <div>
                      <strong className="dark:text-white">Premium:</strong>
                      <p
                        className={`text-sm font-medium ${
                          userResult.user.premium
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}>
                        {userResult.user.premium ? "✓ Premium" : "Standard"}
                      </p>
                    </div>
                    <div>
                      <strong className="dark:text-white">
                        Referral Code:
                      </strong>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                        {userResult.user.refcode || "Not generated"}
                      </p>
                    </div>
                    <div>
                      <strong className="dark:text-white">
                        Used Ref Code:
                      </strong>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-mono">
                        {userResult.user.usedrefcode || "None"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600 dark:text-red-400">
                    {userResult.error}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                Total Tickets
              </h2>
              <p className="text-3xl font-bold text-orange-500">
                {stats.totalTickets}
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                Scroll Network
              </h2>
              <p className="text-3xl font-bold text-orange-300">
                {stats.scrollTickets}
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                Base Network
              </h2>
              <p className="text-3xl font-bold text-blue-400">
                {stats.baseTickets}
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                Total Winners
              </h2>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalWinners}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Latest Tickets
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-700">
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Wallet</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Network</th>
                    <th className="px-4 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 10).map((ticket, index) => {
                    const isPaidRaffle = [
                      "Paid",
                      "PaidBase",
                      "TokenPaid",
                      "TokenPaidBase",
                      "Christmas",
                      "NewYear",
                    ].includes(ticket.raffeltype);
                    const ticketCount = isPaidRaffle
                      ? Number(ticket.ticketcount)
                      : 1;

                    return (
                      <tr
                        key={index}
                        className="border-b dark:border-neutral-700">
                        <td className="px-4 py-2">
                          {new Date(ticket.time).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          {truncateAddress(ticket.wallet)}
                        </td>
                        <td className="px-4 py-2">{ticket.raffeltype}</td>
                        <td className="px-4 py-2">{ticket.network}</td>
                        <td className="px-4 py-2">{ticketCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Latest Winners
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-700">
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Winner</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.slice(0, 10).map((winner, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-neutral-700">
                      <td className="px-4 py-2">
                        {new Date(winner.time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {truncateAddress(winner.wallet)}
                      </td>
                      <td className="px-4 py-2">{winner.raffeltype}</td>
                      <td className="px-4 py-2">
                        {winner.raffeltype === "TokenPaid" ||
                        winner.raffeltype === "TokenPaidBase"
                          ? `${(Number(winner.prizeamount) / 1000000).toFixed(
                              1,
                            )} ${winner.rewardToken}`
                          : `${formatEther(winner.prizeamount)} ETH`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
