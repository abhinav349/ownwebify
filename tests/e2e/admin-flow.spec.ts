import { describe, it, expect, afterAll } from "vitest";
import { newPage, login, closeBrowser, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Admin Flow E2E", () => {
  it("admin dashboard shows stats cards", async () => {
    const page = await newPage();
    await login(page, "admin@ownwebify.com", "admin123");
    await waitForText(page, "Total Projects");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Total Projects");
    expect(text).toContain("Active Projects");
    expect(text).toContain("Total Clients");
    expect(text).toContain("Revenue");
    await page.close();
  }, 20000);

  it("admin can navigate to projects page", async () => {
    const page = await newPage();
    await login(page, "admin@ownwebify.com", "admin123");

    await page.click('a[href="/admin/projects"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    expect(page.url()).toContain("/admin/projects");
    await page.close();
  }, 20000);

  it("admin can navigate to clients page", async () => {
    const page = await newPage();
    await login(page, "admin@ownwebify.com", "admin123");

    await page.click('a[href="/admin/clients"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    expect(page.url()).toContain("/admin/clients");
    await page.close();
  }, 20000);
});
