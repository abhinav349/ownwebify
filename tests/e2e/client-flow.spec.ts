import { describe, it, expect, afterAll, inject } from "vitest";
import { newPage, login, closeBrowser, waitForText } from "./helpers";

const { clientEmail, clientPassword } = inject("testCredentials");

afterAll(async () => {
  await closeBrowser();
});

describe("Client Flow E2E", () => {
  // Signs in as a CLIENT. This used to log in with the admin account, which
  // lands on /admin — so the one test covering the client dashboard never
  // actually opened it, and passed on the word "Dashboard" appearing in the
  // admin shell.
  it("client dashboard loads after login", async () => {
    const page = await newPage();
    await login(page, clientEmail, clientPassword);

    expect(page.url()).toContain("/dashboard");
    await waitForText(page, "My Projects");

    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toContain("My Projects");
    await page.close();
  }, 60000);
});
