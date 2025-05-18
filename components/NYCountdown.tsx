import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const CountdownMinutesNY = ({ minutes }: { minutes: number }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);
    return () => clearInterval(intervalRef.current || undefined);
  }, [minutes]);

  const handleCountdown = () => {
    const distance = minutes * MINUTE;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const mins = Math.floor((distance % HOUR) / MINUTE);

    setRemaining({
      days,
      hours,
      minutes: mins,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-green-100 rounded-lg p-3 text-center">
        <span className="block text-2xl font-bold text-green-600">
          {remaining.days}
        </span>
        <span className="text-sm text-green-500">Days</span>
      </div>
      <div className="bg-green-100 rounded-lg p-3 text-center">
        <span className="block text-2xl font-bold text-green-600">
          {remaining.hours}
        </span>
        <span className="text-sm text-green-500">Hours</span>
      </div>
      <div className="bg-green-100 rounded-lg p-3 text-center">
        <span className="block text-2xl font-bold text-green-600">
          {remaining.minutes}
        </span>
        <span className="text-sm text-green-500">Mins</span>
      </div>
    </div>
  );
};

export default CountdownMinutesNY;
