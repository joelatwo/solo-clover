"use client";

import WordPuzzleGame from "@/components/WordPuzzleGame";
import gameData from "@/data/puzzles";
import { PuzzleType } from "@/types/game";
import { RandomizePuzzleSetup } from "@/utils/Initialization";
import { GetStaticProps } from "next";
import styles from "./page.module.css";

export function getStaticPaths() {
  const paths = gameData.map((puzzle, index) => ({
    params: {
      id: String(index),
    },
  }));
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = (context) => {
  const id = context?.params?.id;
  const puzzle = gameData[Number(id)];
  if (puzzle) {
    return {
      props: { puzzle: { ...RandomizePuzzleSetup(puzzle), id: Number(id) } },
    };
  }

  return { notFound: true };
};

type Props = {
  puzzle: PuzzleType;
};

const Page = ({ puzzle }: Props) => {
  return (
    <div className={styles.container}>
      {<WordPuzzleGame initialPuzzle={puzzle} />}
    </div>
  );
};

export default Page;
