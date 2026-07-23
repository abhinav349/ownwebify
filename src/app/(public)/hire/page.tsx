"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  projectIntakeSchema,
  projectDetailsSchema,
  type ProjectIntakeFormData,
} from "@/lib/validations";
import { type CurrencyCode, currencies, formatDisplayPrice } from "@/lib/pricing";

const projectTypes = [
  { value: "landing-page", label: "Landing Page" },
  { value: "business-site", label: "Business Website" },
  { value: "ecommerce", label: "E-Commerce Store" },
  { value: "web-app", label: "Web Application" },
  { value: "redesign", label: "Website Redesign" },
  { value: "other", label: "Other" },
];

const featuresByProjectType: Record<string, string[]> = {
  "landing-page": [
    "Hero section with CTA",
    "Contact / lead capture form",
    "Testimonials / reviews section",
    "Pricing section",
    "Video / media embed",
    "Analytics setup",
    "Social media links",
    "Custom domain + SSL",
  ],
  "business-site": [
    "Blog / news section",
    "Team / about page",
    "Testimonials / reviews",
    "Photo / video gallery",
    "FAQ section",
    "Newsletter signup",
    "Contact form",
    "Social media integration",
    "Multi-language support",
    "Analytics setup",
    "Custom domain + SSL",
  ],
  ecommerce: [
    "Product catalog",
    "Shopping cart & checkout",
    "Payment gateway (Stripe / Razorpay)",
    "Inventory management",
    "Order tracking & notifications",
    "Customer accounts",
    "Discount / coupon system",
    "Shipping calculator",
    "Product reviews / ratings",
    "Wishlist",
    "Analytics setup",
    "Custom domain + SSL",
  ],
  "web-app": [
    "User authentication (login/signup)",
    "Admin dashboard",
    "Database design",
    "API integrations",
    "Real-time notifications",
    "File uploads",
    "Role-based access control",
    "Search functionality",
    "Analytics setup",
    "Custom domain + SSL",
  ],
  redesign: [
    "Keep existing content",
    "New branding / visual identity",
    "Improve mobile responsiveness",
    "SEO improvements",
    "Performance optimization",
    "Add new features",
    "Content migration",
    "Analytics setup",
  ],
  other: [
    "Contact form",
    "User authentication",
    "Database / data management",
    "API integrations",
    "Analytics setup",
    "Custom domain + SSL",
  ],
};

function getBudgetRanges(currency: CurrencyCode) {
  return [
    { value: "under-100", label: `Under ${formatDisplayPrice(100, currency)}` },
    { value: "100-200", label: `${formatDisplayPrice(100, currency)} - ${formatDisplayPrice(200, currency)}` },
    { value: "200-350", label: `${formatDisplayPrice(200, currency)} - ${formatDisplayPrice(350, currency)}` },
    { value: "350-500", label: `${formatDisplayPrice(350, currency)} - ${formatDisplayPrice(500, currency)}` },
    { value: "500-plus", label: `${formatDisplayPrice(500, currency)}+` },
  ];
}

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

const guestSteps = [
  { title: "Contact Info", description: "How can I reach you?" },
  { title: "Project Details", description: "Tell me about your project" },
  { title: "Features", description: "What do you need?" },
  { title: "Budget & Timeline", description: "When and how much?" },
];

const authedSteps = [
  { title: "Project Details", description: "Tell me about your project" },
  { title: "Features", description: "What do you need?" },
  { title: "Budget & Timeline", description: "When and how much?" },
];

export default function HirePage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="py-32 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <HireForm isLoggedIn={status === "authenticated"} />;
}

function HireForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  const steps = isLoggedIn ? authedSteps : guestSteps;
  const lastStep = steps.length - 1;

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (data.currency && currencies[data.currency as CurrencyCode]) {
          setCurrency(data.currency as CurrencyCode);
        }
      })
      .catch(() => {});
  }, []);

  const budgetRanges = getBudgetRanges(currency);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProjectIntakeFormData>({
    resolver: zodResolver(
      (isLoggedIn ? projectDetailsSchema : projectIntakeSchema) as typeof projectIntakeSchema
    ),
    defaultValues: { features: [] },
  });

  const selectedProjectType = watch("projectType");
  const selectedFeatures = watch("features") || [];
  const availableFeatures = featuresByProjectType[selectedProjectType] || [];

  const toggleFeature = (feature: string) => {
    const current = getValues("features") || [];
    const next = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    setValue("features", next);
  };

  const guestFields: (keyof ProjectIntakeFormData)[][] = [
    ["name", "email"],
    ["projectType", "title", "description"],
    [],
    ["budget", "timeline"],
  ];
  const authedFields: (keyof ProjectIntakeFormData)[][] = [
    ["projectType", "title", "description"],
    [],
    ["budget", "timeline"],
  ];
  const fieldsToValidate = isLoggedIn ? authedFields : guestFields;

  const nextStep = async () => {
    if (currentStep >= fieldsToValidate.length) return;
    const fields = fieldsToValidate[currentStep];
    if (fields.length > 0) {
      const isValid = await trigger(fields);
      if (!isValid) return;
    }
    setCurrentStep((prev) => prev + 1);
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
        const result = await response.json();
        setNewProjectId(result.projectId || null);
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
          {isLoggedIn ? (
            <a
              href={newProjectId ? `/dashboard/projects/${newProjectId}` : "/dashboard"}
              className="inline-block mt-2"
            >
              <Button className="rounded-full shadow-md shadow-primary/20">
                View Your Project &rarr;
              </Button>
            </a>
          ) : (
            <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
              <p className="text-sm text-muted-foreground">
                We&apos;ll email you a quote along with a link to set up your account so you can
                track progress, view quotes, and message us directly.
              </p>
            </div>
          )}
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
            {isLoggedIn
              ? "Welcome back! Just share your project details and I'll respond with a custom proposal within 48 hours."
              : "Tell me about your vision. I'll respond with a custom proposal within 48 hours."}
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
              {/* Contact Info (guest only) */}
              {!isLoggedIn && currentStep === 0 && (
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

              {/* Project Details */}
              {steps[currentStep].title === "Project Details" && (
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

              {/* Feature Checklist */}
              {steps[currentStep].title === "Features" && (
                <div className="space-y-4">
                  {availableFeatures.length > 0 ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Select the features you need. This is optional and helps me prepare a more accurate quote.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {availableFeatures.map((feature) => {
                          const isSelected = selectedFeatures.includes(feature);
                          return (
                            <button
                              key={feature}
                              type="button"
                              onClick={() => toggleFeature(feature)}
                              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm text-left transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                  : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <div
                                className={`h-4.5 w-4.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-muted-foreground/30"
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <span>{feature}</span>
                            </button>
                          );
                        })}
                      </div>
                      {selectedFeatures.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? "s" : ""} selected
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please select a project type in the previous step to see relevant features.
                    </p>
                  )}
                </div>
              )}

              {/* Budget & Timeline */}
              {steps[currentStep].title === "Budget & Timeline" && (
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

                {currentStep < lastStep ? (
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
