"use client";

import { useDrag } from "react-dnd";
import { Card as CardType } from "@/types/game";
import { useState } from "react";
import styles from "./Card.module.css";

interface CardProps {
  card: CardType;
  isPlaced?: boolean;
  isIncorrect?: boolean;
  onRotate?: (cardId: string) => void;
}

export default function Card({
  card,
  isPlaced = false,
  isIncorrect = false,
  onRotate,
}: CardProps) {
  const [{ isDragging: isDragActive }, drag] = useDrag({
    type: "card",
    item: { id: card.id, card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPlaced,
  });

  const handleRotate = () => {
    if (onRotate) {
      onRotate(card.id);
    }
  };

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
      } ${isIncorrect ? styles.incorrect : ""}`}
      onClick={handleRotate}
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
      {!isPlaced && <div className={styles.rotateHint}>Click to rotate</div>}
    </div>
  );
}
