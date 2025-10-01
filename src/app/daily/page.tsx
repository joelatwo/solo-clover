"use client";

import { useState, useEffect } from "react";
import WordPuzzleGame from "@/components/WordPuzzleGame";
import Link from "next/link";
import styles from "./page.module.css";
import { Puzzle } from "@/types/game";
import gameData from "@/data/puzzles.json";

export default function DailyPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, use the first puzzle as daily puzzle
    // Later this can be based on actual date
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // For testing, cycle through puzzles based on day of week
    const puzzleIndex = dayOfWeek % gameData.puzzles.length;
    setCurrentPuzzle(gameData.puzzles[puzzleIndex] as Puzzle);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
          <h1>Daily Challenge</h1>
        </div>
        <div className={styles.loading}>Loading today's puzzle...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <div className={styles.titleSection}>
          <h1>Daily Challenge</h1>
          <p className={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      {currentPuzzle && <WordPuzzleGame initialPuzzle={currentPuzzle} />}
    </div>
  );
}
