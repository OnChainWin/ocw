"use client";

import Spinner from "@/components/Spinner";
import { ArrowUp, LockIcon, PiIcon, ServerIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

export default function RaffleGuide() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="container absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] opacity-20 top-0 h-[1000px] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true">
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse">
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>

            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-orange-600">
                  Raffle Guide
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
                  To understand everything
                </h1>
                <p className="mt-6 text-sm leading-8 dark:text-gray-200 text-gray-700">
                  PS: Please be aware that, as all web3 transactions, OCW
                  transactions will also require gas fees. These fees are not
                  related to OnChain Win organization or services, it’s coming
                  with directly from the blockchain network. Be sure you have
                  enough ETH in you wallet to cover these gas fees to complete
                  your transactions. Click here to read more about gas fees.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <Image
              className="w-[30rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 md:w-[45rem] sm:w-[40rem] max-md:w-[23rem]"
              src="/raffle.png"
              width={1800}
              height={1800}
              alt=""
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4 ">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg dark:text-gray-200">
                <p className="text-md font-bold">Raffle 1</p>
                <li className="flex flex-col mt-2 space-y-1 dark:text-gray-200 text-gray-600">
                  <span>Ticket Type: Paid Entry</span>
                  <span>Prize: ETH</span>
                  <p>
                    Trigger: Final ticket purchase during the countdown, or the
                    first ticket purchase after the countdown is completed.
                  </p>
                </li>

                <p className="mt-2 ">
                  Raffle 1 is designed to collect ETH funds from the community
                  and specify 1 lucky winner from the participants for the full
                  prize. Multiple ticket purchase is available to increase the
                  win chance.
                </p>
                <p className="mt-2">
                  PS: Specified prize is the maximum amount for raffle 1, and
                  this maximum prize will be available only if all tickets will
                  be sold out. Otherwise, after the countdown first ticket
                  purchase will trigger the draw and winner will collect all
                  pool prize coming from sold tickets. 5% service fee will be
                  added to the ticket price.
                </p>
                {/* 2 */}
                <p className="text-md font-bold mt-2 border-t-4">Raffle 2</p>
                <li className="flex flex-col mt-2 space-y-1 dark:text-gray-200 text-gray-600">
                  <span>Ticket Type: Free Entry</span>
                  <span>Prize: ETH</span>
                  <p>Trigger: First ticket purchase after the countdown.</p>
                </li>

                <p className="mt-2">
                  Raffle 2 is designed to make giveaway for the OnChain Win
                  community. Specified prize will be available for 1 lucky
                  winner, and multiple ticket purchase is not available.
                  Unlimited users can participate when the raffle is active.
                </p>
                <p className="mt-2">
                  PS: Be aware that, there will be no charge for the ticket, but
                  gas fees will be required and you need to have a certain
                  amount of ETH in your wallet to cover this gas fee to complete
                  your free ticket purchase.
                </p>
                {/* 3 */}
                <p className="text-md font-bold mt-2 border-t-4">Raffle 3</p>
                <li className="flex flex-col mt-2 space-y-1 dark:text-gray-200 text-gray-600">
                  <span>Ticket Type: Free Entry</span>
                  <span>Prize: ETH</span>
                  <p>Trigger: First ticket purchase after the countdown.</p>
                </li>

                <p className="mt-2">
                  Raffle 3 is designed to create additional value to OnChain Win
                  community. Specified prize will be available for multiple
                  lucky winners. Multiple ticket purchase is not available.
                  Unlimited users can participate when the raffle is active.
                </p>
                <p className="mt-2">
                  PS: Be aware that how many winners will be chosen, and the
                  prize ratios can be different by the each draw.
                </p>
                {/* 4 */}
                <p className="text-md font-bold mt-2 border-t-4">Raffle 4</p>
                <li className="flex flex-col mt-2 space-y-1 dark:text-gray-200 text-gray-600">
                  <span>Ticket Type: Paid Entry - ETH, USDC, USDT</span>
                  <span>Prize: Different Tokens</span>
                  <p>
                    Trigger: Final ticket purchase during the countdown, or the
                    first ticket purchase after the countdown is completed.
                  </p>
                </li>

                <p className="mt-2">
                  Raffle 4 is designed to create flexibility for the OnChain Win
                  community. Participants can purchase the tickets with ETH,
                  USDC and USDT. The prize will be available 1 lucky winner.
                  Multiple ticket purchase is available to increase the win
                  chance.
                </p>
                <p className="mt-2">
                  PS: Specified prize is the maximum amount for raffle 4, and
                  this maximum prize will be available only if all tickets will
                  be sold out. Otherwise, after the countdown first ticket
                  purchase will trigger the draw and winner will collect all
                  pool prize coming from sold tickets. 5% service fee will be
                  added to the ticket price.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
