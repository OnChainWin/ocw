import React from "react";
import { FaTrophy } from "react-icons/fa";
import background from "@/public/world-map.png";

interface WinnerProps {
  raffleType: string;
  prizeAmount: string;
  time: string;
  numberOfWinners: number;
  rewardToken?: string; // rewardToken ekliyoruz
}

const getFormattedDate = (time: string) => {
  const [datePart] = time.split(" "); // Saat kısmını kaldır
  return datePart; // Sadece tarih kısmı
};

const getAddress = (addressContract: string) => {
  const lowercaseAddress = addressContract.toLowerCase();
  if (lowercaseAddress === "0x0000000000000000000000000000000000000000") {
    return "ETH";
  } else if (
    lowercaseAddress === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  ) {
    return "USDC";
  } else if (
    lowercaseAddress === "0xdac17f958d2ee523a2206206994597c13d831ec7"
  ) {
    return "USDT";
  } else {
    return "Other Token";
  }
};

const formatPrizeAmount = (
  raffleType: string,
  prizeAmount: string,
  rewardToken: string,
) => {
  const lowercaseToken = rewardToken.toLowerCase();

  // Eğer raffleType Partnership ise, özel ödül açıklamaları kullanıyoruz
  if (raffleType === "Partnership") {
    if (prizeAmount === "777") {
      return "Clipper Raffle";
    } else if (prizeAmount === "666") {
      return "Varonve Raffle";
    } else if (prizeAmount === "6003") {
      return "Ducks Raffle";
    } else {
      return "Partnership Prize";
    }
  }

  if (raffleType === "Partnership2") {
    if (prizeAmount === "1111") {
      return "Monsters Raffle";
    } else {
      return "Partnership Prize";
    }
  }

  // Eğer Partnership değilse, token türüne göre ödülü formatlıyoruz
  if (lowercaseToken === "notoken") {
    return `${Number(prizeAmount) / 1e18} ETH`; // Varsayılan olarak ETH kabul edelim
  } else if (lowercaseToken === "0x0000000000000000000000000000000000000000") {
    return `${(Number(prizeAmount) / 1e18).toFixed(5)} ETH`;
  } else if (lowercaseToken === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
    return `${(Number(prizeAmount) / 1e6).toFixed(2)} USDC`;
  } else if (lowercaseToken === "0xdac17f958d2ee523a2206206994597c13d831ec7") {
    return `${(Number(prizeAmount) / 1e6).toFixed(2)} USDT`;
  } else if (lowercaseToken === "0xf55bec9cafdbe8730f096aa55dad6d22d44099df") {
    return `${(Number(prizeAmount) / 1e6).toFixed(2)} USDT`;
  } else if (lowercaseToken === "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4") {
    return `${(Number(prizeAmount) / 1e6).toFixed(2)} USDC`;
  } else {
    return `${Number(prizeAmount)} Tokens`; // Diğer tokenlar için genel bir format
  }
};
const Winner: React.FC<WinnerProps> = ({
  raffleType,
  prizeAmount,
  time,
  rewardToken = "0x0000000000000000000000000000000000000000",
}) => {
  // Ödül açıklamasını dönüştürme

  const prizeDescription = formatPrizeAmount(
    raffleType,
    prizeAmount,
    rewardToken,
  );
  const formattedTime = getFormattedDate(time);

  return (
    <div
      className="flex size-52 flex-col items-center gap-1 overflow-hidden rounded-3xl bg-black shadow-xl shadow-black cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out hover:rotate-[2deg] hover:shadow-orange-600/20"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="h-5 w-full bg-striped" />
      <div className="mt-auto flex animate-blink-red items-center justify-center gap-3 rounded-2xl border-2 border-orange-500 px-4 py-2 font-bold bg-orange-100 ">
        <FaTrophy className="size-6 fill-orange-500 stroke-orange-600 border rounded-full p-0.5 border-orange-500" />
        <div className="text-orange-500 text-xs">{formattedTime}</div>{" "}
        {/* Formatlanmış zamanı burada gösteriyoruz */}
      </div>

      <div className="flex h-full flex-col gap-1 px-4 pb-4 border-t border-dashed mt-10">
        <div className="hover:text-orange-500 hover:underline hover:underline-offset-4 mt-1 px-4 text-2xl italic text-gray-200 font-extrabold">
          {raffleType}
        </div>
        <div className="w-full text-center text-lg font-bold text-white">
          {prizeDescription}
        </div>
      </div>
    </div>
  );
};

export default Winner;
