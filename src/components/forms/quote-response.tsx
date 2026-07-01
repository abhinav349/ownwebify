"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuoteResponse({
  projectId,
  quoteId,
}: {
  projectId: string;
  quoteId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleResponse = async (status: "ACCEPTED" | "REJECTED") => {
    setIsLoading(status);

    try {
      const response = await fetch(`/api/projects/${projectId}/quotes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to respond to quote:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleResponse("ACCEPTED")}
        disabled={isLoading !== null}
        className="flex-1"
      >
        {isLoading === "ACCEPTED" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" />
            Accept
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleResponse("REJECTED")}
        disabled={isLoading !== null}
        className="flex-1"
      >
        {isLoading === "REJECTED" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <X className="h-4 w-4 mr-1" />
            Reject
          </>
        )}
      </Button>
    </div>
  );
}
