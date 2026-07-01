import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, closeBrowser, clickByText, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Public Pages E2E", () => {
  it("homepage loads with correct title", async () => {
    const page = await newPage();
    await page.goto(url("/"), { waitUntil: "networkidle0" });
    const title = await page.title();
    expect(title).toContain("OwnWebify");
    await page.close();
  });

  it("services page shows pricing cards and currency toggle", async () => {
    const page = await newPage();
    await page.goto(url("/services"), { waitUntil: "networkidle0" });
    await waitForText(page, "Landing Page");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Landing Page");
    expect(text).toContain("Business Website");
    expect(text).toContain("E-Commerce");
    expect(text).toContain("Web Application");
    expect(text).toContain("USD");
    expect(text).toContain("INR");
    expect(text).toContain("CAD");
    await page.close();
  });

  it("services page switches to INR on toggle click", async () => {
    const page = await newPage();
    await page.goto(url("/services"), { waitUntil: "networkidle0" });
    await waitForText(page, "Landing Page");

    await clickByText(page, "button", "INR");
    await new Promise((r) => setTimeout(r, 500));

    const content = await page.content();
    expect(content).toContain("₹");
    await page.close();
  });

  it("about page loads with correct info", async () => {
    const page = await newPage();
    await page.goto(url("/about"), { waitUntil: "networkidle0" });

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Abhi");
    expect(text).toContain("Bengaluru");
    await page.close();
  });

  it("hire page shows multi-step form", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "networkidle0" });

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Contact Info");
    expect(text).toContain("Full Name");
    await page.close();
  });

  it("login page shows sign-in form", async () => {
    const page = await newPage();
    await page.goto(url("/login"), { waitUntil: "networkidle0" });

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Welcome Back");
    expect(text).toContain("Sign In");
    await page.close();
  });
});
