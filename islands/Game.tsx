import { useEffect, useState } from "preact/hooks";
import * as Tone from "https://esm.sh/tone?module";
// import * as Tone from "npm:tone";

import {
  calculateDistance,
  convertIntervalToName,
  Interval,
} from "../lib/utils.ts";

import IntervalButton from "../components/IntervalButton.tsx";

export default function Game() {
  const [synth, setSynth] = useState<Tone.Synth | undefined>();
  const [notes, setNotes] = useState([
    // C4 - D#5
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
  ]);

  const [pressed, setPressed] = useState(false);

  const [currentInterval, setCurrentInterval] = useState<
    Interval | null
  >(null);

  const [money, setMoney] = useState(0);
  const [intervalReward, setIntervalReward] = useState(1);

  useEffect(() => {
    setSynth(new Tone.Synth().toDestination());
  }, []);

  const newInterval = () => {
    if (!synth) return;
    // Gets two random notes from the notes array
    const first = notes[Math.floor(Math.random() * notes.length)];
    const second = notes[Math.floor(Math.random() * notes.length)];
    setCurrentInterval({ first, second });

    playInterval({ first, second });
  };

  const playInterval = (interval: Interval) => {
    if (!synth) return;
    setPressed(true);
    synth.triggerAttackRelease(interval.first, "8n");
    setTimeout(() => {
      synth.triggerAttackRelease(interval.second, "8n");
      setTimeout(() => {
        setPressed(false);
      }, 1000);
    }, 1000);
  };

  const intervalButtonArray = [];
  for (let i = 0; i < 16; i++) {
    intervalButtonArray.push(
      <IntervalButton
        interval={i}
        pressed={pressed}
        guess={() => {
          return guessInterval(i);
        }}
        currentInterval={currentInterval}
      />,
    );
  }

  const guessInterval = (distance: number): boolean => {
    if (!currentInterval) return false;
    const actualDistance = calculateDistance(
      currentInterval.first,
      currentInterval.second,
    );
    // console.log(
    //   currentInterval.first,
    //   currentInterval.second,
    //   actualDistance,
    //   convertIntervalToName(actualDistance),
    // );
    if (distance === actualDistance) {
      setMoney(money + intervalReward);
      setCurrentInterval(null);
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div class="flex flex-col">
        <h1 class="text-6xl font-bold mx-auto mb-4">${money}</h1>
        <button
          class={(!pressed && !currentInterval
            ? `hover:scale-105 active:scale-95 focus:outline-none`
            : `focus:outline-none opacity-50 cursor-not-allowed`) +
            " text-6xl outline-none transition-transform transform-gpu transform-opacity touch-manipulation"}
          onClick={() => {
            if (pressed || currentInterval) return;
            newInterval();
          }}
        >
          🎶
        </button>
        <button
          class={"mt-4 text-blue-500 hover:underline outline-none focus:outline-none transition-opacity text-2xl" +
            (
              !currentInterval
                ? " opacity-0 cursor-default"
                : pressed
                ? " opacity-50 cursor-not-allowed"
                : " opacity-100"
            )}
          onClick={() => {
            if (!currentInterval || pressed) return;
            playInterval(currentInterval);
          }}
        >
          Repeat
        </button>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 mt-6">
          {intervalButtonArray}
        </div>
      </div>
    </>
  );
}
