import WordPuzzleGame from "@/components/WordPuzzleGame";
import Link from "next/link";
import styles from "./page.module.css";
import gameData from "@/data/puzzles";

export default function PuzzlePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>Practice Puzzle</h1>
      </div>
      <WordPuzzleGame initialPuzzle={gameData[0]} />
    </div>
  );
}
