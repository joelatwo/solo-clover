import { PuzzleType, RotationOptionsType } from "@/types/game";

const getRandomRotation = (): RotationOptionsType => {
  const rotation: RotationOptionsType[] = [0, 90, 180, 270];
  const randomIndex = Math.floor(Math.random() * 4);
  return rotation[randomIndex];
};

const shuffleArray = <T>(array: T[]) => {
  const shuffled = [...array]; // make a copy to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const RandomizePuzzleSetup = (puzzle: PuzzleType) => {
  puzzle.cards = shuffleArray(puzzle.cards);
  puzzle.cards = puzzle.cards.map((card) => ({
    ...card,
    rotation: getRandomRotation(),
  }));

  return puzzle;
};
