import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isPrivateAddress,
  pickBestEmail,
  extractContacts,
  registrableDomain,
  isSameSite,
  enrichFromWebsite,
} from "@/lib/lead-enrich";

// Every hostname is DNS-resolved before it's fetched. Tests drive the
// redirect logic, not the resolver, so it always answers "public".
vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]),
}));

/**
 * The enricher fetches URLs that came from OpenStreetMap, which anyone can
 * edit. If these checks are wrong, a `website` tag becomes a way to make the
 * server issue requests inside its own network, so the blocked cases matter
 * more here than the allowed ones.
 */
describe("isPrivateAddress", () => {
  it("blocks the cloud metadata endpoint", () => {
    expect(isPrivateAddress("169.254.169.254")).toBe(true);
  });

  it("blocks RFC1918 ranges", () => {
    expect(isPrivateAddress("10.0.0.1")).toBe(true);
    expect(isPrivateAddress("172.16.0.1")).toBe(true);
    expect(isPrivateAddress("172.31.255.255")).toBe(true);
    expect(isPrivateAddress("192.168.1.1")).toBe(true);
  });

  it("allows public addresses that merely look adjacent to private ones", () => {
    expect(isPrivateAddress("172.15.0.1")).toBe(false);
    expect(isPrivateAddress("172.32.0.1")).toBe(false);
    expect(isPrivateAddress("192.169.1.1")).toBe(false);
    expect(isPrivateAddress("11.0.0.1")).toBe(false);
  });

  it("blocks loopback, unspecified and carrier-grade NAT", () => {
    expect(isPrivateAddress("127.0.0.1")).toBe(true);
    expect(isPrivateAddress("0.0.0.0")).toBe(true);
    expect(isPrivateAddress("100.64.0.1")).toBe(true);
  });

  it("blocks the IPv6 equivalents", () => {
    expect(isPrivateAddress("::1")).toBe(true);
    expect(isPrivateAddress("fe80::1")).toBe(true);
    expect(isPrivateAddress("fd00::1")).toBe(true);
  });

  it("blocks IPv4-mapped IPv6, which would otherwise smuggle a private address through", () => {
    expect(isPrivateAddress("::ffff:169.254.169.254")).toBe(true);
    expect(isPrivateAddress("::ffff:10.0.0.1")).toBe(true);
  });

  it("allows ordinary public addresses", () => {
    expect(isPrivateAddress("8.8.8.8")).toBe(false);
    expect(isPrivateAddress("2606:4700:4700::1111")).toBe(false);
  });

  it("refuses anything that is not a parseable IP", () => {
    expect(isPrivateAddress("not-an-ip")).toBe(true);
    expect(isPrivateAddress("")).toBe(true);
  });
});

describe("pickBestEmail", () => {
  it("prefers an address on the business's own domain over a free-mail one", () => {
    expect(
      pickBestEmail(["thewebguy@gmail.com", "info@thaicafe.in"], "thaicafe.in")
    ).toBe("info@thaicafe.in");
  });

  it("prefers a role mailbox over a personal one on the same domain", () => {
    expect(
      pickBestEmail(["rahul@thaicafe.in", "contact@thaicafe.in"], "thaicafe.in")
    ).toBe("contact@thaicafe.in");
  });

  it("treats www. and the bare domain as the same site", () => {
    expect(pickBestEmail(["hello@thaicafe.in"], "www.thaicafe.in")).toBe(
      "hello@thaicafe.in"
    );
  });

  it("drops noreply addresses, which nobody reads", () => {
    expect(pickBestEmail(["noreply@thaicafe.in"], "thaicafe.in")).toBeNull();
  });

  it("drops site-builder and analytics addresses", () => {
    expect(
      pickBestEmail(
        ["a1b2c3@sentry-next.wixpress.com", "support@wix.com"],
        "thaicafe.in"
      )
    ).toBeNull();
  });

  it("drops unedited template placeholders", () => {
    expect(
      pickBestEmail(["you@example.com", "youremail@domain.com"], "thaicafe.in")
    ).toBeNull();
  });

  it("ignores asset filenames that look like addresses", () => {
    expect(pickBestEmail(["logo@2x.png"], "thaicafe.in")).toBeNull();
  });

  it("normalises case and strips trailing punctuation from prose matches", () => {
    expect(pickBestEmail(["Info@ThaiCafe.in."], "thaicafe.in")).toBe(
      "info@thaicafe.in"
    );
  });

  it("returns null when there is nothing usable", () => {
    expect(pickBestEmail([], "thaicafe.in")).toBeNull();
  });
});

