import { describe, it, expect, afterAll } from "vitest";
import { newPage, login, closeBrowser, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Client Flow E2E", () => {
  it("client dashboard shows projects list", async () => {
    const page = await newPage();
    await login(page, "client@example.com", "client123");
    await waitForText(page, "My Projects");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("My Projects");
    expect(text).toContain("Corporate Website Redesign");
    await page.close();
  }, 20000);

  it("client dashboard shows referral section", async () => {
    const page = await newPage();
    await login(page, "client@example.com", "client123");
    await waitForText(page, "My Projects");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Your Referral Code");
    expect(text).toContain("Referral Balance");
    expect(text).toContain("People Referred");
    expect(text).toContain("SARA-J7K2");
    await page.close();
  }, 20000);

  it("client can click on a project to see details", async () => {
    const page = await newPage();
    await login(page, "client@example.com", "client123");
    await waitForText(page, "Corporate Website Redesign");

    await page.click('a[href*="/dashboard/projects/"]');
    // Next.js uses client-side navigation, wait for URL change
    await page.waitForFunction(
      () => window.location.pathname.includes("/dashboard/projects/"),
      { timeout: 10000 }
    );
    await page.waitForNetworkIdle({ idleTime: 500 });

    expect(page.url()).toContain("/dashboard/projects/");
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Corporate Website Redesign");
    await page.close();
  }, 20000);
});
