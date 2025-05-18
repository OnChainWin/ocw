"use client"
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const countdownDates = [
  "13/12/2024 12:00:00",
  "14/12/2024 11:00:00",
  "15/12/2024 10:00:00",
  "16/22/2024 9:00:00",
  "17/12/2024 9:00:00"
];

const ShiftingCountdown2 = ({
  endDate,
  text,
}: {
  endDate: string;
  text: string;
}) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = () => {
    const end = new Date(endDate);

    const now = new Date();

    const distance = +end - +now;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    setRemaining({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  return (
    <div className="">
      <div className="w-full max-w-sm mx-auto flex items-center justify-center rounded-xl">
        <CountdownItem num={remaining.days} text="days" />
        <CountdownItem num={remaining.hours} text="hours" />
        <CountdownItem num={remaining.minutes} text="minutes" />
        {/* <CountdownItem num={remaining.seconds} text="seconds" /> */}
      </div>
    </div>
  );
};

const CountdownItem = ({ num, text }: { num: number; text: string }) => {
  return (
    <div className="font-sans border rounded-full text-white w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 divide-slate-200 border-slate-200">
      <div className="w-full text-center relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          {num > 0 ? (
            <motion.span
              key={num}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: "backIn", duration: 0.75 }}
              className="block text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-white font-medium"
            >
              {num}
            </motion.span>
          ) : (
            <div className="font-sans block text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-white  font-medium">0</div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-xs md:text-sm lg:text-base font-light text-white">{text}</span>
    </div>
  );
};

export default ShiftingCountdown2;
