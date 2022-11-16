import { useEffect, useState } from "preact/hooks";
import * as Tone from "https://esm.sh/tone?module";
// import * as Tone from "npm:tone";

import {
  calculateDistance,
  convertIntervalToName,
  Interval,
  notesOrder,
} from "../lib/utils.ts";

import IntervalButton from "../components/IntervalButton.tsx";
import BuyNoteButton from "../components/BuyNoteButton.tsx";

export default function Game() {
  const [synth, setSynth] = useState<Tone.Synth | undefined>();

  enum Modes {
    Intervals,
    Chords,
    Melodies,
    Progressions,
  }

  const [notes, setNotes] = useState([
    "C4",
  ]);

  const [mode, setMode] = useState<Modes>(Modes.Intervals);

  const [pressed, setPressed] = useState(false);

  const [currentInterval, setCurrentInterval] = useState<
    Interval | null
  >(null);

  const [money, setMoney] = useState(0);
  const [intervalReward, setIntervalReward] = useState(1);
  const [intervalPenalty, setIntervalPenalty] = useState(1 / 4);

  useEffect(() => {
    setIntervalPenalty(intervalReward / 4);
  }, [intervalReward]);

  const [noteCost, setNoteCost] = useState(5);

  useEffect(() => {
    setNoteCost(5 * Math.pow(2, notes.length - 1));
  });

  const buyNote = () => {
    if (money < noteCost) return;
    setMoney(money - noteCost);
    setNotes([...notes, notesOrder[notes.length]]);
  };

  useEffect(() => {
    setSynth(new Tone.Synth().toDestination());
  }, []);

  const newInterval = () => {
    if (!synth) return;
    // Gets two random notes from the notes array
    const first = notes[Math.floor(Math.random() * notes.length)];
    const second = notes[Math.floor(Math.random() * notes.length)];
    if (calculateDistance(first, second) > 15) {
      newInterval();
      return;
    }
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
      const moneyAfterPenalty = money - intervalPenalty;
      if (moneyAfterPenalty < 0) {
        setMoney(0);
      } else {
        setMoney(moneyAfterPenalty);
      }

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
        <h1 class="text-4xl font-bold mb-4">Intervals</h1>

        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 mt-2 mb-4">
          {intervalButtonArray}
        </div>
        <h1 class="text-4xl font-bold mb-4 mt-2">Shop</h1>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 mt-2 mb-4">
          <BuyNoteButton
            cost={noteCost}
            money={money}
            notes={notes}
            buyNote={buyNote}
          />
        </div>
      </div>
    </>
  );
}
