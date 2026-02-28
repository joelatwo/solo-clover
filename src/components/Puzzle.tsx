"use client";

import { useDrop } from "react-dnd";
import {
  CardCorrectnessType,
  Card as CardType,
  PlacedCardsType,
  SlotPosition,
} from "@/types/game";
import { RotateDirection } from "@/hooks/useGameLogic";
import Card from "./Card";
import styles from "./Puzzle.module.css";

interface PuzzleProps {
  solutions: {
    top: { clue: string; words: [string, string] };
    right: { clue: string; words: [string, string] };
    bottom: { clue: string; words: [string, string] };
    left: { clue: string; words: [string, string] };
  };
  placedCards: PlacedCardsType;
  onCardDrop: (card: CardType, position: SlotPosition, sourcePosition?: SlotPosition | null) => void;
  onCardRemove: (position: SlotPosition) => void;
  onRotatePlacedCard?: (
    position: SlotPosition,
    direction: RotateDirection
  ) => void;
  cardsCorrectness: CardCorrectnessType | null | undefined;
}

export default function Puzzle({
  solutions,
  placedCards,
  onCardDrop,
  onCardRemove,
  onRotatePlacedCard,
  cardsCorrectness,
}: PuzzleProps) {
  const [{ isOver: isOverTopLeft }, dropTopLeft] = useDrop({
    accept: "card",
    drop: (item: { card: CardType; sourcePosition?: SlotPosition | null }) => onCardDrop(item.card, "topLeft", item.sourcePosition),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isOverTopRight }, dropTopRight] = useDrop({
    accept: "card",
    drop: (item: { card: CardType; sourcePosition?: SlotPosition | null }) => onCardDrop(item.card, "topRight", item.sourcePosition),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isOverBottomRight }, dropBottomRight] = useDrop({
    accept: "card",
    drop: (item: { card: CardType; sourcePosition?: SlotPosition | null }) => onCardDrop(item.card, "bottomRight", item.sourcePosition),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isOverBottomLeft }, dropBottomLeft] = useDrop({
    accept: "card",
    drop: (item: { card: CardType; sourcePosition?: SlotPosition | null }) => onCardDrop(item.card, "bottomLeft", item.sourcePosition),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const renderSlot = (position: SlotPosition, isOver: boolean) => {
    const placedCard = placedCards[position];

    const getClassBasedOnCardCorrectness = () => {
      if (cardsCorrectness === null || cardsCorrectness === undefined) {
        return styles.unsubmitted;
      }

      return cardsCorrectness[position] === true
        ? styles.correct
        : styles.incorrect;
    };

    return (
      <div
        key={position}
        className={`${styles.slot} ${
          styles[position]
        } ${getClassBasedOnCardCorrectness()} ${
          isOver ? styles.dropTarget : ""
        }`}
        ref={
          position === "topLeft"
            ? (dropTopLeft as any)
            : position === "topRight"
              ? (dropTopRight as any)
              : position === "bottomRight"
                ? (dropBottomRight as any)
                : (dropBottomLeft as any)
        }
      >
        {placedCard ? (
          <div className={`${styles.cardContainer}`}>
            <Card
              card={placedCard}
              isPlaced={true}
              sourcePosition={position}
              isIncorrect={cardsCorrectness?.[position] === false}
              onRotateLeft={
                onRotatePlacedCard
                  ? () => onRotatePlacedCard(position, "left")
                  : undefined
              }
              onRotateRight={
                onRotatePlacedCard
                  ? () => onRotatePlacedCard(position, "right")
                  : undefined
              }
              onCardRemove={() => {
                onCardRemove(position);
              }}
            />
            <div className={styles.removeHint}>Drag to move or click to remove</div>
          </div>
        ) : (
          <div className={styles.dropZone}>Drop card here</div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.puzzle}>
      <div className={styles.puzzleGrid}>
        {/* Words positioned outside the grid */}
        <div
          className={`${styles.outerWord} ${styles.outerWordTop} ${styles.outerWordLabel}`}
        >
          {solutions.top.clue}
        </div>
        <div
          className={`${styles.outerWord} ${styles.outerWordRight} ${styles.outerWordLabel} ${styles.rotated}`}
        >
          {solutions.right.clue}
        </div>
        <div
          className={`${styles.outerWord} ${styles.outerWordBottom} ${styles.outerWordLabel}`}
        >
          {solutions.bottom.clue}
        </div>
        <div
          className={`${styles.outerWord} ${styles.outerWordLeft} ${styles.outerWordLabel} ${styles.rotated}`}
        >
          {solutions.left.clue}
        </div>

        {/* Grid slots */}
        {renderSlot("topLeft", isOverTopLeft)}
        {renderSlot("topRight", isOverTopRight)}
        {renderSlot("bottomRight", isOverBottomRight)}
        {renderSlot("bottomLeft", isOverBottomLeft)}
      </div>
    </div>
  );
}
