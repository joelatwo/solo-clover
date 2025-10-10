export interface Card {
  id: string;
  words: [string, string, string, string]; // top, right, bottom, left
  rotation: 0 | 90 | 180 | 270;
}

export interface PuzzleSlot {
  clue: string;
  words: [string, string]; // two words that should match
}

export interface PuzzleSlots {
  top: PuzzleSlot;
  right: PuzzleSlot;
  bottom: PuzzleSlot;
  left: PuzzleSlot;
}

export interface Puzzle {
  id: string;
  cards: Card[];
  solutions: PuzzleSlots;
}

export interface GameData {
  puzzles: Puzzle[];
}

export interface CardCorrectnessType {
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

export interface PlacedCardsType {
  topLeft: Card | null;
  topRight: Card | null;
  bottomRight: Card | null;
  bottomLeft: Card | null;
}
export interface GameState {
  currentPuzzle: Puzzle | null;
  placedCards: PlacedCardsType;
  attempts: number;
  score: number;
  isComplete: boolean;
  incorrectCards: {
    topLeft: boolean;
    topRight: boolean;
    bottomRight: boolean;
    bottomLeft: boolean;
  };
}

export type SlotPosition =
  | "topLeft"
  | "topRight"
  | "bottomRight"
  | "bottomLeft";
