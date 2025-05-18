"use client";
import { FaEthereum } from "react-icons/fa";
import { CardStack } from "./ui/card-stack";
import { cn } from "@/utils/cn";
export function CardStackDemo() {
  return (
    <div className="flex h-80 items-center justify-center w-full text-center">
      <CardStack items={CARDS} />
    </div>
  );
}
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-orange-100 text-orange-700 dark:bg-orange-700/[0.2] dark:text-orange-500 px-2 py-1",
        className,
      )}>
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    content: (
      <div className="justify-center flex flex-row flex-grow-0">
        <p>
          Remove the trust from the equation and replace it with{" "}
          <Highlight>transparency. </Highlight>The first fully decentralized
          lottery.
        </p>
        <FaEthereum className="items-center flex text-center justify-center w-10 h-10" />
      </div>
    ),
  },
  {
    id: 1,
    content: (
      <div className="justify-center flex flex-row flex-shrink">
        <p>
          <Highlight>OnChainWin</Highlight>smart contracts collect the funds
          from the community, hold it<Highlight>securely</Highlight>, specify
          the winners and distribute the prizes automatically.
        </p>
        <FaEthereum className="items-center flex text-center justify-center w-10 h-10" />
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="justify-center flex flex-row flex-grow-0">
        <p>
          The first fully <Highlight>automated</Highlight> and{" "}
          <Highlight>decentralized</Highlight> lottery without any human touch
          or manipulation.
        </p>
        <FaEthereum className="items-center flex text-center justify-center w-10 h-10" />
      </div>
    ),
  },
];
