import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, closeBrowser, clickByText, waitForText } from "./helpers";
import { TEST_EMAIL_DOMAIN } from "../constants";

afterAll(async () => {
  await closeBrowser();
});

describe("Project Submission Flow E2E", () => {
  // The guest flow is four steps: Contact Info, Project Details, Features,
  // Budget & Timeline. This previously assumed three and typed into a
  // password field on step one — intake stopped collecting a password when
  // account setup moved to the emailed single-use link, and "Features" was
  // added between details and budget.
  it("completes full hire form and submits successfully", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "domcontentloaded" });
    // The form is client-rendered, and its buttons do nothing until React has
    // hydrated. `domcontentloaded` fires before that, so wait for step one to
    // actually be on screen before touching it.
    await page.waitForSelector('input[id="name"]');
    await waitForText(page, "Contact Info");

    // Step 1: Contact Info. The address uses the reserved test domain so the
    // global teardown reclaims the user and project this creates.
    await page.type('input[id="name"]', "E2E Puppeteer User");
    await page.type(
      'input[id="email"]',
      `e2e-hire-${Date.now()}@${TEST_EMAIL_DOMAIN}`
    );
    await clickByText(page, "button", "Next");

    // Step 2: Project Details
    await page.waitForSelector('select[id="projectType"]', { timeout: 5000 });
    await page.select('select[id="projectType"]', "business-site");
    await page.type('input[id="title"]', "E2E Puppeteer Test Site");
    await page.type(
      'textarea[id="description"]',
      "This is an end-to-end test with puppeteer and system Chrome browser."
    );
    await clickByText(page, "button", "Next");

    // Step 3: Features — optional, nothing is required to move on.
    await waitForText(page, "What do you need?");
    await clickByText(page, "button", "Next");

    // Step 4: Budget & Timeline
    await page.waitForSelector('select[id="budget"]', { timeout: 5000 });
    await page.select('select[id="budget"]', "200-350");
    await page.select('select[id="timeline"]', "1-2-weeks");
    await page.click('button[type="submit"]');

    // "All Set" avoids the unicode apostrophe in "You're All Set!".
    await waitForText(page, "All Set", 20000);
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("All Set");
    expect(text).toContain("received your project details");
    await page.close();
  }, 60000);

  it("validates required fields before proceeding", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "domcontentloaded" });
    // The form is client-rendered, and its buttons do nothing until React has
    // hydrated. `domcontentloaded` fires before that, so wait for step one to
    // actually be on screen before touching it.
    await page.waitForSelector('input[id="name"]');
    await waitForText(page, "Contact Info");

    await clickByText(page, "button", "Next");
    await waitForText(page, "must be at least", 5000);

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("must be at least");

    // Still on step one rather than advanced past the invalid fields.
    expect(text).toContain("Full Name");
    await page.close();
  }, 60000);
});
