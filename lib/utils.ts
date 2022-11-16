export const allNotes = [
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
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
  "E5",
  "F5",
  "F#5",
  "G5",
];

export const notesOrder = [
  "C4",
  "E4",
  "G4",
  "B4",
  "D4",
  "A4",
  "F4",
  "C5",
  "C#4",
  "D#4",
  "F#4",
  "G#4",
  "A#4",
  "D5",
  "C#5",
  "B3",
  "A#3",
  "A3",
  "G#3",
  "G3",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5"
];

export const convertIntervalToName = (interval: number) => {
  switch (interval) {
    case 0:
      return "Unison";
    case 1:
      return "Minor 2nd";
    case 2:
      return "Major 2nd";
    case 3:
      return "Minor 3rd";
    case 4:
      return "Major 3rd";
    case 5:
      return "Perfect 4th";
    case 6:
      return "Tritone";
    case 7:
      return "Perfect 5th";
    case 8:
      return "Minor 6th";
    case 9:
      return "Major 6th";
    case 10:
      return "Minor 7th";
    case 11:
      return "Major 7th";
    case 12:
      return "Octave";
    case 13:
      return "Minor 9th";
    case 14:
      return "Major 9th";
    case 15:
      return "Minor 10th";
  }
};

export const calculateDistance = (note1: string, note2: string) => {
  const index1 = allNotes.indexOf(note1);
  // console.log(note1, index1);
  const index2 = allNotes.indexOf(note2);
  // console.log(note2, index2);
  const distance = Math.abs(index1 - index2);
  // console.log(distance);
  return distance;

}

export type Interval = {
  first: string;
  second: string;
};