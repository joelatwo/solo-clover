import { expect, test } from "@playwright/test";

test("card drawer closes and reopens while dragging from drawer", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto("/puzzle/3-1-2026");

  const drawer = page
    .locator('[class*="cardBar"]')
    .filter({ has: page.getByText("Available Cards", { exact: true }) })
    .first();

  await expect(drawer).toHaveClass(/cardBarOpen/);

  const cardRoot = page.locator('[class*="cardWrapper"]').first();
  await expect(cardRoot).toBeVisible();

  const cardBox = await cardRoot.boundingBox();
  expect(cardBox).not.toBeNull();

  const startX = cardBox!.x + cardBox!.width / 2;
  const startY = cardBox!.y + cardBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  const closedX = Math.max(startX - 320, 120);
  await page.mouse.move(closedX, startY, { steps: 12 });

  await expect(drawer).not.toHaveClass(/cardBarOpen/);

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const openX = viewport!.width - 20;
  await page.mouse.move(openX, startY, { steps: 16 });

  await expect(drawer).toHaveClass(/cardBarOpen/);

  await page.mouse.up();
});
