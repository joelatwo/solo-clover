import Link from "next/link";
import styles from "./HomePage.module.css";

export default function HomePage() {
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
                  Each puzzle slot shows a clue and two words that should match
                  the card words on that side.
                </p>
              </div>
            </div>

            <div className={styles.ruleCard}>
              <div className={styles.ruleNumber}>4</div>
              <div className={styles.ruleContent}>
                <h3>Submit & Score</h3>
                <p>
                  Submit your solution to check if it's correct. Earn 6 points
                  for first try, 5 for second, or 1 point per correct match.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.scoring}>
          <h2>Scoring System</h2>
          <div className={styles.scoringTable}>
            <div className={styles.scoringRow}>
              <span className={styles.attempt}>1st Attempt</span>
              <span className={styles.points}>6 points</span>
            </div>
            <div className={styles.scoringRow}>
              <span className={styles.attempt}>2nd Attempt</span>
              <span className={styles.points}>5 points</span>
            </div>
            <div className={styles.scoringRow}>
              <span className={styles.attempt}>3rd+ Attempt</span>
              <span className={styles.points}>1 point per correct match</span>
            </div>
          </div>
        </section>

        <section className={styles.gameModes}>
          <h2>Choose Your Game Mode</h2>
          <div className={styles.modeCards}>
            <Link href="/puzzle" className={styles.modeCard}>
              <div className={styles.modeIcon}>🎯</div>
              <h3>Practice Puzzle</h3>
              <p>
                Play with the default puzzle to learn the game mechanics and
                practice your skills.
              </p>
              <div className={styles.modeButton}>Start Practice</div>
            </Link>

            <Link href="/daily" className={styles.modeCard}>
              <div className={styles.modeIcon}>📅</div>
              <h3>Daily Challenge</h3>
              <p>
                Take on today's unique puzzle. New challenges every day with
                different word combinations.
              </p>
              <div className={styles.modeButton}>Daily Challenge</div>
            </Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Your score is saved locally and persists across sessions.</p>
        </footer>
      </div>
    </div>
  );
}
