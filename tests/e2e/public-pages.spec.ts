import { describe, it, expect, afterAll } from "vitest";
import { newPage, url, closeBrowser, waitForText } from "./helpers";

afterAll(async () => {
  await closeBrowser();
});

describe("Public Pages E2E", () => {
  it("homepage loads with its marketing title and branding", async () => {
    const page = await newPage();
    await page.goto(url("/"), { waitUntil: "domcontentloaded" });

    // The homepage sets an `absolute` title so the root layout's
    // "%s | OwnWebify" template does not append a second brand suffix to a
    // title that is already brand-led. The brand itself is asserted from the
    // page chrome rather than the tab title.
    const title = await page.title();
    expect(title).toContain("Website Development");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("OwnWebify");
    await page.close();
  });

  it("services page shows the pricing tiers", async () => {
    const page = await newPage();
    await page.goto(url("/services"), { waitUntil: "domcontentloaded" });
    await waitForText(page, "Landing Page");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Landing Page");
    expect(text).toContain("Business Website");
    expect(text).toContain("E-Commerce");
    expect(text).toContain("Web Application");
    await page.close();
  });

  // The page used to carry a USD/INR/CAD toggle; currency is now resolved
  // from geo, with `?currency=` as the documented override (see
  // use-currency.ts). That override is what this exercises.
  it("services page renders prices in the requested currency", async () => {
    const page = await newPage();
    await page.goto(url("/services?currency=INR"), {
      waitUntil: "domcontentloaded",
    });
    await waitForText(page, "Landing Page");
    await waitForText(page, "₹");

    const inr = await page.evaluate(() => document.body.innerText);
    expect(inr).toContain("₹");
    await page.close();

    const usdPage = await newPage();
    await usdPage.goto(url("/services?currency=USD"), {
      waitUntil: "domcontentloaded",
    });
    await waitForText(usdPage, "Landing Page");
    await waitForText(usdPage, "$");

    const usd = await usdPage.evaluate(() => document.body.innerText);
    expect(usd).toContain("$");
    await usdPage.close();
  }, 60000);

  it("about page loads with correct info", async () => {
    const page = await newPage();
    await page.goto(url("/about"), { waitUntil: "domcontentloaded" });
    await waitForText(page, "Bengaluru");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Abhi");
    expect(text).toContain("Bengaluru");
    await page.close();
  });

  it("hire page shows multi-step form", async () => {
    const page = await newPage();
    await page.goto(url("/hire"), { waitUntil: "domcontentloaded" });
    await waitForText(page, "Full Name");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Contact Info");
    expect(text).toContain("Full Name");
    await page.close();
  });

  it("login page shows sign-in form", async () => {
    const page = await newPage();
    await page.goto(url("/login"), { waitUntil: "domcontentloaded" });
    await waitForText(page, "Welcome Back");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("Welcome Back");
    expect(text).toContain("Sign In");
    await page.close();
  });
});
