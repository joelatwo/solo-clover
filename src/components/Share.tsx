import { SavedGameState } from "@/types/game";
import { useState } from "react";
import styles from "./Share.module.css";

type Props = {
  getLocalStorage: () => {
    dateKey: string;
    storageKey: string;
    savedGameState: SavedGameState[];
    numberOfAttempts: number;
  };
};

export const ShareButton = ({ getLocalStorage }: Props) => {
  const [copied, setCopied] = useState(false);

  const formatSavedGameStates = (
    states: SavedGameState[],
    dateKey?: string,
  ) => {
    const map = (v: boolean) => (v ? "🟩" : "🟥");

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

    // format date as M-D-YYYY if possible, otherwise use provided string
    const formatDate = (dk?: string) => {
      if (!dk) {
        const d = new Date();
        return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
      }
      const parsed = new Date(dk);
      if (!isNaN(parsed.getTime())) {
        return `${parsed.getMonth() + 1}-${parsed.getDate()}-${parsed.getFullYear()}`;
      }
      return dk;
    };

    const date = formatDate(dateKey);
    const header = `Solo Clover ${date}: ${points} Points`;

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
    <>
      <button
        className={styles.shareButton}
        onClick={() => {
          const localStorage = getLocalStorage();
          const formatted = formatSavedGameStates(
            localStorage.savedGameState || [],
            localStorage.dateKey,
          );
          if (formatted) {
            copyToClipboard(formatted);
          }
        }}
      >
        Share
      </button>
      {copied ? (
        <div style={{ marginLeft: 8, color: "black" }}>Copied!</div>
      ) : null}
    </>
  );
};
