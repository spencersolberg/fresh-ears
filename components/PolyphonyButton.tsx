import { useEffect, useState } from "preact/hooks";
import { allNotes } from "../lib/utils.ts";

import { Interval } from "../lib/utils.ts";

interface PolyphonyButtonProps {
  money: number;
  cost: number;
  purchased: boolean;
  active: boolean;
  purchase: () => void;
  toggle: () => void;
  notes: string[];
  setCurrentInterval: (interval: Interval | null) => void;
}

export default function PolyphonyButton(
  {
    cost,
    purchased,
    active,
    money,
    purchase,
    toggle,
    notes,
    setCurrentInterval,
  }: PolyphonyButtonProps,
) {
  return (
    <button
      class={`text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity ${
        notes.length < 5
          ? "hidden"
          : !purchased && (money >= cost)
          ? "bg-blue-500 hover:bg-blue-700"
          : !purchased && (money < cost)
          ? "bg-blue-500 opacity-50 cursor-not-allowed"
          : purchased && active
          ? "bg-green-500"
          : purchased && !active
          ? "bg-red-500"
          : ""
      }`}
      onClick={() => {
        if (!purchased && (money >= cost)) purchase();
        if (purchased) {
          toggle();
          setCurrentInterval(null);
        }
      }}
    >
      Polyphony - {!purchased ? "$" + cost : active ? "ACTIVE" : "INACTIVE"}
    </button>
  );
}
