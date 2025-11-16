"use client";

import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType } from "@/types/game";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Puzzle from "./Puzzle";
import styles from "./WordPuzzleGame.module.css";

type Props = {
  initialPuzzle: PuzzleType;
};

export default function WordPuzzleGame({ initialPuzzle }: Props) {
  const [showResult, setShowResult] = useState<{
    isCorrect: boolean;
    pointsEarned: number;
  } | null>(null);

  const {
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
  } = useGameLogic(initialPuzzle);

  const handleSubmit = () => {
    const result = submitSolution();
    // setShowResult(result);

    // Hide result after 3 seconds
    setTimeout(() => {
      setShowResult(null);
    }, 3000);
  };

  const handleReset = () => {
    resetGame();
    setShowResult(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.gameContainer}>
        <div className={styles.header}>
          <h1>Word Puzzle Game</h1>
          <div className={styles.scoreInfo}>
            <div className={styles.score}>Score: {score}</div>
            <div className={styles.attempts}>
              Attempts: {numberOfAttempts}/3
            </div>
          </div>
        </div>

        {showResult && (
          <div
            className={`${styles.result} ${
              showResult.isCorrect ? styles.correct : styles.incorrect
            }`}
          >
            {showResult.isCorrect ? "Correct!" : "Incorrect!"}
            {showResult.pointsEarned > 0 &&
              ` +${showResult.pointsEarned} points`}
          </div>
        )}

        <div className={styles.gameArea}>
          <div className={styles.puzzleArea}>
            <Puzzle
              cardsCorrectness={cardsCorrectness}
              solutions={initialPuzzle.solutions}
              placedCards={placedCards}
              onCardDrop={placeCard}
              onCardRemove={removeCard}
            />
          </div>

          <div className={styles.cardsArea}>
            <h3>Available Cards</h3>
            <div className={styles.cardsGrid}>
              {availableCards.map((card) => (
                <Card key={card.id} card={card} onRotate={rotateCard} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            onClick={handleSubmit}
            disabled={numberOfAttempts === 3}
            className={styles.submitButton}
          >
            {score ? "Game Complete!" : "Submit Solution"}
          </button>

          <button onClick={handleReset} className={styles.resetButton}>
            Reset Game
          </button>
        </div>

        {score && (
          <div className={styles.gameComplete}>
            <h2>Game Complete!</h2>
            <p>Final Score: {score}</p>
            <p>Attempts Used: {numberOfAttempts}</p>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
