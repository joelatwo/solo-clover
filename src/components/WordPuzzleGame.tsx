"use client";

import { useEffect, useState } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType } from "@/types/game";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Puzzle from "./Puzzle";
import styles from "./WordPuzzleGame.module.css";
import Link from "next/link";
import { getDateKey } from "@/utils/Dates";

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
    restoreGameState,
    getLocalStorage,
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

    return score > 0 || numberOfAttempts.length === 3;
  };

  const isGameComplete = () => {
    if (score === null) {
      return false;
    }

    return score > 0 || numberOfAttempts.length === 3;
  };

  useEffect(() => {
    // Load the current day puzzle from local storage
    const { dateKey, storageKey, savedGameState } = getLocalStorage();

    console.log("📂 Loading game state for date:", dateKey);
    console.log("🔍 Storage key:", storageKey);
    console.log("💾 Saved game state:", savedGameState);

    if (savedGameState) {
      try {
        const {
          placedCards: savedPlacedCards,
          attempts: savedAttempts,
          cardsCorrectness: savedCardsCorrectness,
        } = savedGameState;

        console.log("✅ Parsed game state:", savedGameState);
        console.log("📍 Placed cards:", savedPlacedCards);
        console.log("🎯 Attempts:", savedAttempts);
        console.log("✔️ Cards correctness:", savedCardsCorrectness);

        // Restore the game state with placed cards, attempts, and correctness
        if (
          savedPlacedCards &&
          savedAttempts !== undefined &&
          savedCardsCorrectness
        ) {
          console.log("🔄 Restoring game state...");
          restoreGameState(
            savedPlacedCards,
            savedAttempts,
            savedCardsCorrectness,
          );
        } else {
          console.warn("⚠️ Missing required game state data");
        }
      } catch (error) {
        console.error(
          "❌ Failed to restore game state from localStorage:",
          error,
        );
      }
    } else {
      console.log("ℹ️ No saved game state found. Starting fresh.");
    }
  }, []);

  return (
    <>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div className={styles.scoreInfo}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.attempts}>
            Attempts: {numberOfAttempts.length}/3
          </div>
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
              <p>Attempts Used: {numberOfAttempts.length}</p>
            </div>
          )}
        </div>
      </DndProvider>
    </>
  );
}
