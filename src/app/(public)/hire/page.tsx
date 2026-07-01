"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { projectIntakeSchema, type ProjectIntakeFormData } from "@/lib/validations";

const projectTypes = [
  { value: "landing-page", label: "Landing Page" },
  { value: "business-site", label: "Business Website" },
  { value: "ecommerce", label: "E-Commerce Store" },
  { value: "web-app", label: "Web Application" },
  { value: "redesign", label: "Website Redesign" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "under-100", label: "Under $100" },
  { value: "100-200", label: "$100 - $200" },
  { value: "200-300", label: "$200 - $300" },
  { value: "300-400", label: "$300 - $400" },
  { value: "400-plus", label: "$400+" },
];

const timelines = [
  { value: "asap", label: "ASAP" },
  { value: "1-2-weeks", label: "1-2 Weeks" },
  { value: "1-month", label: "1 Month" },
  { value: "2-3-months", label: "2-3 Months" },
  { value: "flexible", label: "Flexible" },
];

const referralSources = [
  { value: "google", label: "Google Search" },
  { value: "social-media", label: "Social Media" },
  { value: "referral", label: "Referral" },
  { value: "portfolio", label: "Saw Your Portfolio" },
  { value: "other", label: "Other" },
];

const steps = [
  { title: "Contact Info", description: "How can I reach you?" },
  { title: "Project Details", description: "Tell me about your project" },
  { title: "Budget & Timeline", description: "When and how much?" },
];

export default function HirePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ProjectIntakeFormData>({
    resolver: zodResolver(projectIntakeSchema),
  });

  const nextStep = async () => {
    const fieldsToValidate: (keyof ProjectIntakeFormData)[][] = [
      ["name", "email", "password"],
      ["projectType", "title", "description"],
      ["budget", "timeline"],
    ];

    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: ProjectIntakeFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-lg px-6 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">You&apos;re All Set!</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            I&apos;ve received your project details and I&apos;m excited to take a look.
            Expect a custom quote in your inbox within 48 hours.
          </p>
          <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
            <p className="text-sm font-medium">
              Your account is ready!
            </p>
            <p className="text-sm text-muted-foreground">
              Log in with the email and password you just set to track your project, view quotes, and message me directly.
            </p>
          </div>
          <a href="/login" className="inline-block mt-6">
            <Button className="rounded-full shadow-md shadow-primary/20">
              Go to Dashboard &rarr;
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Let&apos;s Build Something{" "}
            <span className="gradient-text">Amazing</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tell me about your vision. I&apos;ll respond with a custom proposal within 48 hours.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    index <= currentStep
                      ? "bg-gradient-to-br from-primary to-pink-500 text-white shadow-lg shadow-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-2 text-muted-foreground hidden sm:block font-medium">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 rounded-full transition-colors ${
                    index < currentStep ? "bg-gradient-to-r from-primary to-pink-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Contact Info */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="John Doe"
                      className="mt-1.5"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="john@company.com"
                      className="mt-1.5"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Create Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      placeholder="Min 6 characters"
                      className="mt-1.5"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      You&apos;ll use this to log in and track your project.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="company">Company (optional)</Label>
                    <Input
                      id="company"
                      {...register("company")}
                      placeholder="Your Company Name"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="referralCode">Referral Code (optional)</Label>
                    <Input
                      id="referralCode"
                      {...register("referralCode")}
                      placeholder="e.g., ABHI-X7K2"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Have a referral code? Enter it for 10% off your first project.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                      id="projectType"
                      {...register("projectType")}
                      options={projectTypes}
                      placeholder="Select a project type"
                      className="mt-1.5"
                      defaultValue=""
                    />
                    {errors.projectType && (
                      <p className="text-sm text-destructive mt-1">{errors.projectType.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="e.g., Corporate Website Redesign"
                      className="mt-1.5"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe your project goals, target audience, key features needed..."
                      rows={5}
                      className="mt-1.5"
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="referenceLinks">Reference Websites (optional)</Label>
                    <Input
                      id="referenceLinks"
                      {...register("referenceLinks")}
                      placeholder="https://example.com, https://inspiration.com"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Comma-separated URLs of sites you like
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Timeline */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select
                      id="budget"
                      {...register("budget")}
                      options={budgetRanges}
                      placeholder="Select your budget"
                      className="mt-1.5"
                      defaultValue=""
                    />
                    {errors.budget && (
                      <p className="text-sm text-destructive mt-1">{errors.budget.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline *</Label>
                    <Select
                      id="timeline"
                      {...register("timeline")}
                      options={timelines}
                      placeholder="Select your timeline"
                      className="mt-1.5"
                      defaultValue=""
                    />
                    {errors.timeline && (
                      <p className="text-sm text-destructive mt-1">{errors.timeline.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="howFoundUs">How did you find me? (optional)</Label>
                    <Select
                      id="howFoundUs"
                      {...register("howFoundUs")}
                      options={referralSources}
                      placeholder="Select an option"
                      className="mt-1.5"
                      defaultValue=""
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Project"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
