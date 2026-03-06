import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
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
});
