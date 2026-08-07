import puppeteer, { Browser, Page } from "puppeteer-core";
import { prisma } from "@/lib/prisma";

const CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = "http://localhost:3002";

let browser: Browser;

export async function launchBrowser(): Promise<Browser> {
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser && browser.connected) {
    await browser.close();
  }
}

/**
 * Default per-action timeout.
 *
 * 10s was too tight: several routes mount a WebGL canvas, and each spec file
 * runs in its own worker with its own headless Chrome, so a full run has
 * several of them compositing at once. Navigations that finish in about a
 * second on an idle machine were overrunning under that contention, which
 * showed up as timeouts scattered across whichever specs happened to collide
 * rather than as a consistent failure.
 */
const DEFAULT_TIMEOUT_MS = 30000;

export async function newPage(): Promise<Page> {
  const b = await launchBrowser();
  const page = await b.newPage();
  page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT_MS);

  // Puppeteer defaults to 800x600, which is below Tailwind's `md` breakpoint.
  // The dashboard chrome is `hidden md:flex`, so at the default size the
  // desktop sidebar is not rendered and its links are present but
  // unclickable. Pin a desktop viewport so the suite exercises the layout it
  // is written against.
  await page.setViewport({ width: 1440, height: 900 });

  // Block everything that is not the app under test.
  //
  // The layout loads the Google Analytics tag, and that request sits open
  // for the lifetime of the page. Any wait keyed on `networkidle0` — which
  // requires *zero* in-flight connections — therefore could never be
  // satisfied, so those waits ran to their timeout no matter how fast the
  // page actually was. Dropping third-party requests also keeps the suite
  // from depending on the network reaching an analytics CDN at all.
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const target = req.url();
    const isLocal =
      target.startsWith(BASE_URL) ||
      target.startsWith("data:") ||
      target.startsWith("blob:") ||
      target.startsWith("about:");
    if (isLocal) {
      req.continue();
    } else {
      req.abort();
    }
  });

  return page;
}

export function url(path: string): string {
  return `${BASE_URL}${path}`;
}

export async function clickByText(page: Page, selector: string, text: string): Promise<void> {
  await page.evaluate(
    (sel, txt) => {
      const elements = document.querySelectorAll(sel);
      for (const el of elements) {
        if (el.textContent?.includes(txt)) {
          (el as HTMLElement).click();
          return;
        }
      }
    },
    selector,
    text
  );
}

/**
 * Click the first *visible* element matching a selector.
 *
 * The dashboard sidebars render their contents twice — once in an off-canvas
 * mobile drawer, once in the desktop rail — so a nav selector matches two
 * nodes. `page.click` takes the first in document order, which is the
 * translated-away mobile copy, and fails with "Node is either not clickable
 * or not an Element". Pick the one actually laid out on screen.
 */
export async function clickVisible(page: Page, selector: string): Promise<void> {
  await page.waitForSelector(selector);
  const handles = await page.$$(selector);

  for (const handle of handles) {
    const box = await handle.boundingBox();
    if (box && box.width > 0 && box.height > 0) {
      await handle.click();
      return;
    }
  }

  throw new Error(`No visible element matched ${selector}`);
}

export async function waitForText(page: Page, text: string, timeout = 10000): Promise<void> {
  await page.waitForFunction(
    (t) => document.body.innerText.includes(t),
    { timeout },
    text
  );
}

/**
 * Every loopback representation a request to `localhost` can end up tagged
 * with. Measured empirically rather than assumed: `getClientIp` falls back
 * to the literal "unknown" when no forwarding header is set, but this fork's
 * dev server turns out to populate one from the raw socket address anyway,
 * which resolves "localhost" to the IPv6 loopback "::1" - not "unknown" - on
 * this machine. Listing both (plus IPv4 loopback, in case a CI runner
 * resolves it the other way) rather than trusting one guessed literal.
 *
 * The invariant that makes any of these safe to clear is the same either
 * way: production traffic arrives through Vercel's edge, which always
 * injects a real public client IP, so none of these values can ever be a
 * real visitor's bucket - only a local test run can produce one.
 */
const TEST_IPS = ["unknown", "::1", "127.0.0.1"];

/**
 * Drop the login throttle counters this suite itself accumulated.
 *
 * Login is rate limited per account and per source IP. Every suite here logs
 * in from the same host, so without this the later files in a run would be
 * throttled rather than genuinely failing. Scoped to the account being
 * logged into plus the shared test IP bucket - this DB is shared with a live
 * site, so a blanket `deleteMany({})` here would reset rate-limit state for
 * every real account and visitor, not just the test's own.
 */
export async function clearLoginThrottle(email: string): Promise<void> {
  await prisma.rateLimit.deleteMany({
    where: {
      OR: [
        ...TEST_IPS.map((ip) => ({ key: `login:ip:${ip}` })),
        // `contains` rather than reconstructing auth.ts's exact key
        // (`loginPerAccount:email:<lowercased>`): a literal rebuild here
        // silently stops matching anything the moment that format changes
        // elsewhere, which fails open into "throttle never cleared" rather
        // than an error - `contains` only needs the email substring to
        // still be true.
        { key: { startsWith: "loginPerAccount:", contains: email.toLowerCase() } },
      ],
    },
  });
}

export async function login(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await clearLoginThrottle(email);
  await page.goto(url("/login"), { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[id="email"]');
  await page.type('input[id="email"]', email);
  await page.type('input[id="password"]', password);
  await page.click('button[type="submit"]');
  // Login uses window.location.href for redirect, wait for page load
  await page.waitForFunction(
    () => !window.location.pathname.includes("/login"),
    { timeout: DEFAULT_TIMEOUT_MS }
  );
  // Wait for the destination shell to actually paint. This used to be
  // `waitForNetworkIdle`, which never settled: `next/link` prefetches keep
  // requests in flight, so idle-based waits are not a usable signal here.
  await page.waitForSelector("main", { timeout: DEFAULT_TIMEOUT_MS });
}
