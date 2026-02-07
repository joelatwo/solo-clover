"use client";

import { useDrag } from "react-dnd";
import { Card as CardType } from "@/types/game";
import { useState, useCallback } from "react";
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
  const [rotating, setRotating] = useState<"left" | "right" | null>(null);

  const [{ isDragging: isDragActive }, drag] = useDrag({
    type: "card",
    item: { id: card.id, card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPlaced,
  });

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (e.target !== e.currentTarget || !rotating) return;
      if (rotating === "right") {
        onRotateRight?.();
      } else if (rotating === "left") {
        onRotateLeft?.();
      }
      setRotating(null);
    },
    [rotating, onRotateLeft, onRotateRight]
  );

  const getWordAtPosition = (position: "top" | "right" | "bottom" | "left") => {
    const positions = ["top", "right", "bottom", "left"];
    const currentIndex = positions.indexOf(position);
    const rotatedIndex = (currentIndex + card.rotation / 90) % 4;
    return card.words[rotatedIndex];
  };

  return (
    <div
      ref={drag as any}
      className={`${styles.card} ${isDragActive ? styles.dragging : ""} ${
        isPlaced ? styles.placed : ""
      } ${isIncorrect ? styles.incorrect : ""} ${
        rotating
          ? styles[rotating === "right" ? "rotatingRight" : "rotatingLeft"]
          : ""
      }`}
      onAnimationEnd={handleAnimationEnd}
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
      {(onRotateLeft || onRotateRight) && (
        <>
          <button
            type="button"
            className={styles.rotateBtnLeft}
            disabled={!!rotating}
            onClick={(e) => {
              e.stopPropagation();
              if (onRotateLeft && !rotating) setRotating("left");
            }}
            aria-label="Rotate left"
          >
            <RotateLeftIcon />
          </button>
          <button
            type="button"
            className={styles.rotateBtnRight}
            disabled={!!rotating}
            onClick={(e) => {
              e.stopPropagation();
              if (onRotateRight && !rotating) setRotating("right");
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
