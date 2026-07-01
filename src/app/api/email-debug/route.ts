import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;

  const diagnostics = {
    resendKeyConfigured: !!apiKey && apiKey !== "re_your_api_key_here",
    resendKeyPrefix: apiKey ? apiKey.substring(0, 6) + "..." : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    testResult: null as string | null,
  };

  if (diagnostics.resendKeyConfigured) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: "OwnWebify <noreply@ownwebify.com>",
        to: "delivered@resend.dev",
        subject: "Test from OwnWebify Debug",
        html: "<p>Debug test email</p>",
      });

      if (error) {
        diagnostics.testResult = `ERROR: ${JSON.stringify(error)}`;
      } else {
        diagnostics.testResult = `SUCCESS: id=${data?.id}`;
      }
    } catch (err) {
      diagnostics.testResult = `EXCEPTION: ${String(err)}`;
    }
  } else {
    diagnostics.testResult = "SKIPPED: No valid API key";
  }

  return NextResponse.json(diagnostics, {
    headers: { "Cache-Control": "no-store" },
  });
}
