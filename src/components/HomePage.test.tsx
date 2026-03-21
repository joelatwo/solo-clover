import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

const diveInButtonMatcher = /let.*dive in/i;

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the main heading", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /word puzzle game/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders a feedback link to GitHub issues", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: /give feedback/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/joelatwo/solo-clover/issues/new",
    );
  });

  it("links to puzzle 0 when no puzzle has been completed", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: diveInButtonMatcher }),
    ).toHaveAttribute("href", "/puzzle/0");
  });

  it("links to puzzle 1 when puzzle 0 has any saved data", () => {
    localStorage.setItem(
      "puzzle-0",
      JSON.stringify([
        {
          placedCards: {},
          attempts: 0,
          cardsCorrectness: {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false,
          },
        },
      ]),
    );

    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: diveInButtonMatcher }),
    ).toHaveAttribute("href", "/puzzle/1");
  });

  it("links to puzzle 1 when localStorage has puzzle-3-1-2026 and puzzle-0", () => {
    localStorage.setItem(
      "puzzle-3-1-2026",
      JSON.stringify([
        {
          placedCards: {},
          attempts: 0,
          cardsCorrectness: {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false,
          },
        },
      ]),
    );

    localStorage.setItem(
      "puzzle-0",
      JSON.stringify([
        {
          placedCards: {},
          attempts: 1,
          cardsCorrectness: {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false,
          },
        },
      ]),
    );

    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: diveInButtonMatcher }),
    ).toHaveAttribute("href", "/puzzle/1");
  });
});
