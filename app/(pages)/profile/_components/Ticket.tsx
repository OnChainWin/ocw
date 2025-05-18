"use client";
import Image from "next/image";

// Props arayüzü oluşturuyoruz
interface TicketWidgetProps {
  raffleType: string;
  ticketCount: number;
  time: string;
}

// Yukarıdaki manuel tarih formatlama fonksiyonunu kullanıyoruz
const getFormattedDate = (time: string) => {
  const [datePart] = time.split(" "); // Saat kısmını kaldır
  return datePart;
};

export default function TicketWidget({
  raffleType,
  ticketCount,
  time,
}: TicketWidgetProps) {
  const ticketText =
    raffleType === "Partnership" ||
    raffleType === "Partnership2" ||
    raffleType === "Free" ||
    raffleType === "Free3" ||
    raffleType === "FreeBase" ||
    raffleType === "Free3Base"
      ? "1 Ticket" //
      : `${ticketCount} Ticket`;

  const formattedDate = getFormattedDate(time); 

  return (
    <div className="relative flex h-36 sm:h-52 w-full text-center overflow-hidden rounded-3xl text-black cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out">
      <div className="relative w-16 items-center justify-evenly overflow-hidden bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="full absolute bottom-0 left-full flex h-16 w-36 sm:w-52 origin-bottom-left -rotate-90 items-center justify-center gap-3 bg-orange-100">
          <div className="sm:text-lg text-xs font-semibold tracking-widest text-orange-500">
            {raffleType}
          </div>
          <Image src="/logo.png" alt="logo" width={35} height={35} />
        </div>
      </div>
      <div className="relative h-full w-36 bg-gradient-to-b from-orange-100 to-teal-100 p-4 text-sm">
        <div className="absolute -left-2 -top-2 z-10 h-4 w-4 rounded-full bg-[#F9FAF2] dark:bg-[#2b2b2b]" />
        <div className="flex flex-col items-center justify-center h-full text-center text-2xl font-bold">
          <p>{ticketText}</p>
        </div>

        <div className="absolute top-3 right-2 text-xs">
          <div className="mt-1.5 inline-block rounded-2xl bg-yellow-400 px-8 py-2 font-bold text-[#2b2b2b]">
            {formattedDate}
          </div>
        </div>

        <div className="absolute -bottom-2 -left-2 z-10 h-4 w-4 rounded-full bg-[#F9FAF2] dark:bg-[#2b2b2b]" />
      </div>
    </div>
  );
}
