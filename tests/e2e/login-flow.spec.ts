import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, login, closeBrowser, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Login Flow E2E", () => {
  it("admin can log in and reach admin dashboard", async () => {
    const page = await newPage();
    await login(page, "admin@ownwebify.com", "admin123");

    expect(page.url()).toContain("/admin");
    await waitForText(page, "Dashboard");
    await page.close();
  }, 20000);

  it("client can log in and reach client dashboard", async () => {
    const page = await newPage();
    await login(page, "client@example.com", "client123");

    expect(page.url()).toContain("/dashboard");
    await waitForText(page, "My Projects");
    await page.close();
  }, 20000);

  it("shows error for invalid credentials", async () => {
    const page = await newPage();
    await page.goto(url("/login"), { waitUntil: "networkidle0" });

    await page.type('input[id="email"]', "wrong@example.com");
    await page.type('input[id="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await waitForText(page, "Invalid email or password", 5000);
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Invalid email or password");
    await page.close();
  });
});
