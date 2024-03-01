import { useEffect, useState } from "react";

import { formatTime } from "@/lib/utils";

const MineExpiry = ({
  exp,
  setTimeLeft,
  timeLeft,
}: {
  exp: number;
  setTimeLeft: (time: number) => void;
  timeLeft: number;
}) => {
  const [time, setTime] = useState<number>(timeLeft);
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = exp - Date.now();
      setTime(newTimeLeft);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [exp, setTime, setTimeLeft]);

  return (
    <div className="text-center font-bold text-sm mb-1">
      Re-activated In: <br />
      <span className="font-normal">{formatTime(time)}</span>
    </div>
  );
};

export default MineExpiry;
