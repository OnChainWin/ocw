import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigRight } from "lucide-react";

const ContractCard = ({ contract }: { contract: any }) => {
  const formattedDescription2 =
    contract.id === 1 ? (
      <div>
        To start, share your unique referral link with your friends, followers,
        or community. The referral link can be found on the{" "}
        <Link href="/profile" className="text-orange-500 border-b">
          profile.
        </Link>
      </div>
    ) : (
      contract.description2 &&
      contract.description2.split("\n").map((line: string, index: number) => (
        <p key={index} className="my-2">
          {line.trim()}
        </p>
      ))
    );

  return (
    <div className="from-neutral-950 relative rounded-lg border bg-gradient-to-r to-neutral-900 w-full">
      <div className="flex flex-row">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500 to-lime-600"></div>
        <div className="h-[1px] w-full bg-gradient-to-r from-lime-600 to-transparent"></div>
      </div>

      <div className="overflow-hidden px-4 lg:px-8 py-4 lg:py-8">
        <div className="z-10">
          <div className="p-3 bg-orange-500 text-white inline-block mr-3">
            {contract.id}
          </div>
          <div className="text-amber-300 mt-3 text-2xl font-semibold">
            {contract.name}
          </div>
        </div>

        <div className="text-orange-300">
          <p>{contract.explanation}</p>
        </div>

        <div className="mr-2 mt-5 text-white">
          <p>{contract.description}</p>
        </div>

        {formattedDescription2 && (
          <div className="mt-5 text-white">{formattedDescription2}</div>
        )}
        <Link
          href={contract.link}
          role="button"
          className="mt-2 items-center gap-1 hover:gap-3 rounded-br-3xl bg-gradient-to-r to-orange-500 from-orange-500 text-white px-3 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider no-underline transition-all duration-200 ease-out hover:text-white/80 hover:no-underline md:font-semibold inline-flex">
          <span>{contract.id === 2 ? "Be An Ambassador" : "Learn More"}</span>
          <ArrowBigRight />
        </Link>
      </div>
    </div>
  );
};

export default ContractCard;
