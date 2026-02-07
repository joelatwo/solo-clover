"use client";

import { useState } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType } from "@/types/game";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Puzzle from "./Puzzle";
import styles from "./WordPuzzleGame.module.css";

type Props = {
  initialPuzzle: PuzzleType;
};

export default function WordPuzzleGame({ initialPuzzle }: Props) {
  const [isCardBarOpen, setIsCardBarOpen] = useState(true);
  const {
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
  } = useGameLogic(initialPuzzle);

  const handleSubmit = () => {
    submitSolution();
  };

  const handleReset = () => {
    resetGame();
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

        {score !== null && (
          <div
            className={`${styles.result} ${
              score > 0 ? styles.correct : styles.incorrect
            }`}
          >
            {`Score: ${score} points`}
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
              onRotatePlacedCard={rotatePlacedCard}
            />
          </div>
        </div>

        <div
          className={`${styles.cardBar} ${
            isCardBarOpen ? styles.cardBarOpen : styles.cardBarClosed
          }`}
        >
          <button
            type="button"
            className={styles.cardBarToggle}
            onClick={() => setIsCardBarOpen((open) => !open)}
            aria-expanded={isCardBarOpen}
          >
            <span className={styles.cardBarTitle}>Available Cards</span>
            <span className={styles.cardBarChevron}>
              {isCardBarOpen ? "▼" : "▲"}
            </span>
          </button>
          <div className={styles.cardBarContent}>
            <div className={styles.cardsGrid}>
              {availableCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onRotateLeft={() => rotateCard(card.id, "left")}
                  onRotateRight={() => rotateCard(card.id, "right")}
                />
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
            {score === null ? "Game Complete!" : "Submit Solution"}
          </button>

          <button onClick={handleReset} className={styles.resetButton}>
            Reset Game
          </button>
        </div>

        {score !== null && (
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
