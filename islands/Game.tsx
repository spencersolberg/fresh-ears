import { useEffect, useState } from "preact/hooks";
import * as Tone from "https://esm.sh/tone?module";
// import * as Tone from "npm:tone";

import {
  allNotes,
  availableIntervals,
  calculateDistance,
  determineIntervalDifficulty,
  formatNumber,
  Interval,
  notesOrder,
} from "../lib/utils.ts";

import IntervalButton from "../components/IntervalButton.tsx";
import NotatedIntervalButton from "../components/NotatedIntervalButton.tsx";
import BuyNoteButton from "../components/BuyNoteButton.tsx";
import PolyphonyButton from "../components/PolyphonyButton.tsx";
import DoubleBonusButton from "../components/DoubleBonusButton.tsx";
import DescendingButton from "../components/DescendingButton.tsx";
import NotationButton from "../components/NotationButton.tsx";

export default function Game() {
  const [synth, setSynth] = useState<Tone.PolySynth | undefined>();

  enum Category {
    Intervals,
    Chords,
    Melodies,
    Progressions,
    Scales,
  }

  const [category, setCategory] = useState<Category>(Category.Intervals);

  const [pressed, setPressed] = useState(false);

  const [currentInterval, setCurrentInterval] = useState<
    Interval | null
  >(null);

  const [money, setMoney] = useState(0);
  const [notes, setNotes] = useState([
    "C4",
  ]);
  const [streakBonus, setStreakBonus] = useState(1);
  const [polyphonyActive, setPolyphonyActive] = useState(false);
  const [polyphonyPurchased, setPolyphonyPurchased] = useState(false);
  const [unlockedIntervals, setUnlockedIntervals] = useState([0]);
  const [doubleBonus, setDoubleBonus] = useState(false);
  const [descendingPurchased, setDescendingPurchased] = useState(false);
  const [descendingActive, setDescendingActive] = useState(false);
  const [notationPurchased, setNotationPurchased] = useState(false);
  const [notationActive, setNotationActive] = useState(false);

  useEffect(() => {
    // load above states from local storage
    setMoney(Number(localStorage.getItem("money") || "0"));
    setNotes(JSON.parse(localStorage.getItem("notes") || '["C4"]'));
    setStreakBonus(Number(localStorage.getItem("streakBonus") || "1"));
    setPolyphonyActive(
      localStorage.getItem("polyphonyActive") === "true",
    );
    setPolyphonyPurchased(
      localStorage.getItem("polyphonyPurchased") === "true",
    );
    setUnlockedIntervals(
      JSON.parse(localStorage.getItem("unlockedIntervals") || "[]"),
    );
    setDoubleBonus(
      localStorage.getItem("doubleBonus") === "true",
    );
    setDescendingPurchased(
      localStorage.getItem("descendingPurchased") === "true",
    );
    setDescendingActive(
      localStorage.getItem("descendingActive") === "true",
    );
    setNotationPurchased(
      localStorage.getItem("notationPurchased") === "true",
    );
    setNotationActive(
      localStorage.getItem("notationActive") === "true",
    );
  }, []);

  useEffect(() => {
    // save above states to local storage
    localStorage.setItem("money", money.toString());
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("streakBonus", streakBonus.toString());
    localStorage.setItem("polyphonyActive", polyphonyActive.toString());
    localStorage.setItem("polyphonyPurchased", polyphonyPurchased.toString());
    localStorage.setItem(
      "unlockedIntervals",
      JSON.stringify(unlockedIntervals),
    );
    localStorage.setItem("doubleBonus", doubleBonus.toString());
    localStorage.setItem(
      "descendingPurchased",
      descendingPurchased.toString(),
    );
    localStorage.setItem("descendingActive", descendingActive.toString());
    localStorage.setItem("notationPurchased", notationPurchased.toString());
    localStorage.setItem("notationActive", notationActive.toString());
  }, [
    money,
    notes,
    streakBonus,
    polyphonyActive,
    polyphonyPurchased,
    unlockedIntervals,
    doubleBonus,
    descendingPurchased,
    descendingActive,
    notationPurchased,
    notationActive,
  ]);

  const polyphonyCost = 100;

  const [intervalReward, setIntervalReward] = useState(1);
  const [intervalDifficulty, setIntervalDifficulty] = useState(1);
  const [intervalPenalty, setIntervalPenalty] = useState(1 / 4);

  const purchasePolyphony = () => {
    if (money < polyphonyCost) return;
    setMoney(money - polyphonyCost);
    setPolyphonyPurchased(true);
    if (descendingActive) {
      setDescendingActive(false);
    }
    setPolyphonyActive(true);
  };

  const togglePolyphony = () => {
    if (!polyphonyActive && descendingActive) {
      setDescendingActive(false);
    }
    setPolyphonyActive(!polyphonyActive);
    setStreakBonus(1);
  };

  const doubleBonusCost = 750;
  const descendingCost = 25;

  const purchaseDoubleBonus = () => {
    if (money < doubleBonusCost) return;
    setMoney(money - doubleBonusCost);
    setDoubleBonus(true);
  };

  const purchaseDescending = () => {
    if (money < descendingCost) return;
    setMoney(money - descendingCost);
    setDescendingPurchased(true);
    if (polyphonyActive) {
      setPolyphonyActive(false);
    }
    setDescendingActive(true);
  };

  const toggleDescending = () => {
    if (!descendingActive && polyphonyActive) {
      setPolyphonyActive(false);
    }
    setDescendingActive(!descendingActive);
  };

  const notationCost = 5000;

  const purchaseNotation = () => {
    console.log("purchase notation");
    if (money < notationCost) return;
    console.log("purchase notation 2");
    setMoney(money - notationCost);
    setNotationPurchased(true);
    setNotationActive(true);
  };
  useEffect(() => {
    console.log("notation active", notationActive);
  }, [notationActive]);

  const toggleNotation = () => {
    setNotationActive(!notationActive);
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
      1 * (streakBonus * (doubleBonus ? 2 : 1)) * intervalDifficulty *
        (polyphonyActive ? 4 : 1) *
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

    let interval: Interval;

    // if first note is higher than second, swap them
    if (
      allNotes.indexOf(first) > allNotes.indexOf(second) && !descendingActive
    ) {
      interval = {
        first: second,
        second: first,
      };
    } else {
      interval = {
        first,
        second,
      };
    }

    setCurrentInterval(interval);
    setIntervalDifficulty(determineIntervalDifficulty(interval));

    playInterval(interval);
  };

  const playInterval = (interval: Interval) => {
    if (!synth) return;
    if (polyphonyActive) {
      // // trigger the attack immediately
      // synth.triggerAttack(interval.first);
      // synth.triggerAttack(interval.second);
      // // wait one second before triggering the release
      // synth.triggerRelease("+1");
      synth.triggerAttackRelease([
        ...new Set([interval.first, interval.second]),
      ], "4n");
    } else {
      synth.triggerAttackRelease([interval.first], "8n");
      setTimeout(() => {
        synth.triggerAttackRelease([interval.second], "8n");
      }, 1000);
    }
  };

  const playC4 = () => {
    if (!synth) return;
    synth.triggerAttackRelease("C4", "8n");
  };

  const newChallenge = () => {
    switch (category) {
      case Category.Intervals:
        newInterval();
        break;
      default:
        break;
    }
  };

  const playChallenge = () => {
    switch (category) {
      case Category.Intervals:
        if (!currentInterval) return;
        playInterval(currentInterval);
        break;
      default:
        break;
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

  const [notatedIntervalButtonArray, setNotatedIntervalButtonArray] = useState<
    preact.JSX.Element[]
  >([]);

  useEffect(() => {
    if (!currentInterval) return;
    const notateds = [];
    for (let i = 0; i < 16; i++) {
      notateds.push(
        <NotatedIntervalButton
          interval={i}
          pressed={pressed}
          guess={() => {
            return guessInterval(i);
          }}
          currentInterval={currentInterval}
          unlockedIntervals={unlockedIntervals}
          polyphony={polyphonyActive}
        />,
      );
    }
    // sort notateds randomly
    for (let i = notateds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [notateds[i], notateds[j]] = [notateds[j], notateds[i]];
    }
    setNotatedIntervalButtonArray(notateds);
  }, [currentInterval]);

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
          <div class="flex flex-col justify-end">
            <button
              class="font-medium text-xl hover:underline focus:outline-none"
              onClick={playC4}
            >
              Play C4
            </button>
          </div>
          <button
            class={(!pressed && !currentInterval
              ? `hover:scale-105 active:scale-95 focus:outline-none`
              : `focus:outline-none opacity-50 cursor-not-allowed`) +
              " text-6xl outline-none transition-transform transform-gpu transform-opacity touch-manipulation"}
            onClick={() => {
              if (pressed || currentInterval) return;
              newChallenge();
            }}
          >
            🎶
          </button>
          <div class="flex flex-col justify-end">
            <h2 class="font-medium text-xl text-right">
              bonus x{formatNumber(streakBonus * (doubleBonus ? 2 : 1))}
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
            playChallenge();
          }}
        >
          Repeat
        </button>
        {(category === Category.Intervals) && !notationActive && (
          <>
            <h1 class="text-4xl font-bold mb-4">Intervals</h1>

            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 mt-2 mb-4">
              {intervalButtonArray}
            </div>
          </>
        )}

        {((category === Category.Intervals) && notationActive) && (
          <>
            <h1 class="text-4xl font-bold mb-4">Intervals</h1>
            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 mt-2 mb-4">
              {notatedIntervalButtonArray}
            </div>
          </>
        )}

        <h1 class="text-4xl font-bold mb-4 mt-2">Shop</h1>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 mt-2 mb-4">
          {category === Category.Intervals && (
            <BuyNoteButton
              cost={noteCost}
              money={money}
              notes={notes}
              buyNote={buyNote}
            />
          )}
          {category === Category.Intervals && (
            <DescendingButton
              cost={descendingCost}
              purchased={descendingPurchased}
              active={descendingActive}
              money={money}
              purchase={purchaseDescending}
              notes={notes}
              toggle={toggleDescending}
            />
          )}
          {category === Category.Intervals && (
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
          )}

          {category === Category.Intervals && (
            <NotationButton
              cost={notationCost}
              purchased={notationPurchased}
              active={notationActive}
              purchase={purchaseNotation}
              money={money}
              toggle={toggleNotation}
              notes={notes}
            />
          )}

          <DoubleBonusButton
            cost={doubleBonusCost}
            purchased={doubleBonus}
            money={money}
            purchase={purchaseDoubleBonus}
            notes={notes}
          />
        </div>
      </div>
    </>
  );
}
