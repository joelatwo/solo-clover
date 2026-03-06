"use client";

import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType, SlotPosition, Card as CardType } from "@/types/game";
import { getDateKey } from "@/utils/Dates";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Puzzle from "./Puzzle";
import { ShareButton } from "./Share";
import styles from "./WordPuzzleGame.module.css";

type Props = {
  initialPuzzle: PuzzleType;
};

function CardBarDropZone({
  children,
  onCardDrop,
}: {
  children: React.ReactNode;
  onCardDrop: (card: CardType, sourcePosition: SlotPosition | null) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: "card",
    drop: (item: { card: CardType; sourcePosition?: SlotPosition | null }) => {
      onCardDrop(item.card, item.sourcePosition || null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop as any} style={isOver ? { opacity: 0.7 } : {}}>
      {children}
    </div>
  );
}

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

  const handleCardReturnToDrawer = (
    card: CardType,
    sourcePosition: SlotPosition | null,
  ) => {
    // If the card was dragged from a slot, remove it from that slot
    if (sourcePosition) {
      removeCard(sourcePosition);
    }
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

    return score > 0 || numberOfAttempts === 3;
  };

  const isGameComplete = () => {
    return score > 0 || numberOfAttempts === 3;
  };

  useEffect(() => {
    // Load the current day puzzle from local storage
    const { savedGameState, numberOfAttempts } = getLocalStorage();

    const currentSolution = savedGameState.at(-1);

    if (currentSolution) {
      restoreGameState(currentSolution, numberOfAttempts);
    }
  }, []);

  const getCurrentDateKey = () => {
    const today = new Date();
    return `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
  };

  const isToday = getCurrentDateKey() === initialPuzzle.id;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
          <a
            href="https://github.com/joelatwo/solo-clover/issues/new"
            target="_blank"
            rel="noreferrer"
            className={styles.feedbackButton}
            data-tooltip="This goes straight to me, and I’ll take a look as soon as I can."
          >
            Give Feedback
          </a>
          {!isToday && (
            <Link
              href={`/puzzle/${getCurrentDateKey()}`}
              className={styles.todayButton}
            >
              Go to Today
            </Link>
          )}
        </div>
        <h1>{getDateKey(new Date(initialPuzzle.id))}</h1>
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

          <CardBarDropZone onCardDrop={handleCardReturnToDrawer}>
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
          </CardBarDropZone>

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

              <ShareButton getLocalStorage={getLocalStorage} />
            </div>
          )}
        </div>
      </DndProvider>
    </>
  );
}
