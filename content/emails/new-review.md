# New Review — LLM Trust

**Subject (A):** {{reviewer_name}} just reviewed your model "{{model_name}}"
**Subject (B):** New review on "{{model_name}}" — {{rating}}/5 ⭐
**Preview text:** See what they said and respond.

---

**Transactional — Triggered when a user submits a review on another user's model**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Review</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">⭐</div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">New Review</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                <strong>{{reviewer_name}}</strong> just left a review on your model:
              </p>

              <!-- Review Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111827;">{{model_name}}</p>
                          <p style="margin:0 0 16px;font-size:24px;color:#f59e0b;letter-spacing:2px;">{{stars}}</p>
                          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;font-style:italic;">"{{review_excerpt}}"</p>
                          <p style="margin:0;font-size:13px;color:#9ca3af;">— {{reviewer_name}}, {{review_date}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                Engaging with reviews helps improve your model's visibility and builds trust with the community.
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{review_url}}" style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">View Full Review →</a>
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
⭐ New Review — LLM Trust

Hey {{first_name}},

{{reviewer_name}} just left a review on your model:

{{model_name}}
Rating: {{stars}}
"{{review_excerpt}}"
— {{reviewer_name}}, {{review_date}}

Engaging with reviews helps improve your model's visibility and builds trust with the community.

View full review: {{review_url}}

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Notification preferences: https://llmtrust.com/settings
Unsubscribe: {{unsubscribe_url}}
```
