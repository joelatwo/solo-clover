import { act, renderHook } from "@testing-library/react";
import { useGameLogic } from "./useGameLogic";
import { PuzzleType } from "@/types/game";

jest.mock("@/utils/Dates", () => ({
  ...jest.requireActual("@/utils/Dates"),
  getDateKeyFromUrl: jest.fn(() => "1-1-2026"),
}));

const puzzleFixture: PuzzleType = {
  id: "p1",
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

describe("useGameLogic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with puzzle cards in availableCards", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));

    expect(result.current.availableCards).toHaveLength(4);
    expect(result.current.numberOfAttempts).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.placedCards.topLeft).toBeNull();
  });

  it("rotates available cards with wrap-around", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));

    act(() => {
      result.current.rotateCard("tl", "right");
    });
    expect(result.current.availableCards.find((c) => c.id === "tl")?.rotation).toBe(
      90,
    );

    act(() => {
      result.current.rotateCard("tl", "left");
    });
    expect(result.current.availableCards.find((c) => c.id === "tl")?.rotation).toBe(
      0,
    );

    act(() => {
      result.current.rotateCard("tl", "left");
    });
    expect(result.current.availableCards.find((c) => c.id === "tl")?.rotation).toBe(
      270,
    );
  });

  it("places and removes a card between available and board", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));
    const firstCard = result.current.availableCards[0];

    act(() => {
      result.current.placeCard(firstCard, "topLeft");
    });

    expect(result.current.placedCards.topLeft?.id).toBe(firstCard.id);
    expect(result.current.availableCards.map((c) => c.id)).not.toContain(firstCard.id);

    act(() => {
      result.current.removeCard("topLeft");
    });

    expect(result.current.placedCards.topLeft).toBeNull();
    expect(result.current.availableCards.map((c) => c.id)).toContain(firstCard.id);
  });

  it("submits a correct solution, updates score, attempts, and localStorage", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));
    const cards = puzzleFixture.cards;

    act(() => {
      result.current.placeCard(cards[0], "topLeft");
      result.current.placeCard(cards[1], "topRight");
      result.current.placeCard(cards[2], "bottomRight");
      result.current.placeCard(cards[3], "bottomLeft");
    });

    act(() => {
      result.current.submitSolution();
    });

    expect(result.current.cardsCorrectness).toEqual({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    });
    expect(result.current.score).toBe(6);
    expect(result.current.numberOfAttempts).toBe(1);

    const saved = JSON.parse(localStorage.getItem("puzzle-1-1-2026") || "[]");
    expect(saved).toHaveLength(1);
    expect(saved[0].cardsCorrectness).toEqual({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    });
  });

  it("clears only affected slot validation when a card is removed after submission", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));
    const cards = puzzleFixture.cards;

    act(() => {
      result.current.placeCard(cards[0], "topLeft");
      result.current.placeCard(cards[1], "topRight");
      result.current.placeCard(cards[2], "bottomRight");
      result.current.placeCard(cards[3], "bottomLeft");
    });

    act(() => {
      result.current.submitSolution();
    });

    expect(result.current.cardsCorrectness).toEqual({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    });

    act(() => {
      result.current.removeCard("topLeft");
    });

    expect(result.current.cardsCorrectness).toEqual({
      topLeft: null,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    });
  });

  it("clears only affected slot validation when a new card is placed", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));
    const cards = puzzleFixture.cards;

    act(() => {
      result.current.placeCard(cards[0], "topLeft");
      result.current.placeCard(cards[1], "topRight");
      result.current.placeCard(cards[2], "bottomRight");
      result.current.placeCard(cards[3], "bottomLeft");
    });

    act(() => {
      result.current.submitSolution();
    });

    const replacement = { ...cards[0], id: "replacement" };

    act(() => {
      result.current.placeCard(replacement, "topLeft");
    });

    expect(result.current.cardsCorrectness).toEqual({
      topLeft: null,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    });
  });

  it("returns empty saved state when localStorage is malformed", () => {
    localStorage.setItem("puzzle-1-1-2026", "not-json");
    const { result } = renderHook(() => useGameLogic(puzzleFixture));

    const storageState = result.current.getLocalStorage();

    expect(storageState.savedGameState).toEqual([]);
    expect(storageState.storageKey).toBe("puzzle-1-1-2026");
  });

  it("showAnswer places a valid solved board and clears available cards", () => {
    const { result } = renderHook(() => useGameLogic(puzzleFixture));

    act(() => {
      result.current.showAnswer();
    });

    expect(result.current.placedCards.topLeft).not.toBeNull();
    expect(result.current.placedCards.topRight).not.toBeNull();
    expect(result.current.placedCards.bottomRight).not.toBeNull();
    expect(result.current.placedCards.bottomLeft).not.toBeNull();
    expect(result.current.availableCards).toHaveLength(0);
    expect(result.current.cardsCorrectness).toEqual({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    });
  });

  it("showAnswer is a no-op when no initial puzzle exists", () => {
    const { result } = renderHook(() => useGameLogic(null));

    act(() => {
      result.current.showAnswer();
    });

    expect(result.current.availableCards).toEqual([]);
    expect(result.current.placedCards).toEqual({
      topLeft: null,
      topRight: null,
      bottomRight: null,
      bottomLeft: null,
    });
    expect(result.current.cardsCorrectness).toBeUndefined();
  });
});
