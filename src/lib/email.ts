import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured — skipping email to:", to);
    return { success: false, error: "Email not configured" };
  }

  try {
    const data = await resend.emails.send({
      from: "OwnWebify <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

export function newProjectEmailHtml(projectTitle: string, clientName: string, clientEmail: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Project Request</h2>
      <p>A new project has been submitted:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Project:</td><td style="padding: 8px;">${projectTitle}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Client:</td><td style="padding: 8px;">${clientName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${clientEmail}</td></tr>
      </table>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/admin/projects" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View in Dashboard</a>
      </p>
    </div>
  `;
}

export function statusChangeEmailHtml(projectTitle: string, newStatus: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Project Status Updated</h2>
      <p>Your project "<strong>${projectTitle}</strong>" has been updated to: <strong>${newStatus.replace("_", " ")}</strong></p>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Details</a>
      </p>
    </div>
  `;
}

export function quoteEmailHtml(projectTitle: string, amount: number, description: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Quote Received</h2>
      <p>You have received a quote for "<strong>${projectTitle}</strong>":</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 16px 0;">
        <p style="font-size: 24px; font-weight: bold; color: #2563eb; margin: 0;">$${amount.toLocaleString()}</p>
        <p style="margin-top: 8px; color: #64748b;">${description}</p>
      </div>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept or Reject</a>
      </p>
    </div>
  `;
}

export function newMessageEmailHtml(projectTitle: string, senderName: string, messagePreview: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Message</h2>
      <p><strong>${senderName}</strong> sent a message on "<strong>${projectTitle}</strong>":</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb;">
        <p style="margin: 0; color: #334155;">${messagePreview}</p>
      </div>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reply</a>
      </p>
    </div>
  `;
}
