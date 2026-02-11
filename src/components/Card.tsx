"use client";

import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { Card as CardType } from "@/types/game";
import styles from "./Card.module.css";

interface CardProps {
  card: CardType;
  isPlaced?: boolean;
  isIncorrect?: boolean;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}

const RotateLeftIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const RotateRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

export default function Card({
  card,
  isPlaced = false,
  isIncorrect = false,
  onRotateLeft,
  onRotateRight,
}: CardProps) {
  const [{ isDragging: isDragActive }, drag] = useDrag({
    type: "card",
    item: { id: card.id, card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPlaced,
  });

  // Animation: add/subtract 90 from current position on each rotate (no sync to card.rotation, so no full spin).
  const [displayRotation, setDisplayRotation] = useState<number>(card.rotation);
  useEffect(() => {
    setDisplayRotation(card.rotation);
  }, [card.id]);

  const rotationDeg = displayRotation + (isDragActive ? 5 : 0);

  // Data is fixed: words[0]=top, words[1]=right, words[2]=bottom, words[3]=left.
  // Rotation is visual only (CSS transform on the card).
  const getWordAtPosition = (position: "top" | "right" | "bottom" | "left") => {
    const index = { top: 0, right: 1, bottom: 2, left: 3 }[position];
    return card.words[index];
  };

  return (
    <div ref={drag as any} className={styles.cardWrapper}>
      <div
        className={`${styles.card} ${isDragActive ? styles.dragging : ""} ${
          isPlaced ? styles.placed : ""
        } ${isIncorrect ? styles.incorrect : ""}`}
        style={{
          transform: `rotate(${rotationDeg}deg)`,
        }}
      >
        <div className={`${styles.word} ${styles.wordTop}`}>
          {getWordAtPosition("top")}
        </div>
        <div className={`${styles.word} ${styles.wordRight}`}>
          {getWordAtPosition("right")}
        </div>
        <div className={`${styles.word} ${styles.wordBottom}`}>
          {getWordAtPosition("bottom")}
        </div>
        <div className={`${styles.word} ${styles.wordLeft}`}>
          {getWordAtPosition("left")}
        </div>
      </div>
      {(onRotateLeft || onRotateRight) && (
        <>
          <button
            type="button"
            className={styles.rotateBtnLeft}
            onClick={(e) => {
              e.stopPropagation();
              setDisplayRotation((prev) => prev - 90);
              onRotateLeft?.();
            }}
            aria-label="Rotate left"
          >
            <RotateLeftIcon />
          </button>
          <button
            type="button"
            className={styles.rotateBtnRight}
            onClick={(e) => {
              e.stopPropagation();
              setDisplayRotation((prev) => prev + 90);
              onRotateRight?.();
            }}
            aria-label="Rotate right"
          >
            <RotateRightIcon />
          </button>
        </>
      )}
    </div>
  );
}
