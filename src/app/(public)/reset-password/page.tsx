"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-sm px-6">
          <Card className="border-border/50 shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Invalid or missing reset link.</p>
              <Link href="/forgot-password">
                <Button variant="outline" className="rounded-full">
                  Request New Link
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      <div className="mx-auto max-w-sm px-6">
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <KeyRound className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl">Set New Password</CardTitle>
            <CardDescription>
              {success ? "Your password has been reset" : "Choose a strong password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">
                    Password reset successfully!
                  </p>
                </div>
                <Link href="/login">
                  <Button className="w-full rounded-full shadow-md shadow-primary/20 mt-2">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    placeholder="At least 6 characters"
                    className="mt-1.5 rounded-xl"
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Repeat your password"
                    className="mt-1.5 rounded-xl"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full shadow-md shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
