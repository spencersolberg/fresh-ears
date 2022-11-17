interface DoubleBonusButtonProps {
  money: number;
  cost: number;
  purchased: boolean;
  purchase: () => void;
  notes: string[];
}

export default function PolyphonyButton(
  {
    cost,
    purchased,
    money,
    purchase,
    notes,
  }: DoubleBonusButtonProps,
) {
  return (
    <button
      class={`text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity ${
        notes.length < 9 || purchased
          ? "hidden"
          : !purchased && (money >= cost)
          ? "bg-blue-500 hover:bg-blue-700"
          : !purchased && (money < cost)
          ? "bg-blue-500 opacity-50 cursor-not-allowed"
          : ""
      }`}
      onClick={() => {
        if (!purchased && (money >= cost)) purchase();
      }}
    >
      Double Bonus - ${cost}
      <br />
      <span class="text-sm font-medium">
        Multiplies the streak bonus by 2
      </span>
    </button>
  );
}
