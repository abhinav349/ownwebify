import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, closeBrowser, clickByText, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Referral System E2E", () => {
  it("hire form has referral code input field", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "networkidle0" });

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Referral Code");
    expect(text).toContain("10% off");
    await page.close();
  });

  it("services page shows referral banner", async () => {
    const page = await newPage();
    await page.goto(url("/services"), { waitUntil: "networkidle0" });
    await waitForText(page, "Know someone who needs a website?");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Know someone who needs a website?");
    expect(text).toContain("10% off");
    await page.close();
  });

  it("submitting with a valid referral code works", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "networkidle0" });

    // Step 1 with referral code
    await page.type('input[id="name"]', "Referral E2E User");
    await page.type('input[id="email"]', `ref-e2e-${Date.now()}@test.com`);
    await page.type('input[id="password"]', "reftest123");
    await page.type('input[id="referralCode"]', "SARA-J7K2");
    await clickByText(page, "button", "Next");
    await page.waitForSelector('select[id="projectType"]', { timeout: 5000 });

    // Step 2
    await page.select('select[id="projectType"]', "landing-page");
    await page.type('input[id="title"]', "Referral E2E Project");
    await page.type(
      'textarea[id="description"]',
      "Testing the referral system end to end with a valid referral code."
    );
    await clickByText(page, "button", "Next");
    await page.waitForSelector('select[id="budget"]', { timeout: 5000 });

    // Step 3
    await page.select('select[id="budget"]', "under-100");
    await page.select('select[id="timeline"]', "flexible");
    await page.click('button[type="submit"]');

    await waitForText(page, "All Set", 15000);
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("All Set");
    await page.close();
  }, 30000);
});
