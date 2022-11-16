import { useEffect, useState } from "preact/hooks";
import * as Tone from "https://esm.sh/tone?module";
// import * as Tone from "npm:tone";

import {
  allNotes,
  availableIntervals,
  calculateDistance,
  convertIntervalToName,
  determineIntervalDifficulty,
  formatNumber,
  Interval,
  notesOrder,
} from "../lib/utils.ts";

import IntervalButton from "../components/IntervalButton.tsx";
import BuyNoteButton from "../components/BuyNoteButton.tsx";
import PolyphonyButton from "../components/PolyphonyButton.tsx";

export default function Game() {
  const [synth, setSynth] = useState<Tone.PolySynth | undefined>();

  enum Category {
    Intervals,
    Chords,
    Melodies,
    Progressions,
    Scales,
  }

  const [notes, setNotes] = useState([
    "C4",
  ]);

  const [category, setCategory] = useState<Category>(Category.Intervals);

  const [pressed, setPressed] = useState(false);

  const [currentInterval, setCurrentInterval] = useState<
    Interval | null
  >(null);

  const [money, setMoney] = useState(0);
  const [intervalReward, setIntervalReward] = useState(1);
  const [intervalPenalty, setIntervalPenalty] = useState(1 / 4);
  const [streakBonus, setStreakBonus] = useState(1);
  const [intervalDifficulty, setIntervalDifficulty] = useState(1);
  const [polyphonyActive, setPolyphonyActive] = useState(false);
  const [polyphonyPurchased, setPolyphonyPurchased] = useState(false);
  const [unlockedIntervals, setUnlockedIntervals] = useState([0]);

  const polyphonyCost = 100;

  const purchasePolyphony = () => {
    if (money < polyphonyCost) return;
    setMoney(money - polyphonyCost);
    setPolyphonyPurchased(true);
    setPolyphonyActive(true);
  };

  const togglePolyphony = () => {
    setPolyphonyActive(!polyphonyActive);
  };

  useEffect(() => {
    setUnlockedIntervals(availableIntervals[notes.length]);
  }, [notes]);

  useEffect(() => {
    setIntervalPenalty(intervalReward / 4);
  }, [intervalReward]);

  useEffect(() => {
    const descending = currentInterval &&
      (allNotes.indexOf(currentInterval.first) >
        allNotes.indexOf(currentInterval.second));
    setIntervalReward(
      1 * streakBonus * intervalDifficulty * (polyphonyActive ? 4 : 1) *
        (descending && !polyphonyActive ? 2 : 1),
    );
  }, [streakBonus, intervalDifficulty, polyphonyActive, currentInterval]);

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
    setSynth(new Tone.PolySynth().toDestination());
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
    setIntervalDifficulty(determineIntervalDifficulty({ first, second }));

    playInterval({ first, second });
  };

  const playInterval = (interval: Interval) => {
    if (!synth) return;
    setPressed(true);
    if (polyphonyActive) {
      // // trigger the attack immediately
      // synth.triggerAttack(interval.first);
      // synth.triggerAttack(interval.second);
      // // wait one second before triggering the release
      // synth.triggerRelease("+1");
      synth.triggerAttackRelease([
        ...new Set([interval.first, interval.second]),
      ], "4n");
      setTimeout(() => {
        setPressed(false);
      }, 1500);
    } else {
      synth.triggerAttackRelease([interval.first], "8n");
      setTimeout(() => {
        synth.triggerAttackRelease([interval.second], "8n");
        setTimeout(() => {
          setPressed(false);
        }, 1000);
      }, 1000);
    }
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
        unlockedIntervals={unlockedIntervals}
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
      setStreakBonus(streakBonus + .1);
      return true;
    } else {
      const moneyAfterPenalty = money - intervalPenalty;
      if (moneyAfterPenalty < 0) {
        setMoney(0);
      } else {
        setMoney(moneyAfterPenalty);
      }
      setStreakBonus(1);

      return false;
    }
  };

  return (
    <>
      <div class="flex flex-col">
        <h1 class="text-6xl font-bold mx-auto mb-4">${formatNumber(money)}</h1>
        <div class="grid grid-cols-3">
          <div></div>
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
          <div class="flex flex-col justify-end">
            <h2 class="font-medium text-xl text-right">
              bonus x{formatNumber(streakBonus)}
            </h2>
          </div>
        </div>
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
          <PolyphonyButton
            cost={polyphonyCost}
            purchased={polyphonyPurchased}
            active={polyphonyActive}
            purchase={purchasePolyphony}
            money={money}
            toggle={togglePolyphony}
            notes={notes}
            setCurrentInterval={setCurrentInterval}
          />
        </div>
      </div>
    </>
  );
}
