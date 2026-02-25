import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2026-02-26T10:00:00").getTime();

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
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
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
    <div
      className="flex flex-col items-center"
      style={{ gap: "clamp(4px, 0.7vw, 8px)" }}
    >
      <div
        className="bg-white text-[#050214] font-bold flex items-center justify-center rounded-2xl shadow-xl"
        style={{
          fontFamily: "Milonga",
          width: "clamp(52px, 6.5vw, 96px)",
          height: "clamp(52px, 6.5vw, 96px)",
          fontSize: "clamp(22px, 3.2vw, 52px)",
        }}
      >
        {value}
      </div>

      <span
        className="uppercase tracking-widest text-gray-300"
        style={{
          fontSize: "clamp(10px, 1.1vw, 14px)",
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: "clamp(8px, 1.6vw, 16px)" }}
    >
      <Box value={timeLeft.days} label="Days" />

      <span
        className="font-bold text-white"
        style={{ fontSize: "clamp(18px, 2.8vw, 40px)" }}
      >
        :
      </span>

      <Box value={timeLeft.hours} label="Hours" />

      <span
        className="font-bold text-white"
        style={{ fontSize: "clamp(18px, 2.8vw, 40px)" }}
      >
        :
      </span>

      <Box value={timeLeft.minutes} label="Minutes" />

      <span
        className="font-bold text-white"
        style={{ fontSize: "clamp(18px, 2.8vw, 40px)" }}
      >
        :
      </span>

      <Box value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default CountdownTimer;
