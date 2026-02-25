"use client";

import { useEffect } from "react";
import WordPuzzleGame from "@/components/WordPuzzleGame";
import { data } from "@/data/unprocecssed";
import { PuzzleType } from "@/types/game";
import { RandomizePuzzleSetup } from "@/utils/Initialization";
import { GetStaticProps } from "next";
import styles from "../puzzle/page.module.css";

export function getStaticPaths() {
  if (process.env.NODE_ENV !== "development") {
    return { paths: [], fallback: false };
  }

  const paths = data.map((_puzzle, index) => ({
    params: {
      id: `${index}`,
    },
  }));

  return { paths, fallback: false };
}

const getIdAsNumber = (idString: string | string[] | undefined) => {
  if (idString === undefined) {
    return 0;
  }

  if (Array.isArray(idString)) {
    return parseInt(idString[0]);
  }

  return parseInt(idString);
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = getIdAsNumber(context?.params?.id);
  const puzzle = data[id];
  if (puzzle) {
    console.log(puzzle);
    return { props: { puzzle: RandomizePuzzleSetup(puzzle), dateString: id } };
  }

  return { notFound: true };
};

type Props = {
  puzzle: PuzzleType;
};

const Page = ({ puzzle }: Props) => {
  useEffect(() => {
    // Clear all localStorage on mount
    localStorage.clear();

    // Override localStorage methods to prevent any storage
    const noOpStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };

    // Replace localStorage with no-op version
    Object.defineProperty(window, "localStorage", {
      value: noOpStorage,
      writable: false,
    });
  }, []);

  return (
    <div className={styles.container}>
      {<WordPuzzleGame initialPuzzle={puzzle} />}
    </div>
  );
};

export default Page;
