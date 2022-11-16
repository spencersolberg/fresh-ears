import { useEffect, useState } from "preact/hooks";
import { Interval } from "../lib/utils.ts";

interface IntervalButtonProps {
  interval: number;
  pressed: boolean;
  guess: () => boolean;
  currentInterval: Interval | null;
  unlockedIntervals: number[];
}

import { convertIntervalToName } from "../lib/utils.ts";

export default function IntervalButton({
  interval,
  pressed,
  guess,
  currentInterval,
  unlockedIntervals,
}: IntervalButtonProps) {
  const [correct, setCorrect] = useState<boolean | null>(null);
  const click = () => {
    setCorrect(guess());
  };

  useEffect(() => {
    setTimeout(() => {
      setCorrect(null);
    }, 2000);
  }, [correct]);
  return (
    <button
      class={"text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity" +
        ((pressed || !currentInterval) && (correct === null)
          ? " opacity-50 cursor-not-allowed"
          : " active:scale-95") +
        (correct === true ? " bg-green-500" : "") +
        (correct === false ? " bg-red-500" : "") +
        (correct === null ? " bg-blue-500 hover:bg-blue-700" : "") +
        (unlockedIntervals.includes(interval) ? "" : " hidden")}
      onClick={() => {
        if (pressed) return;
        click();
      }}
    >
      {convertIntervalToName(interval)}
    </button>
  );
}
