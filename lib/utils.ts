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

// this function formats numbers
// examples:
// 1.5003 => 1.50
// 1.5999 => 1.60
// 15003 => 1.5k
// 1000000 => 1M
// 1341578 => 1.341M
export const formatNumber = (number: number) => {
  if (number < 1000) {
    return number.toFixed(2);
  } else if (number < 1000000) {
    return (number / 1000).toFixed(2) + "k";
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(2) + "M";
  } else if (number < 1000000000000) {
    return (number / 1000000000).toFixed(2) + "B";
  } else {
    return (number / 1000000000000).toFixed(2) + "T";
  }
}

export const determineIntervalDifficulty = (interval: Interval) => {
  const distance = calculateDistance(interval.first, interval.second);
  // console.log(distance);
  switch (distance) {
    case 0: // unison
      return 1;
    case 1: // minor 2nd
      return 2;
    case 2: // major 2nd
      return 1;
    case 3: // minor 3rd
      return 2;
    case 4: // major 3rd
      return 1;
    case 5: // perfect 4th
      return 1;
    case 6:// tritone
      return 3;
    case 7:// perfect 5th
      return 1;
    case 8:// minor 6th
      return 3;
    case 9:// major 6th
      return 2;
    case 10:// minor 7th
      return 2;
    case 11:// major 7th
      return 2;
    case 12:// octave
      return 1;
    case 13:// minor 9th
      return 3;
    case 14:// major 9th
      return 3;
    case 15:// minor 10th
      return 3;
    // otherwise return 1
    default:
      return 1;
  }
}