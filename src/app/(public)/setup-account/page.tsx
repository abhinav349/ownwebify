"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SetupAccountPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
        <p className="text-muted-foreground">
          This setup link is missing or malformed. Please use the link from your quote email.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/setup-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Account Ready!</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Your password has been set. You can now log in to view your quote,
            track your project, and message us directly.
          </p>
          <Button
            className="rounded-full shadow-md shadow-primary/20"
            onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
          >
            Log In to Dashboard &rarr;
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="mx-auto max-w-md px-6">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-pink-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Set Up Your Account</h1>
          <p className="text-muted-foreground">
            Create a password to access your project dashboard.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Password</CardTitle>
            <CardDescription>
              This will let you log in to view quotes, track progress, and message us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="mt-1.5"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className="mt-1.5"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Set Password & Continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
