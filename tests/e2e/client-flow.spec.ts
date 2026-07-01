import { describe, it, expect, afterAll } from "vitest";
import { newPage, login, closeBrowser, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Client Flow E2E", () => {
  it("client dashboard loads after login", async () => {
    const page = await newPage();
    await login(page, "admin@ownwebify.com", "admin123");
    await waitForText(page, "Dashboard");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Dashboard");
    await page.close();
  }, 20000);
});
