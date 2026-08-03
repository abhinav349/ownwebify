import { describe, it, expect, afterAll, inject } from "vitest";
import { newPage, login, closeBrowser, waitForText, clickVisible } from "./helpers";

const { adminEmail, adminPassword } = inject("testCredentials");

afterAll(async () => {
  await closeBrowser();
});

describe("Admin Flow E2E", () => {
  it("admin dashboard shows stats cards", async () => {
    const page = await newPage();
    await login(page, adminEmail, adminPassword);
    await waitForText(page, "Total Projects");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Total Projects");
    expect(text).toContain("Active Projects");
    expect(text).toContain("Total Clients");
    expect(text).toContain("Revenue");
    await page.close();
  }, 60000);

  it("admin can navigate to projects page", async () => {
    const page = await newPage();
    await login(page, adminEmail, adminPassword);

    await clickVisible(page, 'a[href="/admin/projects"]');
    // App Router link clicks are client-side transitions — no document
    // navigation happens, so `waitForNavigation` never resolves. Wait for
    // the route itself to settle instead.
    await page.waitForFunction(
      () => window.location.pathname === "/admin/projects"
    );

    expect(page.url()).toContain("/admin/projects");
    await page.close();
  }, 60000);

  it("admin can navigate to clients page", async () => {
    const page = await newPage();
    await login(page, adminEmail, adminPassword);

    await clickVisible(page, 'a[href="/admin/clients"]');
    await page.waitForFunction(
      () => window.location.pathname === "/admin/clients"
    );

    expect(page.url()).toContain("/admin/clients");
    await page.close();
  }, 60000);
});
