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

export default function AdminPage() {
  const { address } = useAccount();
  const account = useAccount();
  const [tickets, setTickets] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await getDatafromdb();
      const winnerData = await getDatafromdbwinner();

      const processedTicketData = ticketData.map((ticket: any) => ({
        ...ticket,
        network: ticket.network || "Scroll",
      }));

      const processedWinnerData = winnerData.map((winner: any) => ({
        ...winner,
        network: winner.network || "Scroll",
      }));

      setTickets(processedTicketData);
      setWinners(processedWinnerData);

      const stats = {
        totalTickets: processedTicketData.length,
        scrollTickets: processedTicketData.filter(
          (t: any) => t.network === "Scroll",
        ).length,
        baseTickets: processedTicketData.filter(
          (t: any) => t.network === "Base",
        ).length,
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
        stats.networkDistribution[ticket.network] =
          (stats.networkDistribution[ticket.network] || 0) + 1;
      });

      const raffleTypes = new Set([
        ...processedTicketData.map((t: any) => t.raffeltype),
        ...processedWinnerData.map((w: any) => w.raffeltype),
      ]);

      raffleTypes.forEach((type) => {
        const typeTickets = processedTicketData.filter(
          (t: any) => t.raffeltype === type,
        );
        const typeWinners = processedWinnerData.filter(
          (w: any) => w.raffeltype === type,
        );
        const isPaidRaffle = [
          "Paid",
          "PaidBase",
          "TokenPaid",
          "TokenPaidBase",
          "Christmas",
          "NewYear",
          "B2B",
        ].includes(type);

        const totalTicketCount = isPaidRaffle
          ? typeTickets.reduce(
              (sum: any, t: any) => sum + Number(t.ticketcount),
              0,
            )
          : typeTickets.length;

        let totalPrize = 0;
        let scrollPrize = 0;
        let basePrize = 0;

        typeWinners.forEach((winner: any) => {
          const prizeAmount = winner.raffeltype.includes("TokenPaid")
            ? Number(winner.prizeamount) / 1000000
            : Number(formatEther(winner.prizeamount));

          totalPrize += prizeAmount;
          if (winner.network === "Scroll") {
            scrollPrize += prizeAmount;
          } else if (winner.network === "Base") {
            basePrize += prizeAmount;
          }
        });

        stats.raffleDetails[type as string] = {
          totalTickets: totalTicketCount,
          scrollTickets: isPaidRaffle
            ? typeTickets
                .filter((t: any) => t.network === "Scroll")
                .reduce((sum: any, t: any) => sum + Number(t.ticketcount), 0)
            : typeTickets.filter((t: any) => t.network === "Scroll").length,
          baseTickets: isPaidRaffle
            ? typeTickets
                .filter((t: any) => t.network === "Base")
                .reduce((sum: any, t: any) => sum + Number(t.ticketcount), 0)
            : typeTickets.filter((t: any) => t.network === "Base").length,
          totalPrize: totalPrize.toFixed(4),
          scrollPrize: scrollPrize.toFixed(4),
          basePrize: basePrize.toFixed(4),
          transactionCount: typeTickets.length,
        };

        stats.raffleTypes[type as string] = totalTicketCount;
      });

      setStats(stats);
    };

    fetchData();
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
              Detailed Raffle Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-700">
                    <th className="px-4 py-2">Raffle Type</th>
                    <th className="px-4 py-2">Transaction Count</th>
                    <th className="px-4 py-2">Total Tickets</th>
                    <th className="px-4 py-2">Scroll Tickets</th>
                    <th className="px-4 py-2">Base Tickets</th>
                    <th className="px-4 py-2">Total Prize</th>
                    <th className="px-4 py-2">Scroll Prize</th>
                    <th className="px-4 py-2">Base Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.raffleDetails).map(
                    ([type, details]) => {
                      const isPaidRaffle = [
                        "Paid",
                        "PaidBase",
                        "TokenPaid",
                        "TokenPaidBase",
                        "Christmas",
                        "NewYear",
                      ].includes(type);
                      const prizeUnit = type.includes("TokenPaid")
                        ? "USD"
                        : "ETH";

                      return (
                        <tr
                          key={type}
                          className="border-b dark:border-neutral-700">
                          <td className="px-4 py-2 font-semibold">{type}</td>
                          <td className="px-4 py-2">
                            {details.transactionCount}
                          </td>
                          <td className="px-4 py-2">{details.totalTickets}</td>
                          <td className="px-4 py-2">{details.scrollTickets}</td>
                          <td className="px-4 py-2">{details.baseTickets}</td>
                          <td className="px-4 py-2">{`${details.totalPrize} ${prizeUnit}`}</td>
                          <td className="px-4 py-2">{`${details.scrollPrize} ${prizeUnit}`}</td>
                          <td className="px-4 py-2">{`${details.basePrize} ${prizeUnit}`}</td>
                        </tr>
                      );
                    },
                  )}
                  <tr className="bg-neutral-100 dark:bg-neutral-700 font-bold">
                    <td className="px-4 py-2">TOTAL</td>
                    <td className="px-4 py-2">
                      {Object.values(stats.raffleDetails).reduce(
                        (sum, detail) => sum + detail.transactionCount,
                        0,
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {Object.values(stats.raffleDetails).reduce(
                        (sum, detail) => sum + detail.totalTickets,
                        0,
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {Object.values(stats.raffleDetails).reduce(
                        (sum, detail) => sum + detail.scrollTickets,
                        0,
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {Object.values(stats.raffleDetails).reduce(
                        (sum, detail) => sum + detail.baseTickets,
                        0,
                      )}
                    </td>
                    <td className="px-4 py-2" colSpan={3}>
                      ETH:{" "}
                      {Object.entries(stats.raffleDetails)
                        .filter(([type]) => !type.includes("TokenPaid"))
                        .reduce(
                          (sum, [_, detail]) =>
                            sum + parseFloat(detail.totalPrize),
                          0,
                        )
                        .toFixed(4)}
                      <br />
                      USD:{" "}
                      {Object.entries(stats.raffleDetails)
                        .filter(([type]) => type.includes("TokenPaid"))
                        .reduce(
                          (sum, [_, detail]) =>
                            sum + parseFloat(detail.totalPrize),
                          0,
                        )
                        .toFixed(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Network Distribution
              </h2>
              <div className="space-y-2">
                {Object.entries(stats.networkDistribution).map(
                  ([network, count]) => (
                    <div
                      key={network}
                      className="flex justify-between items-center">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {network}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {count}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Raffle Types Distribution
              </h2>
              <div className="space-y-2">
                {Object.entries(stats.raffleTypes).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {type}
                    </span>
                    <span className="font-semibold text-blue-600">{count}</span>
                  </div>
                ))}
              </div>
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
