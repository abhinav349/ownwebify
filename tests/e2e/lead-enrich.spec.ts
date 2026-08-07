import { describe, it, expect, afterAll, beforeAll, inject } from "vitest";
import { newPage, login, closeBrowser, waitForText, clickByText } from "./helpers";
import { prisma } from "@/lib/prisma";

const { adminEmail, adminPassword } = inject("testCredentials");

// Reserved id so the fixture can never collide with, or be mistaken for, a
// real saved lead.
const FIXTURE_PLACE_ID = "osm:node/999000001";
const FIXTURE_NAME = "E2E Enrich Fixture";

beforeAll(async () => {
  await prisma.lead.deleteMany({ where: { placeId: FIXTURE_PLACE_ID } });
  await prisma.lead.create({
    data: {
      placeId: FIXTURE_PLACE_ID,
      businessName: FIXTURE_NAME,
      address: "Halifax, NS",
      website: "https://reddoorrealty.ca/",
      searchQuery: "e2e fixture",
    },
  });
});

afterAll(async () => {
  await prisma.lead.deleteMany({ where: { placeId: FIXTURE_PLACE_ID } });
  await closeBrowser();
});

describe("Lead contact enrichment", () => {
  it("finds an email from the lead's website and fills it in", async () => {
    const page = await newPage();
    await login(page, adminEmail, adminPassword);

    await page.goto("http://localhost:3002/admin/leads/saved", {
      waitUntil: "domcontentloaded",
    });

    // The banner counts every lead with a site and no address, so it should
    // be present with at least the fixture in it.
    await waitForText(page, "a website but no email address");

    // Narrow to the fixture so the click below can't land on a real lead.
    await page.waitForSelector('input[placeholder*="Search saved leads"]');
    await page.type('input[placeholder*="Search saved leads"]', FIXTURE_NAME);
    await waitForText(page, FIXTURE_NAME);

    // Expand the card, then run the lookup.
    await clickByText(page, "button", FIXTURE_NAME);
    await waitForText(page, "Find Email");
    await clickByText(page, "button", "Find Email");

    // The enricher makes real outbound requests, so allow for the round trip.
    await page.waitForFunction(
      () => {
        const input = document.querySelector<HTMLInputElement>(
          'input[type="email"]'
        );
        return !!input && input.value.includes("@");
      },
      { timeout: 45000 }
    );

    const value = await page.evaluate(
      () =>
        document.querySelector<HTMLInputElement>('input[type="email"]')?.value
    );

    await page.screenshot({ path: "/tmp/lead-enrich-ui.png", fullPage: false });

    expect(value).toBe("info@reddoorrealty.ca");

    // The address must actually be persisted, not just shown.
    const saved = await prisma.lead.findUnique({
      where: { placeId: FIXTURE_PLACE_ID },
    });
    expect(saved?.email).toBe("info@reddoorrealty.ca");

    await page.close();
  }, 120000);
});
