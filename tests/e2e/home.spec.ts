import { expect, test } from "@playwright/test";

test("homepage renders primary content and daily challenge link", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Word Puzzle Game" }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "How to Play" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /let'?s dive in/i }),
  ).toBeVisible();
});
