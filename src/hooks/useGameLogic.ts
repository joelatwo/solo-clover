import {
  Card,
  CardCorrectnessType,
  PlacedCardsType,
  PuzzleSlots,
  PuzzleType,
  RotationOptionsType,
  SavedGameState,
  SlotPosition,
} from "@/types/game";
import { getDateKey } from "@/utils/Dates";

export type RotateDirection = "left" | "right";
import { useEffect, useState } from "react";

const defaultPlacedCards = {
  topLeft: null,
  topRight: null,
  bottomRight: null,
  bottomLeft: null,
};

export function useGameLogic(initialPuzzle: PuzzleType | null) {
  const [score, setScore] = useState<number | null>(null);
  const [cardsCorrectness, setCardsCorrectness] =
    useState<CardCorrectnessType | null>();
  const [numberOfAttempts, setNumberOfAttempts] = useState<number>(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType | null>(
    initialPuzzle,
  );
  const [placedCards, setPlacedCards] =
    useState<PlacedCardsType>(defaultPlacedCards);

  const [availableCards, setAvailableCards] = useState<Card[]>(
    initialPuzzle?.cards || [],
  );

  // Update available cards when puzzle changes
  useEffect(() => {
    if (initialPuzzle) {
      setAvailableCards(initialPuzzle.cards);
    }
  }, [initialPuzzle]);

  const rotateCard = (cardId: string, direction: RotateDirection) => {
    const delta = direction === "right" ? 90 : -90;
    setAvailableCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              rotation: ((card.rotation + delta + 360) % 360 ||
                0) as RotationOptionsType,
            }
          : card,
      ),
    );
  };

  const rotatePlacedCard = (
    position: SlotPosition,
    direction: RotateDirection,
  ) => {
    const delta = direction === "right" ? 90 : -90;
    setPlacedCards((prev) => {
      const card = prev[position];
      if (!card) return prev;
      const newRotation = ((card.rotation + delta + 360) % 360 ||
        0) as RotationOptionsType;
      return {
        ...prev,
        [position]: { ...card, rotation: newRotation },
      };
    });
  };

  const placeCard = (card: Card, position: SlotPosition) => {
    const existingCard = placedCards[position];
    if (existingCard) {
      setAvailableCards((prev) => {
        const filtered = prev.filter((c) => c.id !== card.id);
        return [...filtered, existingCard];
      });
    } else {
      setAvailableCards((prev) => prev.filter((c) => c.id !== card.id));
    }
    setPlacedCards((prev) => ({ ...prev, [position]: card }));
  };

  const removeCard = (position: SlotPosition) => {
    const card = placedCards[position];
    if (card) {
      setAvailableCards((prev) => [...prev, card]);
      setPlacedCards((prev) => ({
        ...prev,
        [position]: null,
      }));
    }
  };

  const getCardByRotation = (card: Card) => {
    const r = card.rotation / 90;
    const at = (slotIndex: number) => card.words[(slotIndex - r + 4) % 4];
    return {
      top: at(0),
      right: at(1),
      bottom: at(2),
      left: at(3),
    };
  };

  const validateTopLeft = (solutions: PuzzleSlots, card: Card) => {
    const { top, left } = getCardByRotation(card);
    console.log(getCardByRotation(card));
    return solutions.left.words[0] === left && solutions.top.words[0] === top;
  };

  const validateTopRight = (solutions: PuzzleSlots, card: Card) => {
    const { top, right } = getCardByRotation(card);
    return solutions.top.words[1] === top && solutions.right.words[0] === right;
  };

  const validateBottomLeft = (solutions: PuzzleSlots, card: Card) => {
    const { bottom, left } = getCardByRotation(card);

    return (
      solutions.left.words[1] === left && solutions.bottom.words[1] === bottom
    );
  };

  const validateBottomRight = (solutions: PuzzleSlots, card: Card) => {
    const { bottom, right } = getCardByRotation(card);

    return (
      solutions.right.words[1] === right && solutions.bottom.words[0] === bottom
    );
  };

  const checkSolution = () => {
    // Validate that all slots are filled. & that we have a valid puzzle
    if (!currentPuzzle || !placedCards) {
      return {
        topLeft: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
      };
    }

    const { solutions } = currentPuzzle;

    console.log(solutions, placedCards.topLeft);
    if (
      !placedCards.topLeft ||
      !placedCards.topRight ||
      !placedCards.bottomLeft ||
      !placedCards.bottomRight
    ) {
      return {
        topLeft: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
      };
    }

    return {
      topLeft: validateTopLeft(solutions, placedCards.topLeft),
      topRight: validateTopRight(solutions, placedCards.topRight),
      bottomLeft: validateBottomLeft(solutions, placedCards.bottomLeft),
      bottomRight: validateBottomRight(solutions, placedCards.bottomRight),
    };
  };

  const getScore = () => {
    if (numberOfAttempts === 0) {
      return 6;
    } else if (numberOfAttempts === 1) {
      return 5;
    } else {
      return 4; // All 4 pairs are correct
    }
  };

  const submitSolution = () => {
    const checkedSolutions = checkSolution();
    const isCorrect =
      checkedSolutions.topLeft &&
      checkedSolutions.topRight &&
      checkedSolutions.bottomLeft &&
      checkedSolutions.bottomRight;
    if (isCorrect) {
      let pointsEarned = getScore();

      setScore(pointsEarned);
    }

    setCardsCorrectness(checkedSolutions);
    setNumberOfAttempts(numberOfAttempts + 1);

    const { dateKey, savedGameState, storageKey } = getLocalStorage();

    const gameState: SavedGameState = {
      placedCards,
      attempts: numberOfAttempts,
      cardsCorrectness: checkedSolutions,
    };

    console.log(savedGameState);

    savedGameState.push(gameState);

    localStorage.setItem(storageKey, JSON.stringify(savedGameState));
  };

  const getLocalStorage = () => {
    const dateKey = getDateKey(new Date());
    const storageKey = `puzzle-${dateKey}`;
    const savedGameStateUnprocessed = localStorage.getItem(storageKey);
    let processedGameState: SavedGameState[] = [];

    if (savedGameStateUnprocessed !== null) {
      try {
        processedGameState = JSON.parse(savedGameStateUnprocessed);
      } catch (error) {
        processedGameState = [];
      }
    }

    return {
      dateKey,
      storageKey,
      savedGameState: processedGameState,
      numberOfAttempts: processedGameState.length,
    };
  };

  const resetGame = () => {
    if (initialPuzzle) {
      setPlacedCards(defaultPlacedCards);
      setCurrentPuzzle(initialPuzzle);
      setAvailableCards(initialPuzzle.cards);
    }
  };

  const showAnswer = () => {
    if (!initialPuzzle) return;

    const { cards, solutions } = initialPuzzle;

    // Work on a shallow copy of the cards so we can remove used ones
    const remaining = [...cards];

    const tryFindFor = (
      validate: (solutions: PuzzleSlots, card: Card) => boolean,
    ): Card | null => {
      for (let i = 0; i < remaining.length; i++) {
        const card = remaining[i];
        const rotations: RotationOptionsType[] = [0, 90, 180, 270];
        for (const rot of rotations) {
          const candidate = { ...card, rotation: rot } as Card;
          if (validate(solutions, candidate)) {
            // remove from remaining so it isn't reused
            remaining.splice(i, 1);
            return candidate;
          }
        }
      }
      return null;
    };

    const topLeft = tryFindFor(validateTopLeft);
    const topRight = tryFindFor(validateTopRight);
    const bottomRight = tryFindFor(validateBottomRight);
    const bottomLeft = tryFindFor(validateBottomLeft);

    setPlacedCards({ topLeft, topRight, bottomRight, bottomLeft });
    setAvailableCards(remaining);
    setCurrentPuzzle(initialPuzzle);
    setCardsCorrectness({
      topLeft: !!topLeft,
      topRight: !!topRight,
      bottomLeft: !!bottomLeft,
      bottomRight: !!bottomRight,
    });
  };

  const restoreGameState = (
    savedGameState: SavedGameState,
    numberOfAttempts: number,
  ) => {
    setPlacedCards(savedGameState.placedCards);
    setNumberOfAttempts(numberOfAttempts);
    setCardsCorrectness(savedGameState.cardsCorrectness);

    const isCorrect =
      cardsCorrectness?.topLeft &&
      cardsCorrectness?.topRight &&
      cardsCorrectness?.bottomLeft &&
      cardsCorrectness?.bottomRight;
    if (isCorrect) {
      let pointsEarned = getScore();

      setScore(pointsEarned);
    }

    // Update available cards by removing placed cards
    if (initialPuzzle) {
      const placedIds = Object.values(savedGameState.placedCards)
        .filter((card) => card !== null)
        .map((card) => card!.id);
      const remaining = initialPuzzle.cards.filter(
        (card) => !placedIds.includes(card.id),
      );
      console.log("  - Placed card IDs:", placedIds);
      console.log("  - Remaining available cards:", remaining);
      setAvailableCards(remaining);
    }

    console.log("✅ Game state restored successfully");
  };

  return {
    placedCards,
    cardsCorrectness,
    score,
    numberOfAttempts,
    availableCards,
    rotateCard,
    rotatePlacedCard,
    placeCard,
    removeCard,
    submitSolution,
    resetGame,
    showAnswer,
    restoreGameState,
    getLocalStorage,
  };
}
