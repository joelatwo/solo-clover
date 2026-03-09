import { expect, Locator, Page, test } from "@playwright/test";

const SLOT_SELECTORS = {
  topLeft: '[class*="topLeft"]',
  topRight: '[class*="topRight"]',
  bottomRight: '[class*="bottomRight"]',
  bottomLeft: '[class*="bottomLeft"]',
} as const;

const loadPuzzlePage = async (page: Page): Promise<void> => {
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await page.goto("/puzzle/3-1-2026", { waitUntil: "domcontentloaded" });

    const drawerToggle = page
      .getByRole("button", { name: "Toggle available cards" })
      .first();

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

const disableAutoCardDrawer = async (page: Page): Promise<void> => {
  const autoToggle = page.getByRole("button", {
    name: "Toggle automatic card drawer behavior",
  });

  await expect(autoToggle).toBeVisible();
  await expect(autoToggle).toContainText(/Auto Drawer:/i);

  if ((await autoToggle.textContent())?.includes("On")) {
    await autoToggle.click();
    await expect(autoToggle).toContainText("Auto Drawer: Off");
  }
};

const ensureCardBarOpen = async (page: Page): Promise<void> => {
  const toggle = page
    .getByRole("button", { name: "Toggle available cards" })
    .first();

  await expect(toggle).toBeVisible();

  const expanded = await toggle.getAttribute("aria-expanded");
  if (expanded !== "true") {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }
};

const getCardRotation = async (cardRoot: Locator): Promise<number> => {
  const styleValue = await cardRoot
    .locator('[class*="card"]')
    .first()
    .evaluate((el) => {
      return (el as HTMLElement).style.transform || "";
    });

  const match = styleValue.match(/rotate\((-?\d+)deg\)/);
  if (!match) return 0;

  const normalized = ((Number(match[1]) % 360) + 360) % 360;
  return normalized;
};

const rotateCardToZero = async (cardRoot: Locator): Promise<void> => {
  let rotation = await getCardRotation(cardRoot);

  for (let i = 0; i < 4 && rotation !== 0; i++) {
    const rotateRightButton = cardRoot.getByRole("button", {
      name: "Rotate right",
    });

    await expect(rotateRightButton).toBeAttached();
    await rotateRightButton.evaluate((button: HTMLButtonElement) => {
      button.click();
    });

    rotation = await getCardRotation(cardRoot);
  }

  expect(rotation).toBe(0);
};

const moveCardToSlot = async (
  page: Page,
  uniqueWord: string,
  slotSelector: string,
) => {
  await ensureCardBarOpen(page);

  const cardRoot = page
    .locator('[class*="cardWrapper"]')
    .filter({ has: page.getByText(uniqueWord, { exact: true }) })
    .first();

  await expect(cardRoot).toBeVisible();
  await rotateCardToZero(cardRoot);

  const targetSlot = page.locator(slotSelector).first();
  await expect(targetSlot).toBeVisible();

  await cardRoot.dragTo(targetSlot);

  const placedCard = targetSlot.locator('[class*="cardWrapper"]').first();
  await expect(placedCard).toBeVisible();
  await expect(placedCard.getByText(uniqueWord, { exact: true })).toBeVisible();

  const placedRotation = await getCardRotation(placedCard);
  expect(placedRotation).toBe(0);
};

const fillBoard = async (
  page: Page,
  layout: {
    topLeft: string;
    topRight: string;
    bottomRight: string;
    bottomLeft: string;
  },
) => {
  await moveCardToSlot(page, layout.topLeft, SLOT_SELECTORS.topLeft);
  await moveCardToSlot(page, layout.topRight, SLOT_SELECTORS.topRight);
  await moveCardToSlot(page, layout.bottomRight, SLOT_SELECTORS.bottomRight);
  await moveCardToSlot(page, layout.bottomLeft, SLOT_SELECTORS.bottomLeft);
};

test("3-1-2026 puzzle can be solved and submitted", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await loadPuzzlePage(page);
  await disableAutoCardDrawer(page);

  await moveCardToSlot(page, "framework", SLOT_SELECTORS.topLeft);
  await moveCardToSlot(page, "weapon", SLOT_SELECTORS.topRight);
  await moveCardToSlot(page, "barbies", SLOT_SELECTORS.bottomRight);
  await moveCardToSlot(page, "ought", SLOT_SELECTORS.bottomLeft);

  const submitButton = page.getByRole("button", { name: "Submit Solution" });
  await expect(submitButton).toBeEnabled();

  await submitButton.click();

  await expect(page.getByText("Final Score: 6")).toBeVisible();
  await expect(page.getByText("Attempts Used: 1")).toBeVisible();
});

test("3-1-2026 allows three incorrect submissions and reveal hint/solution", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await loadPuzzlePage(page);
  await disableAutoCardDrawer(page);

  const submitButton = page.getByRole("button", { name: "Submit Solution" });

  await fillBoard(page, {
    topLeft: "binding",
    topRight: "framework",
    bottomRight: "weapon",
    bottomLeft: "barbies",
  });
  await submitButton.click();
  await expect(page.getByText("Attempts: 1/3")).toBeVisible();

  await page.getByRole("button", { name: "Reset Game" }).click();

  await fillBoard(page, {
    topLeft: "weapon",
    topRight: "ought",
    bottomRight: "framework",
    bottomLeft: "binding",
  });
  await submitButton.click();
  await expect(page.getByText("Attempts: 2/3")).toBeVisible();

  await page.getByRole("button", { name: "Reset Game" }).click();

  await fillBoard(page, {
    topLeft: "barbies",
    topRight: "binding",
    bottomRight: "ought",
    bottomLeft: "framework",
  });
  await submitButton.click();

  await expect(page.getByText("Final Score: 0")).toBeVisible();
  await expect(page.getByText("Attempts Used: 3")).toBeVisible();

  const revealButton = page
    .getByRole("button", { name: /Show Hint|Show Solution/i })
    .first();
  await expect(revealButton).toBeVisible();
  await revealButton.click();

  const topLeftSlot = page.locator(SLOT_SELECTORS.topLeft).first();
  await expect(
    topLeftSlot.getByText("framework", { exact: true }),
  ).toBeVisible();
});
