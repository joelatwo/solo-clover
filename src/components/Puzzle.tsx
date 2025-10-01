"use client";

import { useDrop } from "react-dnd";
import { Card as CardType, SlotPosition } from "@/types/game";
import Card from "./Card";
import styles from "./Puzzle.module.css";

interface PuzzleProps {
  puzzleSlots: {
    topLeft: { clue: string; words: [string, string] };
    topRight: { clue: string; words: [string, string] };
    bottomRight: { clue: string; words: [string, string] };
    bottomLeft: { clue: string; words: [string, string] };
  };
  placedCards: {
    topLeft: CardType | null;
    topRight: CardType | null;
    bottomRight: CardType | null;
    bottomLeft: CardType | null;
  };
  incorrectCards: {
    topLeft: boolean;
    topRight: boolean;
    bottomRight: boolean;
    bottomLeft: boolean;
  };
  onCardDrop: (card: CardType, position: SlotPosition) => void;
  onCardRemove: (position: SlotPosition) => void;
}

export default function Puzzle({
  puzzleSlots,
  placedCards,
  incorrectCards,
  onCardDrop,
  onCardRemove,
}: PuzzleProps) {
  const [{ isOver: isOverTopLeft }, dropTopLeft] = useDrop({
    accept: "card",
    drop: (item: { card: CardType }) => onCardDrop(item.card, "topLeft"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isOverTopRight }, dropTopRight] = useDrop({
    accept: "card",
    drop: (item: { card: CardType }) => onCardDrop(item.card, "topRight"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isOverBottomRight }, dropBottomRight] = useDrop({
    accept: "card",
    drop: (item: { card: CardType }) => onCardDrop(item.card, "bottomRight"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isOverBottomLeft }, dropBottomLeft] = useDrop({
    accept: "card",
    drop: (item: { card: CardType }) => onCardDrop(item.card, "bottomLeft"),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const renderSlot = (
    position: SlotPosition,
    slot: { clue: string; words: [string, string] },
    isOver: boolean
  ) => {
    const placedCard = placedCards[position];

    return (
      <div
        key={position}
        className={`${styles.slot} ${styles[position]} ${
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
        onClick={() => placedCard && onCardRemove(position)}
      >
        {placedCard ? (
          <div className={styles.cardContainer}>
            <Card
              card={placedCard}
              isPlaced={true}
              isIncorrect={incorrectCards[position]}
            />
            <div className={styles.removeHint}>Click to remove</div>
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
          className={styles.outerWord}
          style={{ top: "-10px", left: "50%", transform: "translateX(-50%)" }}
        >
          {puzzleSlots.topLeft.clue}
        </div>
        <div
          className={`${styles.outerWord} ${styles.rotated}`}
          style={{ right: "-10px", top: "50%", transform: "translateY(-50%)" }}
        >
          {puzzleSlots.topRight.clue}
        </div>
        <div
          className={styles.outerWord}
          style={{
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {puzzleSlots.bottomLeft.clue}
        </div>
        <div
          className={`${styles.outerWord} ${styles.rotated}`}
          style={{ left: "-10px", top: "50%", transform: "translateY(-50%)" }}
        >
          {puzzleSlots.bottomRight.clue}
        </div>

        {/* Grid slots */}
        {renderSlot("topLeft", puzzleSlots.topLeft, isOverTopLeft)}
        {renderSlot("topRight", puzzleSlots.topRight, isOverTopRight)}
        {renderSlot("bottomRight", puzzleSlots.bottomRight, isOverBottomRight)}
        {renderSlot("bottomLeft", puzzleSlots.bottomLeft, isOverBottomLeft)}
      </div>
    </div>
  );
}
