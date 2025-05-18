import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = ({
  startDate,
  text,
}: {
  startDate: string;
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
    const end = new Date(startDate);

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
      <div className="w-full max-w-md gap-5 mx-auto flex items-center justify-center rounded-xl">
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
    <div className="font-sans border-b-4 text-black border-dashed rounded-full w-1/3 h-24 md:h-36 flex flex-col md:gap-2 items-center justify-center divide-y-2 divide-black border-black ">
      <div className="w-full text-center relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          {num > 0 ? (
            <motion.span
              key={num}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: "backIn", duration: 0.75 }}
              className="block text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-black font-medium"
            >
              {num}
            </motion.span>
          ) : (
            <div className="font-sans block text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-black font-medium">0</div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-xs md:text-sm lg:text-base font-light text-black">{text}</span>
    </div>
  );
};

export default ShiftingCountdown;
