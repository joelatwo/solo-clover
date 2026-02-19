"use client";

import { useState } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType } from "@/types/game";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Puzzle from "./Puzzle";
import styles from "./WordPuzzleGame.module.css";
import Link from "next/link";

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
    showAnswer,
  } = useGameLogic(initialPuzzle);

  const handleSubmit = () => {
    submitSolution();
  };

  const handleReset = () => {
    resetGame();
  };

  const isSubmissionDisabled = () => {
    // Validate that all slots are filled. & that we have a valid puzzle
    if (!placedCards) {
      return true;
    }

    if (
      !placedCards.topLeft ||
      !placedCards.topRight ||
      !placedCards.bottomLeft ||
      !placedCards.bottomRight
    ) {
      return true;
    }

    console.log("score", score);

    if (score === null) {
      return false;
    }

    return score > 0 || numberOfAttempts === 3;
  };

  const isGameComplete = () => {
    if (score === null) {
      return false;
    }

    return score > 0 || numberOfAttempts === 3;
  };

  return (
    <>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div className={styles.scoreInfo}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.attempts}>Attempts: {numberOfAttempts}/3</div>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.gameContainer}>
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
              aria-label="Toggle available cards"
            >
              <span className={styles.cardBarChevron}>
                {isCardBarOpen ? "▶" : "◀"}
              </span>
              <span className={styles.cardBarTitle}>Available Cards</span>
            </button>
            <div className={styles.cardBarContent}>
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

          <div className={styles.controls}>
            <button
              onClick={handleSubmit}
              disabled={isGameComplete() || isSubmissionDisabled()}
              className={styles.submitButton}
            >
              {isGameComplete() ? "Game Complete!" : "Submit Solution"}
            </button>

            {!isGameComplete() ? (
              <button onClick={handleReset} className={styles.resetButton}>
                Reset Game
              </button>
            ) : null}

            {isGameComplete() ? (
              <button onClick={showAnswer} className={styles.showAnswerButton}>
                Show Solution
              </button>
            ) : null}
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
    </>
  );
}
