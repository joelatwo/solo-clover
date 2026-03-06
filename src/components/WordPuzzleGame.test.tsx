import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WordPuzzleGame from "./WordPuzzleGame";
import { PuzzleType } from "@/types/game";

jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: any }) => <>{children}</>,
  useDrop: () => [{ isOver: false }, jest.fn()],
  useDrag: () => [{ isDragging: false }, jest.fn()],
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

describe("WordPuzzleGame UI interactions", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/puzzle/1-1-2026");
  });

  it("renders a feedback link to GitHub issues", () => {
    render(<WordPuzzleGame initialPuzzle={initialPuzzle} />);

    expect(
      screen.getByRole("link", { name: /give feedback/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/joelatwo/solo-clover/issues/new",
    );
  });

  it("clicking Show Solution fills all slots using real components", async () => {
    localStorage.setItem(
      "puzzle-1-1-2026",
      JSON.stringify([
        {
          placedCards: {
            topLeft: null,
            topRight: null,
            bottomRight: null,
            bottomLeft: null,
          },
          attempts: 0,
          cardsCorrectness: {
            topLeft: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
          },
        },
        {
          placedCards: {
            topLeft: null,
            topRight: null,
            bottomRight: null,
            bottomLeft: null,
          },
          attempts: 1,
          cardsCorrectness: {
            topLeft: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
          },
        },
        {
          placedCards: {
            topLeft: null,
            topRight: null,
            bottomRight: null,
            bottomLeft: null,
          },
          attempts: 2,
          cardsCorrectness: {
            topLeft: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
          },
        },
      ]),
    );

    render(<WordPuzzleGame initialPuzzle={initialPuzzle} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /show solution/i }),
      ).not.toBeNull();
    });

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
