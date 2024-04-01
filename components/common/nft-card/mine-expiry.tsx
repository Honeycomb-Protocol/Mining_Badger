import { useEffect } from "react";

import Utils from "@/lib/utils";

const MineExpiry = ({
  exp,
  setTimeLeft,
  timeLeft,
}: {
  exp: number;
  setTimeLeft: (time: number) => void;
  timeLeft: number;
}) => {
  const { formatTime } = Utils();

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = exp - Date.now();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [exp, setTimeLeft]);

  return (
    <div className="text-center font-bold text-sm mb-1">
      Re-activated In: <br />
      <span className="font-normal">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default MineExpiry;
