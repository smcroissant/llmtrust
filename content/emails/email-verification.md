# Email Verification — LLM Trust

**Subject (A):** Verify your email to activate your LLM Trust account
**Subject (B):** One last step — confirm your email
**Preview text:** Click the link inside to verify your email and get full access.

---

**Transactional — Triggered on sign-up (requires email verification)**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center;">
              <img src="https://llmtrust.com/logo-white.png" alt="LLM Trust" width="48" height="48" style="margin-bottom:12px;" />
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">Verify your email</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;text-align:center;">

              <div style="width:64px;height:64px;background-color:#f0f0ff;border-radius:50%;text-align:center;line-height:64px;font-size:28px;margin:0 auto 24px;">📧</div>

              <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                Please verify your email address to activate your LLM Trust account. Click the button below to confirm:
              </p>

              <!-- CTA Button -->
              <a href="{{verification_url}}" style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:10px;margin-bottom:24px;">Verify My Email</a>

              <p style="font-size:14px;color:#9ca3af;margin:0 0 8px;line-height:1.5;">
                This link expires in <strong>24 hours</strong>.
              </p>

              <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.5;">
                If you didn't create an account, you can safely ignore this email.
              </p>

              <!-- Fallback URL -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td style="background-color:#f9fafb;border-radius:8px;padding:16px;">
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
                      Button not working? Copy and paste this link:<br>
                      <a href="{{verification_url}}" style="color:#6366f1;word-break:break-all;">{{verification_url}}</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;line-height:1.5;">
                LLM Trust — The developer's platform for LLM discovery<br>
                <a href="{{unsubscribe_url}}" style="color:#9ca3af;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
```

---

## Plain Text Version

```
Verify your email — LLM Trust

Hey {{first_name}},

Please verify your email address to activate your LLM Trust account.

Click here to verify: {{verification_url}}

This link expires in 24 hours.

If you didn't create an account, you can safely ignore this email.

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Unsubscribe: {{unsubscribe_url}}
```
