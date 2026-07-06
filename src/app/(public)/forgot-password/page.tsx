"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const resetSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSendOtp = async (data: EmailFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Something went wrong");
      } else {
        setEmail(data.email);
        setStep("otp");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ResetFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: data.otp,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to reset password");
      } else {
        setStep("done");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setError("");
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

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
              {step === "otp" ? (
                <KeyRound className="h-7 w-7 text-white" />
              ) : (
                <Mail className="h-7 w-7 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === "done" ? "Password Reset!" : "Forgot Password?"}
            </CardTitle>
            <CardDescription>
              {step === "email" && "Enter your email and we'll send you a verification code"}
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "done" && "Your password has been reset successfully"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...emailForm.register("email")}
                    placeholder="you@example.com"
                    className="mt-1.5 rounded-xl"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
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
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3 inline mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    {...resetForm.register("otp")}
                    placeholder="Enter 6-digit OTP"
                    className="mt-1.5 rounded-xl text-center text-lg tracking-widest"
                  />
                  {resetForm.formState.errors.otp && (
                    <p className="text-sm text-destructive mt-1">
                      {resetForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...resetForm.register("newPassword")}
                    placeholder="At least 6 characters"
                    className="mt-1.5 rounded-xl"
                  />
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...resetForm.register("confirmPassword")}
                    placeholder="Repeat your password"
                    className="mt-1.5 rounded-xl"
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
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
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setError(""); }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change email
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">
                    Your password has been reset successfully!
                  </p>
                </div>
                <Link href="/login">
                  <Button className="w-full rounded-full shadow-md shadow-primary/20 mt-2">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
