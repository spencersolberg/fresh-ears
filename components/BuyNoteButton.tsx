import { useEffect, useState } from "preact/hooks";
import { allNotes } from "../lib/utils.ts";

interface BuyNoteButtonProps {
  cost: number;
  money: number;
  notes: string[];
  buyNote: () => void;
}

export default function BuyNoteButton(
  { cost, money, notes, buyNote }: BuyNoteButtonProps,
) {
  return (
    <button
      class={"text-white font-bold py-2 px-4 rounded transition-colors transition-transform transform-gpu transition-opacity bg-blue-500" +
        (money < cost || (notes.length === allNotes.length)
          ? " opacity-50 cursor-not-allowed"
          : " hover:bg-blue-700")}
      onClick={() => {
        if (money < cost || (notes.length === allNotes.length)) return;
        buyNote();
      }}
    >
      Buy Note {notes.length}/{allNotes.length} -{" "}
      {notes.length != allNotes.length ? "$" + cost : "MAX"}
    </button>
  );
}
