"use client";

import { useGameLogic } from "@/hooks/useGameLogic";
import { PuzzleType, SlotPosition, Card as CardType } from "@/types/game";
import { getDateKey } from "@/utils/Dates";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { DndProvider, useDragLayer, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Puzzle from "./Puzzle";
import { ShareButton } from "./Share";
import styles from "./WordPuzzleGame.module.css";

type Props = {
  initialPuzzle: PuzzleType;
};

type DraggedCardItem = {
  card: CardType;
  sourcePosition?: SlotPosition | null;
};

function CardBarDragController({
  isEnabled,
  isCardBarOpen,
  setIsCardBarOpen,
}: {
  isEnabled: boolean;
  isCardBarOpen: boolean;
  setIsCardBarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { isDragging, clientOffset, itemType, item } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      clientOffset: monitor.getClientOffset(),
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
    }),
  );

  useEffect(() => {
    if (!isEnabled || !isDragging || itemType !== "card" || !clientOffset) {
      return;
    }

    const draggedCard = item as DraggedCardItem | null;
    const isDraggedFromDrawer = !draggedCard?.sourcePosition;

    if (typeof window === "undefined") {
      return;
    }

    const openThresholdFromRight = 90;
    const closeThresholdFromRight = 220;
    const distanceFromRight = window.innerWidth - clientOffset.x;

    if (distanceFromRight <= openThresholdFromRight && !isCardBarOpen) {
      setIsCardBarOpen(true);
      return;
    }

    if (
      isDraggedFromDrawer &&
      distanceFromRight >= closeThresholdFromRight &&
      isCardBarOpen
    ) {
      setIsCardBarOpen(false);
    }
  }, [
    clientOffset,
    isEnabled,
    isCardBarOpen,
    isDragging,
    item,
    itemType,
    setIsCardBarOpen,
  ]);

  return null;
}

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
  const [isCardBarAutoEnabled, setIsCardBarAutoEnabled] = useState(true);
  const [showComeBackModal, setShowComeBackModal] = useState(false);
  const completionTriggeredBySubmitRef = useRef(false);
  const wasGameCompleteRef = useRef(false);
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
    completionTriggeredBySubmitRef.current = true;
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

  const getComeBackMessage = () => {
    if (score === 6) {
      return "Perfect score! Come back tomorrow for a new puzzle.";
    }

    if (score === 5) {
      return "Great job! Come back tomorrow and aim for perfect.";
    }

    if (score === 4) {
      return "Nice work finishing today’s puzzle. Come back tomorrow for another.";
    }

    return "Good effort today. Come back tomorrow for a fresh puzzle.";
  };

  useEffect(() => {
    const gameComplete = isGameComplete();

    if (
      completionTriggeredBySubmitRef.current &&
      gameComplete &&
      !wasGameCompleteRef.current &&
      score >= 0
    ) {
      setShowComeBackModal(true);
      completionTriggeredBySubmitRef.current = false;
    }

    if (!gameComplete) {
      completionTriggeredBySubmitRef.current = false;
    }

    wasGameCompleteRef.current = gameComplete;
  }, [score, numberOfAttempts]);

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
        <CardBarDragController
          isEnabled={isCardBarAutoEnabled}
          isCardBarOpen={isCardBarOpen}
          setIsCardBarOpen={setIsCardBarOpen}
        />
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
                <button
                  type="button"
                  className={styles.cardBarAutoToggle}
                  onClick={() =>
                    setIsCardBarAutoEnabled((isEnabled) => !isEnabled)
                  }
                  aria-pressed={!isCardBarAutoEnabled}
                  aria-label="Toggle automatic card drawer behavior"
                >
                  Auto Drawer: {isCardBarAutoEnabled ? "On" : "Off"}
                </button>
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

          {showComeBackModal ? (
            <div
              className={styles.modalOverlay}
              role="dialog"
              aria-modal="true"
              aria-labelledby="come-back-modal-title"
              onClick={() => setShowComeBackModal(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="come-back-modal-title">Game Complete!</h2>
                <p>{getComeBackMessage()}</p>
                <button
                  type="button"
                  className={styles.modalButton}
                  onClick={() => setShowComeBackModal(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </DndProvider>
    </>
  );
}
