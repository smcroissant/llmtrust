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

import { env } from "~/env";

const FROM_EMAIL = "LLM Trust <noreply@llmtrust.com>";
const APP_URL = env.NEXT_PUBLIC_APP_URL;

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

// ─── Newsletter Confirmation ──────────────────────────────────────────────

export async function sendNewsletterConfirmation(
  email: string,
  token: string,
) {
  const confirmUrl = `${APP_URL}/newsletter/confirm?token=${token}`;
  const unsubscribeUrl = `${APP_URL}/newsletter/unsubscribe?token=${token}`;

  const body = `
    <div style="text-align:center;">
      <div style="width:64px;height:64px;background-color:#f0f0ff;border-radius:50%;text-align:center;line-height:64px;font-size:28px;margin:0 auto 24px;">📬</div>

      <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
        Almost there! Confirm your newsletter subscription.
      </p>

      <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
        Get the <strong>weekly LLM digest</strong>: new models, benchmarks, pro tips, and community highlights delivered to your inbox every Friday.
      </p>

      ${ctaButton(confirmUrl, "Confirm My Subscription")}

      <p style="font-size:14px;color:#9ca3af;margin:24px 0 8px;line-height:1.5;">
        If you didn't request this, you can safely ignore this email.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr>
          <td style="background-color:#f9fafb;border-radius:8px;padding:16px;">
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
              Button not working? Copy and paste this link:<br>
              <a href="${confirmUrl}" style="color:#6366f1;word-break:break-all;">${confirmUrl}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const html = emailLayout({
    title: "Confirm Your Newsletter",
    emoji: "📬",
    preheader: "One click to confirm your LLM Trust newsletter subscription.",
    body,
  });

  const text = `Confirm Your Newsletter — LLM Trust

Click the link below to confirm your newsletter subscription:

${confirmUrl}

What you'll get:
• Weekly digest of new LLM models
• Benchmark updates and comparisons
• Pro tips for running models locally
• Community highlights

If you didn't request this, ignore this email.

— The LLM Trust Team`;

  return sendEmail({
    to: email,
    subject: "Confirm your LLM Trust newsletter subscription 📬",
    html,
    text,
  });
}

// ─── Onboarding Email Sequence ────────────────────────────────────────────

interface FeaturedModel {
  name: string;
  slug: string;
  description: string;
}

/**
 * Day 3 email: Reminder to complete onboarding + featured models.
 * Sent 3 days after sign-up if user hasn't activated (saved a model, left a review, or submitted a model).
 */
export async function sendDay3Reminder(params: {
  email: string;
  name: string;
  featuredModels?: FeaturedModel[];
}) {
  const { email, name, featuredModels = [] } = params;
  const firstName = name?.split(" ")[0] ?? "there";

  const featuredModelsHtml = featuredModels.length > 0
    ? featuredModels
        .map(
          (m) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td style="background-color:#f9fafb;border-radius:10px;padding:16px 20px;border:1px solid #e5e7eb;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${m.name}</p>
          <p style="margin:4px 0 8px;font-size:14px;color:#6b7280;line-height:1.5;">${m.description}</p>
          <a href="${APP_URL}/models/${m.slug}" style="font-size:14px;color:#6366f1;text-decoration:none;font-weight:500;">View model →</a>
        </td>
      </tr>
    </table>`,
        )
        .join("")
    : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td style="background-color:#f9fafb;border-radius:10px;padding:16px 20px;border:1px solid #e5e7eb;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">🔥 Qwen 2.5 72B</p>
          <p style="margin:4px 0 8px;font-size:14px;color:#6b7280;line-height:1.5;">Top-rated for general tasks with excellent multilingual support.</p>
          <a href="${APP_URL}/models/qwen-2-5-72b" style="font-size:14px;color:#6366f1;text-decoration:none;font-weight:500;">View model →</a>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td style="background-color:#f9fafb;border-radius:10px;padding:16px 20px;border:1px solid #e5e7eb;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">⚡ DeepSeek Coder V2</p>
          <p style="margin:4px 0 8px;font-size:14px;color:#6b7280;line-height:1.5;">Best open-source code model with 236B MoE architecture.</p>
          <a href="${APP_URL}/models/deepseek-coder-v2" style="font-size:14px;color:#6366f1;text-decoration:none;font-weight:500;">View model →</a>
        </td>
      </tr>
    </table>`;

  const body = `
    <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
      Hey <strong>${firstName}</strong> 👋,
    </p>
    <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
      You signed up for LLM Trust a few days ago — we don&apos;t want you to miss out! Here are a couple of things you can do right now:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f0f0ff;border-radius:10px;padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48" valign="top">
                <div style="width:40px;height:40px;background-color:#6366f1;border-radius:10px;text-align:center;line-height:40px;font-size:20px;">⭐</div>
              </td>
              <td style="padding-left:12px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">Save a model to your dashboard</p>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;line-height:1.5;">Click the heart icon on any model to start building your library.</p>
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
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">Leave your first review</p>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;line-height:1.5;">Share your experience with a model you&apos;ve used and help the community.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
      <strong>🔥 Featured models this week:</strong>
    </p>

    ${featuredModelsHtml}

    ${ctaButton(`${APP_URL}/models`, "Explore All Models →")}
  `;

  const html = emailLayout({
    title: "Don't miss out on LLM Trust",
    emoji: "👋",
    preheader: "Save models, write reviews, and discover the best LLMs.",
    body,
  });

  const text = `Don't miss out on LLM Trust 👋

