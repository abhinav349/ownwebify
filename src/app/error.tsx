"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // In production Next strips a server error's message before forwarding it
  // here and leaves only `digest`, the hash that matches the full server-side
  // log entry. Dropping the prop entirely — which is what this did — meant a
  // production failure surfaced as an unattributable "something went wrong"
  // with no way back to the server log. Logging it is the documented pattern.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
