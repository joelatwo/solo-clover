import {
  Card,
  CardCorrectnessType,
  PlacedCardsType,
  PuzzleSlots,
  PuzzleType,
  SlotPosition,
} from "@/types/game";
import { useEffect, useState } from "react";

const defaultPlacedCards = {
  topLeft: null,
  topRight: null,
  bottomRight: null,
  bottomLeft: null,
};

export function useGameLogic(initialPuzzle: PuzzleType | null) {
  const [score, setScore] = useState<number | null>();
  const [cardsCorrectness, setCardsCorrectness] =
    useState<CardCorrectnessType | null>();
  const [numberOfAttempts, setNumberOfAttempts] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType | null>(
    initialPuzzle
  );
  const [placedCards, setPlacedCards] =
    useState<PlacedCardsType>(defaultPlacedCards);

  const [availableCards, setAvailableCards] = useState<Card[]>(
    initialPuzzle?.cards || []
  );

  // Load score from localStorage on mount
  useEffect(() => {
    const savedScore = localStorage.getItem("wordPuzzleScore");
    if (savedScore) {
      setScore(parseInt(savedScore));
    }
  }, []);

  // Update available cards when puzzle changes
  useEffect(() => {
    if (initialPuzzle) {
      setAvailableCards(initialPuzzle.cards);
    }
  }, [initialPuzzle]);

  const rotateCard = (cardId: string) => {
    setAvailableCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              rotation: ((card.rotation + 90) % 360) as 0 | 90 | 180 | 270,
            }
          : card
      )
    );
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
    switch (card.rotation) {
      case 0:
        return {
          top: card.words[0],
          right: card.words[1],
          bottom: card.words[2],
          left: card.words[3],
        };

      case 90:
        return {
          top: card.words[1],
          right: card.words[2],
          bottom: card.words[3],
          left: card.words[0],
        };

      case 180:
        return {
          top: card.words[2],
          right: card.words[3],
          bottom: card.words[0],
          left: card.words[1],
        };

      case 270:
        return {
          top: card.words[3],
          right: card.words[0],
          bottom: card.words[1],
          left: card.words[2],
        };

      default:
        return {
          top: card.words[0],
          right: card.words[1],
          bottom: card.words[2],
          left: card.words[3],
        };
    }
  };

  const validateTopLeft = (solutions: PuzzleSlots, card: Card) => {
    const { top, left } = getCardByRotation(card);
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
    const { bottom, left } = getCardByRotation(card);

    return (
      solutions.left.words[1] === left && solutions.bottom.words[1] === bottom
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
      bottomRight: validateBottomLeft(solutions, placedCards.bottomLeft),
      bottomLeft: validateBottomRight(solutions, placedCards.bottomRight),
    };
  };

  const submitSolution = () => {
    const checkedSolutions = checkSolution();
    const newAttempts = numberOfAttempts + 1;
    const isCorrect =
      checkedSolutions.topLeft &&
      checkedSolutions.topRight &&
      checkedSolutions.bottomLeft &&
      checkedSolutions.bottomRight;
    let pointsEarned = 0;
    if (isCorrect) {
      if (newAttempts === 1) {
        pointsEarned = 6;
      } else if (newAttempts === 2) {
        pointsEarned = 5;
      } else {
        pointsEarned = 4; // All 4 pairs are correct
      }
    }

    setScore(pointsEarned);
    setCardsCorrectness(checkedSolutions);
    setNumberOfAttempts(newAttempts);

    localStorage.setItem("wordPuzzleScore", pointsEarned.toString());
  };

  const resetGame = () => {
    if (initialPuzzle) {
      setPlacedCards(defaultPlacedCards);
      setCurrentPuzzle(initialPuzzle);
      setAvailableCards(initialPuzzle.cards);
    }
  };

  return {
    placedCards,
    cardsCorrectness,
    score,
    numberOfAttempts,
    availableCards,
    rotateCard,
    placeCard,
    removeCard,
    submitSolution,
    resetGame,
  };
}