Hey ${firstName},

You signed up for LLM Trust a few days ago — here's what you can do right now:

⭐ Save a model to your dashboard → ${APP_URL}/models
📝 Leave your first review → ${APP_URL}/models

Featured models this week:
${featuredModels.map((m) => `• ${m.name}: ${m.description} → ${APP_URL}/models/${m.slug}`).join("\n") || "• Qwen 2.5 72B → " + APP_URL + "/models/qwen-2-5-72b\n• DeepSeek Coder V2 → " + APP_URL + "/models/deepseek-coder-v2"}

Explore all models: ${APP_URL}/models

— The LLM Trust Team`;

  return sendEmail({
    to: email,
    subject: "Still curious about LLMs? Here are this week's picks 🔥",
    html,
    text,
  });
}

/**
 * Day 7 email: Discover comparisons.
 * Sent 7 days after sign-up to re-engage users and introduce the comparison feature.
 */
export async function sendDay7DiscoverComparisons(params: {
  email: string;
  name: string;
}) {
  const { email, name } = params;
  const firstName = name?.split(" ")[0] ?? "there";

  const comparisons = [
    {
      modelA: "Llama 3 70B",
      modelB: "GPT-4",
      slug: "llama-3-70b-vs-gpt-4",
      description: "The open-source contender vs. the industry standard.",
    },
    {
      modelA: "Mistral Large",
      modelB: "Claude 3 Opus",
      slug: "mistral-large-vs-claude-3-opus",
      description: "European efficiency meets Anthropic's safety-first approach.",
    },
    {
      modelA: "Phi-3 Mini",
      modelB: "Gemma 2 9B",
      slug: "phi-3-mini-vs-gemma-2-9b",
      description: "Small but mighty — which compact model wins?",
    },
  ];

  const comparisonsHtml = comparisons
    .map(
      (c) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td style="background-color:#f0f0ff;border-radius:10px;padding:16px 20px;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">⚡ ${c.modelA} vs ${c.modelB}</p>
          <p style="margin:4px 0 8px;font-size:14px;color:#6b7280;line-height:1.5;">${c.description}</p>
          <a href="${APP_URL}/compare/${c.slug}" style="font-size:14px;color:#6366f1;text-decoration:none;font-weight:500;">Compare now →</a>
        </td>
      </tr>
    </table>`,
    )
    .join("");

  const body = `
    <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
      Hey <strong>${firstName}</strong> 🔍,
    </p>
    <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
      It&apos;s been a week since you joined LLM Trust! One of our most powerful features is
      <strong>side-by-side model comparisons</strong> — and we think you&apos;ll love it.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f9fafb;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#111827;">How it works:</p>
          <p style="margin:0 0 4px;font-size:14px;color:#374151;line-height:1.6;">1️⃣ Pick any two models</p>
          <p style="margin:0 0 4px;font-size:14px;color:#374151;line-height:1.6;">2️⃣ See specs, benchmarks & reviews side-by-side</p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">3️⃣ Make the right choice for your project</p>
        </td>
      </tr>
    </table>

    <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
      <strong>⚡ Popular comparisons:</strong>
    </p>

    ${comparisonsHtml}

    ${ctaButton(`${APP_URL}/compare`, "Compare Models →")}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td style="background-color:#f0f0ff;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:14px;color:#6b7280;">💡 <strong>Pro tip:</strong></p>
          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5;">
            You can bookmark any comparison URL to share with your team. Try comparing your
            current production model against a new open-source alternative!
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = emailLayout({
    title: "Compare LLMs side-by-side",
    emoji: "⚡",
    preheader: "Our most powerful feature — see how models stack up against each other.",
    body,
  });

  const text = `Compare LLMs side-by-side ⚡

Hey ${firstName},

It's been a week since you joined LLM Trust! Discover our comparison feature:

How it works:
1. Pick any two models
2. See specs, benchmarks & reviews side-by-side
3. Make the right choice for your project

Popular comparisons:
${comparisons.map((c) => `• ${c.modelA} vs ${c.modelB}: ${c.description} → ${APP_URL}/compare/${c.slug}`).join("\n")}

Compare models: ${APP_URL}/compare

💡 Pro tip: Bookmark any comparison URL to share with your team!

— The LLM Trust Team`;

  return sendEmail({
    to: email,
    subject: "The best way to choose an LLM — compare them ⚡",
    html,
    text,
  });
}
