import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WordPuzzleGame from "./WordPuzzleGame";
import { PuzzleType } from "@/types/game";

jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: any }) => <>{children}</>,
  useDrop: () => [{ isOver: false }, jest.fn()],
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDragLayer: (collector: any) =>
    collector({
      isDragging: () => false,
      getClientOffset: () => null,
      getItemType: () => null,
      getItem: () => null,
    }),
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));

const initialPuzzle: PuzzleType = {
  id: "2026-01-01",
  cards: [
    { id: "tl", words: ["TT", "a", "b", "LL"], rotation: 0 },
    { id: "tr", words: ["TRT", "TRR", "c", "d"], rotation: 0 },
    { id: "br", words: ["e", "BRR", "BRB", "f"], rotation: 0 },
    { id: "bl", words: ["g", "h", "BLB", "BLL"], rotation: 0 },
  ],
  solutions: {
    top: { clue: "top", words: ["TT", "TRT"] },
    right: { clue: "right", words: ["TRR", "BRR"] },
    bottom: { clue: "bottom", words: ["BRB", "BLB"] },
    left: { clue: "left", words: ["LL", "BLL"] },
  },
};

const completedAttempts = [0, 1, 2].map((attempts) => ({
  placedCards: {
    topLeft: null,
    topRight: null,
    bottomRight: null,
    bottomLeft: null,
  },
  attempts,
  cardsCorrectness: {
    topLeft: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
  },
}));

const renderGame = () =>
  render(<WordPuzzleGame initialPuzzle={initialPuzzle} />);

describe("WordPuzzleGame UI interactions", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/puzzle/1-1-2026");
  });

  it("does not show Share until the completion modal opens", () => {
    renderGame();

    expect(
      screen.queryByRole("button", { name: /share/i }),
    ).not.toBeInTheDocument();
  });

  it("renders a feedback link to GitHub issues", () => {
    renderGame();

    expect(
      screen.getByRole("link", { name: /give feedback/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/joelatwo/solo-clover/issues/new",
    );
  });

  it("clicking Show Solution fills all slots using real components", async () => {
    localStorage.setItem("puzzle-1-1-2026", JSON.stringify(completedAttempts));

    renderGame();

    expect(
      await screen.findByRole("button", { name: /show solution/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/drop card here/i)).toHaveLength(4);

    fireEvent.click(screen.getByRole("button", { name: /show solution/i }));

    await waitFor(() => {
      expect(screen.queryByText(/drop card here/i)).toBeNull();
      expect(
        screen.getAllByText(/drag to move or click to remove/i),
      ).toHaveLength(4);
    });
  });
});
