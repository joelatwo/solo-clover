"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
import Card from "./Card";
import Puzzle from "./Puzzle";
import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType } from "@/types/game";
import gameData from "@/data/puzzles";
import styles from "./WordPuzzleGame.module.css";

type Props = {
  initialPuzzle: PuzzleType;
};

export default function WordPuzzleGame({ initialPuzzle }: Props) {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType>(initialPuzzle);
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
  } = useGameLogic(currentPuzzle);

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

  if (!currentPuzzle) {
    return <div className={styles.loading}>Loading puzzle...</div>;
  }

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
              solutions={currentPuzzle.solutions}
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
            // disabled={
            //   gameLogic.gameState.isComplete ||
            //   Object.values(gameLogic.gameState.placedCards).some(
            //     (card) => card === null
            //   )
            // }
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
