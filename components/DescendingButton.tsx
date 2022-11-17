import { Interval } from "../lib/utils.ts";

interface DescendingButtonProps {
  money: number;
  cost: number;
  purchased: boolean;
  active: boolean;
  purchase: () => void;
  toggle: () => void;
  notes: string[];
}

export default function DescendingButton(
  {
    cost,
    purchased,
    active,
    money,
    purchase,
    toggle,
    notes,
  }: DescendingButtonProps,
) {
  return (
    <button
      class={`text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity ${
        notes.length < 3
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
        }
      }}
    >
      Descending Intervals -{" "}
      {!purchased ? "$" + cost : active ? "ACTIVE" : "INACTIVE"}
      <br />
      <span class="text-sm font-medium">
        Descending intervals give 2x reward
      </span>
    </button>
  );
}
