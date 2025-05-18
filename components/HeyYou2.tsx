import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { A_PAIDTIMER_CONTRACT_ADDRESS } from "@/constants/contract";

type Props = {};

const HeyYou2 = (props: Props) => {
  return (
    <div>
      <div>
        <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20 dark:bg-[#fdffec] bg-[#2b2b2b] text-black ">
          <h2 className="  ">
            <span className="sm:text-4xl font-extrabold  text-2xl text-[#FEBD57] dark:text-gray-900">
              How does it work?
            </span>
            <span className="block text-lg sm:text-xl mt-5 sm:mx-40 mx-1 dark:text-gray-950 text-white">
              Our special smart contract collects funds and automatically
              distributes prizes to a lucky winner without allowing any admin
              touch or manipulation.
            </span>
          </h2>
          <div className="justify-between mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="w-full text-center">
              <CardHeader>Raffle 1</CardHeader>
              <CardDescription>Ticket Type: Paid Entry - ETH</CardDescription>
              <CardContent>Prize: ETH</CardContent>
              <CardFooter className="text-sm flex items-center justify-center">
                Trigger: Final ticket purchase during the countdown, or the
                first ticket purchase after the countdown is completed.
              </CardFooter>
            </Card>

            <Card className="w-full text-center">
              <CardHeader>Raffle 2</CardHeader>
              <CardDescription>Ticket Type: Free Entry</CardDescription>
              <CardContent>Prize: ETH</CardContent>
              <CardFooter className="text-sm flex items-center justify-center">
                Trigger: First ticket purchase after the countdown is completed.
              </CardFooter>
            </Card>

            <Card className="w-full text-center">
              <CardHeader>Raffle 3</CardHeader>
              <CardDescription>Ticket Type: Free Entry</CardDescription>
              <CardContent>Prize: ETH</CardContent>
              <CardFooter className="text-sm flex items-center justify-center">
                Trigger: First ticket purchase after the countdown is completed.
              </CardFooter>
            </Card>

            <Card className="w-full text-center">
              <CardHeader>Raffle 4</CardHeader>
              <CardDescription>
                Ticket Type: Paid Entry - ETH, USDC, USDT
              </CardDescription>
              <CardContent>Prize: Different Tokens</CardContent>
              <CardFooter className="text-sm flex items-center justify-center">
                Trigger: Final ticket purchase during the countdown, or the
                first ticket purchase after the countdown is completed.
              </CardFooter>
            </Card>
          </div>
          <div className="lg:mt-0 mx-12 justify-center flex">
            <Link href={"/raffleguide"} target="_blank">
              <div className="mt-12 space-x-16 flex flex-row border p-2 rounded-full bg-indigo-400 shadow-xl shadow-indigo-600/30">
                <Button
                  variant={"outline"}
                  className="!focus:ring-sky-500 !focus:ring-offset-sky-200 transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-3xl text-white font-bold bg-indigo-300 hover:bg-indigo-400 focus:ring-sky-500 focus:ring-offset-sky-200 shadow-xl px-8 py-6 ">
                  <h2>Raffle Guide</h2>
                </Button>
              </div>
            </Link>
            {/* <div className="mt-12">
                <Link href={"/freeocw"}>
                  <Button
                    variant={"ghost"}
                    className="py-4 px-6  hover:bg-indigo-300 focus:ring-sky-500 focus:ring-offset-sky-200 transition ease-in duration-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2  dark:text-gray-950 text-gray-100 ">
                    Try Free
                  </Button>
                </Link>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeyYou2;
