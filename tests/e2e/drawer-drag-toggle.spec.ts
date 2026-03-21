import { expect, Page, test } from "@playwright/test";

const getDrawerToggle = (page: Page) =>
  page.getByRole("button", { name: "Toggle available cards" }).first();

const loadPuzzlePage = async (page: Page): Promise<void> => {
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await page.goto("/puzzle/0", { waitUntil: "domcontentloaded" });

    const drawerToggle = getDrawerToggle(page);
    const isDrawerVisible = await drawerToggle
      .isVisible({ timeout: 4000 })
      .catch(() => false);

    if (isDrawerVisible) {
      return;
    }

    await page.waitForTimeout(250);
  }

  throw new Error("Puzzle page did not load expected controls after retries.");
};

const ensureDrawerClosed = async (page: Page): Promise<void> => {
  const toggle = getDrawerToggle(page);
  await expect(toggle).toBeVisible();

  if ((await toggle.getAttribute("aria-expanded")) === "true") {
    await toggle.click();
  }

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
};

test("card drawer closes and reopens while dragging from drawer", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await loadPuzzlePage(page);

  const drawer = page.locator('[class*="cardBar"]').first();
  const drawerToggle = getDrawerToggle(page);
  await expect(drawerToggle).toBeVisible();
  await expect(drawerToggle).toHaveAttribute("aria-expanded", "true");

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

  await expect(drawerToggle).toHaveAttribute("aria-expanded", "false");

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const openX = viewport!.width - 20;
  await page.mouse.move(openX, startY, { steps: 16 });

  await expect(drawerToggle).toHaveAttribute("aria-expanded", "true");

  await page.mouse.up();
});

test("card drawer reopens when dragging placed card toward sidebar", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await loadPuzzlePage(page);

  const drawer = page.locator('[class*="cardBar"]').first();
  const drawerToggle = getDrawerToggle(page);
  await expect(drawerToggle).toBeVisible();

  const drawerCard = page.locator('[class*="cardWrapper"]').first();
  const topLeftSlot = page.locator('[class*="topLeft"]').first();

  await drawerCard.dragTo(topLeftSlot);
  await expect(
    topLeftSlot.locator('[class*="cardWrapper"]').first(),
  ).toBeVisible();

  await ensureDrawerClosed(page);

  const placedCard = topLeftSlot.locator('[class*="cardWrapper"]').first();
  const placedCardBox = await placedCard.boundingBox();
  expect(placedCardBox).not.toBeNull();

  const startX = placedCardBox!.x + placedCardBox!.width / 2;
  const startY = placedCardBox!.y + placedCardBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const openX = viewport!.width - 20;
  await page.mouse.move(openX, startY, { steps: 16 });

  await expect(drawerToggle).toHaveAttribute("aria-expanded", "true");
  await page.mouse.up();
});
