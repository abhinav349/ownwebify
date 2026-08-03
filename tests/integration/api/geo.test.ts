import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("GET /api/geo", () => {
  // Pricing is quoted in rupees first (see ab40fd2, "default all pricing to
  // INR"), so an unidentified visitor gets INR rather than USD.
  it("falls back to INR when no geo headers are present", async () => {
    const res = await fetch(`${BASE_URL}/api/geo`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("INR");
    expect(data.country).toBe("IN");
  });

  it("returns INR when x-vercel-ip-country is IN", async () => {
    const res = await fetch(`${BASE_URL}/api/geo`, {
      headers: { "x-vercel-ip-country": "IN" },
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("INR");
    expect(data.country).toBe("IN");
  });

  it("returns CAD when cf-ipcountry is CA", async () => {
    const res = await fetch(`${BASE_URL}/api/geo`, {
      headers: { "cf-ipcountry": "CA" },
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("CAD");
    expect(data.country).toBe("CA");
  });

  it("respects ?country= query param override", async () => {
    const res = await fetch(`${BASE_URL}/api/geo?country=IN`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("INR");
    expect(data.country).toBe("IN");
  });

  it("falls back to INR for unknown country codes", async () => {
    const res = await fetch(`${BASE_URL}/api/geo?country=ZZ`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("INR");
  });
});