describe("extractContacts", () => {
  const base = "https://thaicafe.in/";

  it("reads addresses out of mailto links", () => {
    const html = `<a href="mailto:info@thaicafe.in">Email us</a>`;
    expect(extractContacts(html, base).emails).toContain("info@thaicafe.in");
  });

  it("reads addresses out of plain body text", () => {
    const html = `<p>Write to bookings@thaicafe.in for reservations.</p>`;
    expect(extractContacts(html, base).emails).toContain(
      "bookings@thaicafe.in"
    );
  });

  it("pulls a dialable number out of a tel link", () => {
    const html = `<a href="tel:+91 80 2345 6789">Call</a>`;
    expect(extractContacts(html, base).phone).toBe("+918023456789");
  });

  it("finds same-site contact pages worth following", () => {
    const html = `
      <a href="/contact-us">Contact</a>
      <a href="/menu">Menu</a>
    `;
    expect(extractContacts(html, base).contactLinks).toEqual([
      "https://thaicafe.in/contact-us",
    ]);
  });

  it("does not follow an off-site link, which belongs to someone else", () => {
    const html = `<a href="https://facebook.com/thaicafe/about">About</a>`;
    expect(extractContacts(html, base).contactLinks).toEqual([]);
  });

  it("returns no phone when the page has no tel link", () => {
    expect(extractContacts(`<p>Open daily</p>`, base).phone).toBeNull();
  });
});

describe("registrableDomain", () => {
  it("strips subdomains down to the owning name", () => {
    expect(registrableDomain("wps.myrealpage.com")).toBe("myrealpage.com");
    expect(registrableDomain("www.thaicafe.in")).toBe("thaicafe.in");
  });

  it("keeps both labels of a compound suffix", () => {
    expect(registrableDomain("cafe.co.uk")).toBe("cafe.co.uk");
    expect(registrableDomain("shop.cafe.co.uk")).toBe("cafe.co.uk");
  });

  it("groups a host with its own subdomains and separates unrelated ones", () => {
    expect(isSameSite("mail.thaicafe.in", "www.thaicafe.in")).toBe(true);
    expect(isSameSite("wps.myrealpage.com", "www.lizmartin.ca")).toBe(false);
  });
});

describe("pickBestEmail domain eligibility", () => {
  it("rejects an address belonging to the hosting platform, not the lead", () => {
    // Observed live: lizmartin.ca was parked on its vendor's placeholder
    // page, which advertises support@myrealpage.com.
    expect(pickBestEmail(["support@myrealpage.com"], "lizmartin.ca")).toBeNull();
  });

  it("rejects a third-party domain even when it is the only candidate", () => {
    expect(pickBestEmail(["hello@someagency.com"], "thaicafe.in")).toBeNull();
  });

  it("accepts a consumer mailbox, which small businesses really do use", () => {
    expect(pickBestEmail(["thaicafe.blr@gmail.com"], "thaicafe.in")).toBe(
      "thaicafe.blr@gmail.com"
    );
  });

  it("accepts an address on a subdomain of the site", () => {
    expect(pickBestEmail(["info@mail.thaicafe.in"], "thaicafe.in")).toBe(
      "info@mail.thaicafe.in"
    );
  });
});

describe("enrichFromWebsite redirect handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubPages(pages: Record<string, { status?: number; to?: string; html?: string }>) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL) => {
        const url = input.toString();
        const page = pages[url];
        if (!page) return new Response("not found", { status: 404 });
        if (page.to) {
          return new Response(null, {
            status: page.status ?? 302,
            headers: { location: page.to },
          });
        }
        return new Response(page.html ?? "", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        });
      })
    );
  }

  it("takes nothing from a site parked on another company's domain", async () => {
    stubPages({
      "https://lizmartin.ca/": { to: "http://wps.myrealpage.com/unavailable.html" },
      "http://wps.myrealpage.com/unavailable.html": {
        html: `<a href="mailto:support@myrealpage.com">Support</a>
               <a href="tel:+18005551234">Call</a>`,
      },
    });

    const result = await enrichFromWebsite("https://lizmartin.ca/");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The vendor's own support desk is not this lead's contact.
    expect(result.email).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.note).toMatch(/myrealpage\.com/);
  });

  it("still follows a redirect that stays within the business's own domain", async () => {
    stubPages({
      "http://thaicafe.in/": { to: "https://www.thaicafe.in/home" },
      "https://www.thaicafe.in/home": {
        html: `<a href="mailto:info@thaicafe.in">Email</a>`,
      },
    });

    const result = await enrichFromWebsite("http://thaicafe.in/");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.email).toBe("info@thaicafe.in");
  });

  it("reports a reachable site that simply publishes no address", async () => {
    stubPages({
      "https://thaicafe.in/": { html: `<p>Open daily 11-11</p>` },
    });

    const result = await enrichFromWebsite("https://thaicafe.in/");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.email).toBeNull();
    expect(result.note).toBeUndefined();
  });
});
