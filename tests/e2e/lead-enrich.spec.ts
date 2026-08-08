import { describe, it, expect, afterAll, beforeAll, inject } from "vitest";
import { newPage, login, closeBrowser, waitForText, clickByText } from "./helpers";
import { prisma } from "@/lib/prisma";

const { adminEmail, adminPassword } = inject("testCredentials");

// Reserved ids so the fixtures can never collide with, or be mistaken for, a
// real saved lead. Distinct names too: the saved-leads search box does a
// substring match, so a shared prefix would pull both fixtures into one
// filtered view and the click-by-text helpers could land on the wrong card.
const FIXTURE_PLACE_ID = "osm:node/999000001";
const FIXTURE_NAME = "E2E Enrich Fixture Live";

// `.invalid` is reserved by RFC 2606 to never resolve - a deterministic,
// always-unreachable target, rather than depending on some real site
// happening to be down for the duration of this test.
const DOWN_FIXTURE_PLACE_ID = "osm:node/999000002";
const DOWN_FIXTURE_NAME = "E2E Enrich Fixture Down";
const DOWN_FIXTURE_WEBSITE = "https://e2e-fixture-nonexistent.invalid/";

beforeAll(async () => {
  await prisma.lead.deleteMany({
    where: { placeId: { in: [FIXTURE_PLACE_ID, DOWN_FIXTURE_PLACE_ID] } },
  });
  await prisma.lead.createMany({
    data: [
      {
        placeId: FIXTURE_PLACE_ID,
        businessName: FIXTURE_NAME,
        address: "Halifax, NS",
        website: "https://reddoorrealty.ca/",
        searchQuery: "e2e fixture",
      },
      {
        placeId: DOWN_FIXTURE_PLACE_ID,
        businessName: DOWN_FIXTURE_NAME,
        address: "Nowhere, NS",
        website: DOWN_FIXTURE_WEBSITE,
        searchQuery: "e2e fixture",
      },
    ],
  });
});

afterAll(async () => {
  await prisma.lead.deleteMany({
    where: { placeId: { in: [FIXTURE_PLACE_ID, DOWN_FIXTURE_PLACE_ID] } },
  });
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

  it("badges a lead whose website doesn't resolve as Website Down", async () => {
    const page = await newPage();
    await login(page, adminEmail, adminPassword);

    await page.goto("http://localhost:3002/admin/leads/saved", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('input[placeholder*="Search saved leads"]');
    await page.type(
      'input[placeholder*="Search saved leads"]',
      DOWN_FIXTURE_NAME
    );
    await waitForText(page, DOWN_FIXTURE_NAME);

    await clickByText(page, "button", DOWN_FIXTURE_NAME);
    await waitForText(page, "Find Email");
    await clickByText(page, "button", "Find Email");

    await waitForText(page, "Website Down", 45000);

    await page.screenshot({
      path: "/tmp/lead-enrich-down-ui.png",
      fullPage: false,
    });

    const saved = await prisma.lead.findUnique({
      where: { placeId: DOWN_FIXTURE_PLACE_ID },
    });
    expect(saved?.websiteUnreachable).toBe(true);
    expect(saved?.websiteCheckedAt).not.toBeNull();
    // Confirms enrichment genuinely tried and failed to reach the site,
    // rather than the badge being set some other way.
    expect(saved?.email).toBeNull();

    await page.close();
  }, 120000);
});
