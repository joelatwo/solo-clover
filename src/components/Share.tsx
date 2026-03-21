import { SavedGameState } from "@/types/game";
import { useState } from "react";
import styles from "./Share.module.css";

type Props = {
  getLocalStorage: () => {
    id: string;
    storageKey: string;
    savedGameState: SavedGameState[];
    numberOfAttempts: number;
  };
  canShare: boolean;
};

export const ShareButton = ({ getLocalStorage, canShare }: Props) => {
  const [copied, setCopied] = useState(false);

  const formatSavedGameStates = (states: SavedGameState[], id?: string) => {
    const map = (v: boolean | null | undefined) => (v === true ? "🟩" : "🟥");

    const body = states
      .map((s) => {
        const c = s.cardsCorrectness;
        const line1 = `${map(c.topLeft)}${map(c.topRight)}`;
        const line2 = `${map(c.bottomLeft)}${map(c.bottomRight)}`;
        return `${line1}\n${line2}`;
      })
      .join("\n\n");

    // total points = total green squares across all saved attempts
    const points = states.reduce((acc, s) => {
      const c = s.cardsCorrectness;
      return (
        acc +
        (c.topLeft ? 1 : 0) +
        (c.topRight ? 1 : 0) +
        (c.bottomLeft ? 1 : 0) +
        (c.bottomRight ? 1 : 0)
      );
    }, 0);

    const header = `Solo Clover Puzzle #${id}: ${points} Points`;

    // single newline after header (remove extra blank line)
    return `${header}\n${body}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore copy errors
    }
  };
  return (
    <div className={styles.shareContainer}>
      <button
        className={styles.shareButton}
        disabled={!canShare}
        onClick={() => {
          if (!canShare) {
            return;
          }

          const localStorage = getLocalStorage();
          const formatted = formatSavedGameStates(
            localStorage.savedGameState || [],
            localStorage.id,
          );
          if (formatted) {
            copyToClipboard(formatted);
          }
        }}
      >
        Share
      </button>
      {copied ? <div className={styles.copiedMessage}>Copied!</div> : null}
    </div>
  );
};
