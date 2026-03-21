import styles from "../components/HomePage.module.css";

export default function Custom404() {
  return (
    <main style={{ padding: "2rem", margin: "0 auto" }}>
      <section className={styles.support}>
        <h1>🎉 Congrats!</h1>
        <p>You&apos;ve reached the end of the current puzzles.</p>
      </section>
      <div style={{ display: "flex" }}>
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
    </main>
  );
}
