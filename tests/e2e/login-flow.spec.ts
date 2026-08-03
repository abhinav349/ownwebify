import { describe, it, expect, afterAll, inject } from "vitest";
import { newPage, url, login, closeBrowser, waitForText } from "./helpers";

const { adminEmail, adminPassword, clientEmail, clientPassword } =
  inject("testCredentials");

afterAll(async () => {
  await closeBrowser();
});

describe("Login Flow E2E", () => {
  it("admin can log in and reach admin dashboard", async () => {
    const page = await newPage();
    await login(page, adminEmail, adminPassword);

    expect(page.url()).toContain("/admin");
    await waitForText(page, "Dashboard");
    await page.close();
  }, 60000);

  it("client can log in and reach client dashboard", async () => {
    const page = await newPage();
    await login(page, clientEmail, clientPassword);

    expect(page.url()).toContain("/dashboard");
    await waitForText(page, "My Projects");
    await page.close();
  }, 60000);

  it("shows error for invalid credentials", async () => {
    const page = await newPage();
    await page.goto(url("/login"), { waitUntil: "domcontentloaded" });

    await page.type('input[id="email"]', "wrong@example.com");
    await page.type('input[id="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await waitForText(page, "Invalid email or password", 5000);
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Invalid email or password");
    await page.close();
  });
});
