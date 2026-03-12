# First Download — LLM Trust

**Subject (A):** 🎉 Your model "{{model_name}}" just got its first download!
**Subject (B):** Someone just downloaded "{{model_name}}" — celebrate!
**Preview text:** A developer just used your model. Here's how to keep the momentum.

---

**Transactional — Triggered on first download of a user's model**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>First Download!</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#ec4899);padding:48px;text-align:center;">
              <div style="font-size:64px;margin-bottom:16px;">🎊</div>
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;">First Download!</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:16px;margin:8px 0 0;">Your model is gaining traction</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;text-align:center;">

              <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:18px;color:#111827;margin:0 0 24px;line-height:1.6;font-weight:600;">
                Someone just downloaded <strong>"{{model_name}}"</strong>! 🚀
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                This is a big milestone — a real developer is using your work. Here are some ways to keep the momentum going:
              </p>

              <!-- Tips -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;text-align:left;">
                <tr>
                  <td style="padding:0 0 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="top" style="padding-top:2px;">📢</td>
                        <td>
                          <p style="margin:0;font-size:15px;color:#374151;line-height:1.5;"><strong>Share your model page</strong> — Post on Twitter/X, Reddit, or your blog to attract more users.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="top" style="padding-top:2px;">📝</td>
                        <td>
                          <p style="margin:0;font-size:15px;color:#374151;line-height:1.5;"><strong>Keep docs updated</strong> — Clear documentation drives more downloads and better reviews.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="top" style="padding-top:2px;">💬</td>
                        <td>
                          <p style="margin:0;font-size:15px;color:#374151;line-height:1.5;"><strong>Engage with reviews</strong> — Thank reviewers and respond to feedback to build community trust.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{model_url}}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#ec4899);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">View Your Model Stats →</a>
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
                <a href="https://llmtrust.com/settings" style="color:#6366f1;text-decoration:none;">Notification preferences</a> · <a href="{{unsubscribe_url}}" style="color:#9ca3af;text-decoration:none;">Unsubscribe</a>
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
🎊 First Download! — LLM Trust

Hey {{first_name}},

Someone just downloaded "{{model_name}}"! 🚀

This is a big milestone — a real developer is using your work. Here are some ways to keep the momentum going:

📢 Share your model page — Post on Twitter/X, Reddit, or your blog to attract more users.
📝 Keep docs updated — Clear documentation drives more downloads and better reviews.
💬 Engage with reviews — Thank reviewers and respond to feedback to build community trust.

View your model stats: {{model_url}}

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Notification preferences: https://llmtrust.com/settings
Unsubscribe: {{unsubscribe_url}}
```
