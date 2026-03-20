import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SavedGameState } from "@/types/game";
import { ShareButton } from "./Share";

const savedGameState: SavedGameState[] = [
  {
    placedCards: {
      topLeft: null,
      topRight: null,
      bottomRight: null,
      bottomLeft: null,
    },
    attempts: 1,
    cardsCorrectness: {
      topLeft: true,
      topRight: false,
      bottomLeft: true,
      bottomRight: false,
    },
  },
];

const getLocalStorage = () => ({
  dateKey: "3-18-2026",
  storageKey: "puzzle-3-18-2026",
  savedGameState,
  numberOfAttempts: 1,
});

describe("ShareButton", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("is disabled when sharing is unavailable", () => {
    render(<ShareButton getLocalStorage={getLocalStorage} canShare={false} />);

    expect(screen.getByRole("button", { name: /share/i })).toBeDisabled();
  });

  it("copies the formatted result and shows feedback", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<ShareButton getLocalStorage={getLocalStorage} canShare={true} />);

    fireEvent.click(screen.getByRole("button", { name: /share/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "Solo Clover 3-18-2026: 2 Points\n🟩🟥\n🟩🟥",
      );
    });

    expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
  });
});
