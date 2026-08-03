import { z } from "zod";

/**
 * Minimum length for a *newly set* password, per NIST SP 800-63B.
 *
 * Defined once because it was previously repeated as a literal `6` in both
 * API handlers and form schemas, which meant the server and the form could
 * (and did) drift apart. `loginSchema` deliberately does not use it: login
 * validates an already-issued credential, and rejecting a short legacy
 * password at the form would lock those users out of their own reset flow.
 */
export const MIN_PASSWORD_LENGTH = 8;

export const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  )
  .max(200, "Password must be under 200 characters");

export const projectIntakeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  title: z.string().min(5, "Project title must be at least 5 characters"),
  description: z.string().min(20, "Please provide at least 20 characters describing your project"),
  referenceLinks: z.string().optional(),
  howFoundUs: z.string().optional(),
  referralCode: z.string().optional(),
  features: z.array(z.string()).optional(),
});

export type ProjectIntakeFormData = z.infer<typeof projectIntakeSchema>;

// For already logged-in users submitting a new project. No contact info /
// password / email verification is required since they are authenticated.
export const projectDetailsSchema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  title: z.string().min(5, "Project title must be at least 5 characters"),
  description: z.string().min(20, "Please provide at least 20 characters describing your project"),
  referenceLinks: z.string().optional(),
  howFoundUs: z.string().optional(),
  features: z.array(z.string()).optional(),
});

export type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  // Intentionally *not* `passwordSchema`. Login checks a credential that was
  // already issued, so it must accept anything the policy allowed at the time
  // it was set — held at the previous 6-char floor rather than raised to
  // MIN_PASSWORD_LENGTH, so accounts created under the old rule can still
  // reach their account (and the reset flow) instead of being refused at the
  // form.
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

export const quoteSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  description: z.string().min(10, "Please provide a description"),
  validUntil: z.string().min(1, "Please set an expiry date"),
});
