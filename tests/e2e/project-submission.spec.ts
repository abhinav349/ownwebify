import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, closeBrowser, clickByText, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Project Submission Flow E2E", () => {
  it("completes full hire form and submits successfully", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "networkidle0" });

    // Step 1: Contact Info
    await page.type('input[id="name"]', "E2E Puppeteer User");
    await page.type('input[id="email"]', `e2e-pup-${Date.now()}@test.com`);
    await page.type('input[id="password"]', "testpass123");

    await clickByText(page, "button", "Next");
    // Wait for step 2 to render
    await page.waitForSelector('select[id="projectType"]', { timeout: 5000 });

    // Step 2: Project Details
    await page.select('select[id="projectType"]', "business-site");
    await page.type('input[id="title"]', "E2E Puppeteer Test Site");
    await page.type(
      'textarea[id="description"]',
      "This is an end-to-end test with puppeteer and system Chrome browser."
    );
    await clickByText(page, "button", "Next");
    // Wait for step 3 to render
    await page.waitForSelector('select[id="budget"]', { timeout: 5000 });

    // Step 3: Budget & Timeline
    await page.select('select[id="budget"]', "200-300");
    await page.select('select[id="timeline"]', "1-2-weeks");
    await page.click('button[type="submit"]');

    // Wait for success - use "All Set" to avoid unicode apostrophe issues
    await waitForText(page, "All Set", 15000);
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("All Set");
    expect(text).toContain("Your account is ready");
    await page.close();
  }, 30000);

  it("validates required fields before proceeding", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "networkidle0" });

    await clickByText(page, "button", "Next");
    await new Promise((r) => setTimeout(r, 500));

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("must be at least");
    await page.close();
  });
});
