import { Vex } from "https://esm.sh/vexflow";

import { useEffect, useState } from "preact/hooks";
import { allNotes, Interval } from "../lib/utils.ts";

const { Factory, EasyScore, System, Renderer } = Vex.Flow;

interface NotatedIntervalButtonProps {
  interval: number;
  pressed: boolean;
  guess: () => boolean;
  currentInterval: Interval | null;
  unlockedIntervals: number[];
  polyphony: boolean;
}

export default function NotatedIntervalButton({
  interval,
  pressed,
  guess,
  currentInterval,
  unlockedIntervals,
  polyphony,
}: NotatedIntervalButtonProps) {
  const [correct, setCorrect] = useState<boolean | null>(null);
  const click = () => {
    setCorrect(guess());
  };

  useEffect(() => {
    setTimeout(() => {
      setCorrect(null);
    }, 2000);
  }, [correct]);

  useEffect(() => {
    if (!currentInterval) return;
    const vf = new Factory({
      renderer: {
        elementId: "output" + interval,
        backend: Renderer.Backends.CANVAS,
        width: 120,
        height: 125,
        background: "#FFF",
      },
    });
    const score = vf.EasyScore();
    const system = vf.System();

    const isDescending = allNotes.indexOf(currentInterval.first) >
      allNotes.indexOf(currentInterval.second);

    const firstNote = currentInterval.first;
    const secondNote = allNotes[
      (
        allNotes.indexOf(currentInterval.first) +
        (isDescending ? -interval : interval)
      ) % allNotes.length
    ];

    console.log(firstNote, "+ " + interval, secondNote);

    console.log(`${firstNote} ${secondNote})/w`);

    system
      .addStave({
        voices: [
          score.voice(
            score.notes(
              `(${firstNote} ${secondNote})/w`,
              { stem: "up" },
            ),
          ),
        ],
      })
      .addClef("treble");

    vf.draw();
  }, [currentInterval]);
  return (
    <button
      class={"text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity focus:outline-none" +
        ((pressed || !currentInterval) && (correct === null)
          ? " opacity-50 cursor-not-allowed"
          : " active:scale-95") +
        (correct === true ? " bg-green-500" : "") +
        (correct === false ? " bg-red-500" : "") +
        (correct === null
          ? " bg-white hover:bg-blue-200 border-blue-400 border-2"
          : "") +
        (unlockedIntervals.includes(interval) ? "" : " hidden")}
      onClick={() => {
        if (pressed) return;
        click();
      }}
    >
      <canvas
        id={"output" + interval}
        width="100"
        height="125"
        class="-mt-8 -mb-4 mx-auto w-full"
      >
      </canvas>
    </button>
  );
}
