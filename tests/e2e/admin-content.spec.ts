import { describe, it, expect, afterAll, inject } from "vitest";
import { newPage, login, closeBrowser, url } from "./helpers";

const { adminEmail, adminPassword } = inject("testCredentials");

afterAll(async () => {
  await closeBrowser();
});

/**
 * The portfolio and testimonials admin pages load their lists from a client
 * effect, which is the one shape that can fail silently: a rejected request or
 * a loader that never resolves leaves the page pinned under its spinner, and
 * every assertion about "the page rendered" still passes. These two specs
 * assert the spinner is *gone* and one of the two real end states is on screen.
 */
async function assertListSettles(path: string, emptyCopy: string) {
  const page = await newPage();
  await login(page, adminEmail, adminPassword);
  await page.goto(url(path), { waitUntil: "domcontentloaded" });

  // The loading spinner is the only `.animate-spin` on these routes.
  await page.waitForFunction(
    () => !document.querySelector(".animate-spin"),
    { timeout: 30000 }
  );

  const text = await page.evaluate(() => document.body.innerText);
  const rendered = await page.evaluate(
    () => document.querySelectorAll("main .grid > *").length
  );

  // Either the empty state or at least one row — never a blank frame.
  expect(text.includes(emptyCopy) || rendered > 0).toBe(true);

  await page.close();
  return text;
}

describe("Admin content pages E2E", () => {
  it("portfolio list finishes loading", async () => {
    const text = await assertListSettles(
      "/admin/portfolio",
      "No portfolio items yet"
    );
    expect(text).toContain("Portfolio");
  }, 60000);

  it("testimonials list finishes loading", async () => {
    const text = await assertListSettles(
      "/admin/testimonials",
      "No testimonials yet"
    );
    expect(text).toContain("Testimonials");
  }, 60000);
});
