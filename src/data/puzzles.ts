import { PuzzleType } from "@/types/game";

const gameData: PuzzleType[] = [
  {
    id: "8/31/2025",
    cards: [
      {
        id: "card1",
        words: ["Essence", "Joke", "Hospital", "Roast"],
        rotation: 0,
      },
      {
        id: "card2",
        words: ["Award", "Fly", "Calendar", "Skull"],
        rotation: 0,
      },
      {
        id: "card3",
        words: ["Eye", "Sea", "Bouquet", "Box"],
        rotation: 0,
      },
      {
        id: "card4",
        words: ["Building", "Boxing", "First", "Fever"],
        rotation: 0,
      },
      {
        id: "card5",
        words: ["Toy", "Basket", "Weak", "Knight"],
        rotation: 0,
      },
    ],
    solutions: {
      top: {
        clue: "Oscars",
        words: ["Essence", "Award"],
      },
      right: {
        clue: "Gull",
        words: ["Fly", "Sea"],
      },
      left: {
        clue: "Hot",
        words: ["Roast", "Fever"],
      },
      bottom: {
        clue: "Date",
        words: ["Bouquet", "First"],
      },
    },
  },
];

export default gameData;
