import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, closeBrowser, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Referral System E2E", () => {
  it("hire form has referral code input field", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "networkidle0" });

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Referral Code");
    await page.close();
  });

  it("services page shows referral banner", async () => {
    const page = await newPage();
    await page.goto(url("/services"), { waitUntil: "networkidle0" });
    await waitForText(page, "Know someone who needs a website?");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Know someone who needs a website?");
    await page.close();
  });
});
