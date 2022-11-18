interface NotationButtonProps {
  money: number;
  cost: number;
  purchased: boolean;
  active: boolean;
  purchase: () => void;
  toggle: () => void;
  notes: string[];
}

export default function NotationButton(
  {
    cost,
    purchased,
    active,
    money,
    purchase,
    toggle,
    notes,
  }: NotationButtonProps,
) {
  return (
    <button
      class={`text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity ${
        notes.length < 11
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
        console.log("clicked");
        if (!purchased && (money >= cost)) {
          purchase();
          return;
        }
        if (purchased) {
          toggle();
        }
      }}
    >
      Notation - {!purchased ? "$" + cost : active ? "ACTIVE" : "INACTIVE"}
      <br />
      <span class="text-sm font-medium">
        Staff notation instead of interval names for 4x reward
      </span>
    </button>
  );
}
