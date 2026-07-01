import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("GET /api/geo", () => {
  it("returns USD currency by default (no geo headers)", async () => {
    const res = await fetch(`${BASE_URL}/api/geo`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("USD");
    expect(data.country).toBe("US");
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

  it("returns USD for unknown country codes", async () => {
    const res = await fetch(`${BASE_URL}/api/geo?country=ZZ`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.currency).toBe("USD");
  });
});
