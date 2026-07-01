"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function ReferralSection({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <p className="font-bold text-lg font-mono">{code}</p>
      <button
        onClick={copyCode}
        className="p-1 rounded hover:bg-muted transition-colors"
        title="Copy referral code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
