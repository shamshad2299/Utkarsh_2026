import { useEffect, useState } from "react";

const CountdownTimer = () => {
  
  const targetDate = new Date("2026-02-26T00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Box = ({ value, label }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className="
          bg-white text-[#050214]
          text-3xl md:text-5xl
          font-bold
          w-16 h-16 md:w-24 md:h-24
          flex items-center justify-center
          rounded-2xl shadow-xl
        "
      >
        {value}
      </div>
      <span className="text-xs md:text-sm uppercase tracking-widest text-gray-300">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Box value={timeLeft.days} label="Days" />
      <span className="text-3xl md:text-4xl font-bold">:</span>
      <Box value={timeLeft.hours} label="Hours" />
      <span className="text-3xl md:text-4xl font-bold">:</span>
      <Box value={timeLeft.minutes} label="Minutes" />
      <span className="text-3xl md:text-4xl font-bold">:</span>
      <Box value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default CountdownTimer;
