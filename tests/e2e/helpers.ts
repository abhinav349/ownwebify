import puppeteer, { Browser, Page } from "puppeteer-core";

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

export async function newPage(): Promise<Page> {
  const b = await launchBrowser();
  const page = await b.newPage();
  page.setDefaultTimeout(10000);
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

export async function waitForText(page: Page, text: string, timeout = 10000): Promise<void> {
  await page.waitForFunction(
    (t) => document.body.innerText.includes(t),
    { timeout },
    text
  );
}

export async function login(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto(url("/login"), { waitUntil: "networkidle0" });
  await page.type('input[id="email"]', email);
  await page.type('input[id="password"]', password);
  await page.click('button[type="submit"]');
  // Login uses window.location.href for redirect, wait for page load
  await page.waitForFunction(
    () => !window.location.pathname.includes("/login"),
    { timeout: 15000 }
  );
  await page.waitForNetworkIdle({ idleTime: 500 });
}
