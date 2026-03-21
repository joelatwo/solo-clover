"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import gameData from "@/data/puzzles";

const isPuzzleComplete = (puzzleIndex: number) => {
  const savedGameState = localStorage.getItem(`puzzle-${puzzleIndex}`);

  if (!savedGameState) {
    return false;
  }

  try {
    const attempts = JSON.parse(savedGameState);

    return Array.isArray(attempts) && attempts.length > 0;
  } catch (_error) {
    return false;
  }
};

const getNextPuzzleIndex = () => {
  for (let index = 0; index < gameData.length; index++) {
    if (!isPuzzleComplete(index)) {
      return index;
    }
  }

  return 0;
};

export default function HomePage() {
  const [nextPuzzleIndex, setNextPuzzleIndex] = useState(0);

  useEffect(() => {
    setNextPuzzleIndex(getNextPuzzleIndex());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Word Puzzle Game</h1>
          <p className={styles.subtitle}>
            A challenging word puzzle where you match cards to solve clues
          </p>
        </header>

        <section className={styles.rules}>
          <h2>How to Play</h2>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleCard}>
              <div className={styles.ruleNumber}>1</div>
              <div className={styles.ruleContent}>
                <h3>Drag & Drop Cards</h3>
                <p>
                  Drag cards from the available area to the puzzle slots. Each
                  card has 4 words positioned around its edges.
                </p>
              </div>
            </div>

            <div className={styles.ruleCard}>
              <div className={styles.ruleNumber}>2</div>
              <div className={styles.ruleContent}>
                <h3>Rotate Cards</h3>
                <p>
                  Click on cards to rotate them in 90° increments. Align the
                  correct words with the puzzle clues.
                </p>
              </div>
            </div>

            <div className={styles.ruleCard}>
              <div className={styles.ruleNumber}>3</div>
              <div className={styles.ruleContent}>
                <h3>Match the Clues</h3>
                <p>
                  The two words on the outside of each side should relate to
                  that side&apos;s clue: the top two words match the top clue,
                  the right two match the right clue, and so on. The
                  inner-facing words do not matter.
                </p>
              </div>
            </div>

            <div className={styles.ruleCard}>
              <div className={styles.ruleNumber}>4</div>
              <div className={styles.ruleContent}>
                <h3>Submit & Score</h3>
                <p>
                  Submit your solution to check if it&apos;s correct. Earn 6
                  points for first try, 5 for second, or 1 point per correct
                  match.
                </p>
              </div>
            </div>
          </div>
          <Link href={`/puzzle/${nextPuzzleIndex}`} className={styles.modeCard}>
            <div className={styles.modeButton}>Let&apos;s Dive In</div>
          </Link>
        </section>

        <section className={styles.feedback}>
          <h2>Have a suggestion or found a bug?</h2>
          <p>
            Send feedback directly through GitHub Issues. It helps make each
            puzzle better.
          </p>
          <a
            href="https://github.com/joelatwo/solo-clover/issues/new"
            target="_blank"
            rel="noreferrer"
            className={styles.feedbackButton}
            data-tooltip="This goes straight to me, and I’ll take a look as soon as I can."
          >
            Give Feedback
          </a>
        </section>
        <section className={styles.support}>
          <h2>Love the game? Support the creator</h2>
          <p>
            If you enjoy Word Puzzle Game, consider buying me a coffee to help
            support development.
          </p>
          <a
            href="https://ko-fi.com/foreveroom"
            target="_blank"
            rel="noreferrer"
            className={styles.modeButton}
          >
            Support Me on Ko-fi
          </a>
        </section>
      </div>
    </div>
  );
}
