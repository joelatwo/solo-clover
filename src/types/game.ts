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
  topLeft: PuzzleSlot;
  topRight: PuzzleSlot;
  bottomRight: PuzzleSlot;
  bottomLeft: PuzzleSlot;
}

export interface Puzzle {
  id: string;
  cards: Card[];
  puzzleSlots: PuzzleSlots;
}

export interface GameData {
  puzzles: Puzzle[];
}

export interface GameState {
  currentPuzzle: Puzzle | null;
  placedCards: {
    topLeft: Card | null;
    topRight: Card | null;
    bottomRight: Card | null;
    bottomLeft: Card | null;
  };
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

export type SlotPosition = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
