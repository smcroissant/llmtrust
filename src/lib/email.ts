import { Resend } from "resend";

// ─── Client (lazy init) ────────────────────────────────────────────────────

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

const FROM_EMAIL = "LLM Trust <noreply@llmtrust.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.llmtrust.com";

// ─── Shared Layout ─────────────────────────────────────────────────────────

function emailLayout(params: {
  title: string;
  emoji: string;
  preheader: string;
  body: string;
}): string {
  const { title, emoji, preheader, body } = params;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <span style="display:none!important;font-size:1px;color:#f4f4f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center;">
              <div style="font-size:40px;margin-bottom:8px;">${emoji}</div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">${title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;line-height:1.5;">
                LLM Trust — The developer's platform for LLM discovery<br>
                <a href="${APP_URL}/settings" style="color:#6366f1;text-decoration:none;">Notification preferences</a> · <a href="${APP_URL}" style="color:#9ca3af;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Helper ────────────────────────────────────────────────────────────────

function ctaButton(url: string, label: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <a href="${url}" style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

// ─── Templates ─────────────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
    throw new Error(`Email send failed: ${error.message}`);
  }

  console.log(`[email] Sent "${subject}" to ${to} (id: ${data?.id})`);
  return data;
}

// ─── Public Functions ──────────────────────────────────────────────────────

export async function sendWelcomeEmail(params: {
  email: string;
  name: string;
}) {
  const { email, name } = params;
  const firstName = name?.split(" ")[0] ?? "there";

  const body = `
    <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
      Hey <strong>${firstName}</strong> 👋,
    </p>
    <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
      Welcome to LLM Trust! You now have access to detailed benchmarks, real user reviews, and side-by-side comparisons of the best LLMs on the market.
    </p>
    <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
      Here are <strong>3 quick actions</strong> to get started:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="background-color:#f0f0ff;border-radius:10px;padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48" valign="top">
                <div style="width:40px;height:40px;background-color:#6366f1;border-radius:10px;text-align:center;line-height:40px;font-size:20px;">🔍</div>
              </td>
              <td style="padding-left:12px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">Explore top models</p>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;line-height:1.5;">Browse benchmarks and rankings for GPT-4, Claude, Gemini, Llama, and more.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="background-color:#f0f0ff;border-radius:10px;padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48" valign="top">
                <div style="width:40px;height:40px;background-color:#6366f1;border-radius:10px;text-align:center;line-height:40px;font-size:20px;">⚡</div>
              </td>
              <td style="padding-left:12px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">Compare models side-by-side</p>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;line-height:1.5;">Pick two models and see performance, pricing, latency, and quality metrics.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="background-color:#f0f0ff;border-radius:10px;padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48" valign="top">
                <div style="width:40px;height:40px;background-color:#6366f1;border-radius:10px;text-align:center;line-height:40px;font-size:20px;">📝</div>
              </td>
              <td style="padding-left:12px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">Write your first review</p>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;line-height:1.5;">Share your experience with a model you've used. Help the community make better decisions.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${ctaButton(`${APP_URL}/explore`, "Explore Models →")}
  `;

  const html = emailLayout({
    title: "Welcome to LLM Trust",
    emoji: "🚀",
    preheader: "3 quick actions to get started in under 2 minutes.",
    body,
  });

  const text = `Welcome to LLM Trust 🚀

Hey ${firstName},

Welcome to LLM Trust! You now have access to detailed benchmarks, real user reviews, and side-by-side comparisons of the best LLMs on the market.

3 quick actions to get started:

1. 🔍 Explore top models → ${APP_URL}/explore
2. ⚡ Compare models side-by-side → ${APP_URL}/compare
3. 📝 Write your first review → ${APP_URL}/reviews/new

— The LLM Trust Team`;

  return sendEmail({
    to: email,
    subject: "Welcome to LLM Trust — let's find your perfect model 🚀",
    html,
    text,
  });
}

export async function sendEmailVerification(params: {
  email: string;
  name: string;
  verificationUrl: string;
}) {
  const { email, name, verificationUrl } = params;
  const firstName = name?.split(" ")[0] ?? "there";

  const body = `
    <div style="text-align:center;">
      <div style="width:64px;height:64px;background-color:#f0f0ff;border-radius:50%;text-align:center;line-height:64px;font-size:28px;margin:0 auto 24px;">📧</div>

      <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
        Hey <strong>${firstName}</strong>,
      </p>

      <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
        Please verify your email address to activate your LLM Trust account. Click the button below to confirm:
      </p>

      ${ctaButton(verificationUrl, "Verify My Email")}

      <p style="font-size:14px;color:#9ca3af;margin:24px 0 8px;line-height:1.5;">
        This link expires in <strong>24 hours</strong>.
      </p>

      <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.5;">
        If you didn't create an account, you can safely ignore this email.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr>
          <td style="background-color:#f9fafb;border-radius:8px;padding:16px;">
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
              Button not working? Copy and paste this link:<br>
              <a href="${verificationUrl}" style="color:#6366f1;word-break:break-all;">${verificationUrl}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const html = emailLayout({
    title: "Verify your email",
    emoji: "📧",
    preheader: "Click the link inside to verify your email and get full access.",
    body,
  });

  const text = `Verify your email — LLM Trust

Hey ${firstName},

Please verify your email address to activate your LLM Trust account.

Click here to verify: ${verificationUrl}

This link expires in 24 hours.

If you didn't create an account, you can safely ignore this email.

— The LLM Trust Team`;

  return sendEmail({
    to: email,
    subject: "Verify your email to activate your LLM Trust account",
    html,
    text,
  });
}

export async function sendPasswordReset(params: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  const { email, name, resetUrl } = params;
  const firstName = name?.split(" ")[0] ?? "there";

  const body = `
    <div style="text-align:center;">
      <div style="width:64px;height:64px;background-color:#fef3c7;border-radius:50%;text-align:center;line-height:64px;font-size:28px;margin:0 auto 24px;">🔒</div>

      <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
        Hey <strong>${firstName}</strong>,
      </p>

      <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
        We received a request to reset your password. Click the button below to choose a new one:
      </p>

      ${ctaButton(resetUrl, "Reset My Password")}

      <p style="font-size:14px;color:#9ca3af;margin:24px 0 8px;line-height:1.5;">
        This link expires in <strong>1 hour</strong>.
      </p>

      <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.5;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr>
          <td style="background-color:#fef2f2;border-radius:8px;padding:16px;border-left:4px solid #ef4444;">
            <p style="margin:0;font-size:13px;color:#991b1b;line-height:1.5;text-align:left;">
              ⚠️ <strong>Didn't request this?</strong> If you didn't ask to reset your password, someone may be trying to access your account. Please <a href="${APP_URL}/settings/security" style="color:#6366f1;">review your security settings</a>.
            </p>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background-color:#f9fafb;border-radius:8px;padding:16px;">
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
              Button not working? Copy and paste this link:<br>
              <a href="${resetUrl}" style="color:#6366f1;word-break:break-all;">${resetUrl}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const html = emailLayout({
    title: "Password Reset",
    emoji: "🔒",
    preheader: "Click to set a new password. Link valid for 1 hour.",
    body,
  });

  const text = `Password Reset — LLM Trust

Hey ${firstName},

We received a request to reset your password. Click the link below to choose a new one:

${resetUrl}

This link expires in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.

⚠️ Didn't request this? Review your security settings: ${APP_URL}/settings/security

— The LLM Trust Team`;

  return sendEmail({
    to: email,
    subject: "Reset your LLM Trust password",
    html,
    text,
  });
}
