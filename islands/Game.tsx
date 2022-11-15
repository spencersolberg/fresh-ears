import { useEffect, useState } from "preact/hooks";
import * as Tone from "https://esm.sh/tone?module";
// import * as Tone from "npm:tone";

export default function Game() {
  const [synth, setSynth] = useState(new Tone.Synth().toDestination());
  const [notes, setNotes] = useState(["C4"]);

  const playInterval = () => {
    // Gets two random notes from the notes array
    const first = notes[Math.floor(Math.random() * notes.length)];
    const second = notes[Math.floor(Math.random() * notes.length)];

    // Plays the first note
    synth.triggerAttackRelease(first, "8n");

    // Plays the second note after 1 second
    setTimeout(() => {
      synth.triggerAttackRelease(second, "8n");
    }, 1000);
  };

  return (
    <>
      <div class="flex flex-col">
        <h1 class="text-6xl font-medium m-auto">Fresh Ears</h1>
        <button class="text-6xl cursor-pointer outline-none transform-gpu hover:scale-105 transition-transform active:scale-95 focus:outline-none">
          🎶
        </button>
      </div>
    </>
  );
}
