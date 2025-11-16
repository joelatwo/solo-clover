"use client";

import WordPuzzleGame from "@/components/WordPuzzleGame";
import gameData from "@/data/puzzles";
import { PuzzleType } from "@/types/game";
import { RandomizePuzzleSetup } from "@/utils/Initialization";
import { GetStaticProps } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export function getStaticPaths() {
  const paths = gameData.map((puzzle) => ({
    params: {
      id: puzzle.id,
    },
  }));
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = (context) => {
  const id = context?.params?.id;
  const puzzle = gameData.find((data) => data.id === id);
  if (puzzle) {
    return { props: { puzzle: RandomizePuzzleSetup(puzzle) } };
  }

  return { notFound: true };
};

type Props = {
  puzzle: PuzzleType;
};

const Page = ({ puzzle }: Props) => {
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
      {<WordPuzzleGame initialPuzzle={puzzle} />}
    </div>
  );
};

export default Page;
