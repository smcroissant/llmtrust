# Reactivation — LLM Trust

**Subject (A):** We miss you, {{first_name }} — here's what you've missed
**Subject (B):** A lot has changed on LLM Trust since you were last here
**Preview text:** {{new_models_since}} new models, new features, and more.

---

**Marketing — Sent after 30 days of inactivity**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We miss you!</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">👋</div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">We Miss You!</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">A lot has changed since your last visit</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                It's been a while since you visited LLM Trust! Here's what you've been missing:
              </p>

              <!-- Stats since last visit -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#f0f0ff,#ede9fe);border-radius:10px;padding:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="33%" align="center" style="padding:8px;">
                          <p style="margin:0;font-size:32px;font-weight:700;color:#6366f1;">{{new_models_since}}</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">New Models</p>
                        </td>
                        <td width="33%" align="center" style="padding:8px;">
                          <p style="margin:0;font-size:32px;font-weight:700;color:#6366f1;">{{new_reviews_since}}</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">New Reviews</p>
                        </td>
                        <td width="33%" align="center" style="padding:8px;">
                          <p style="margin:0;font-size:32px;font-weight:700;color:#6366f1;">{{new_features_since}}</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">New Features</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:16px;color:#374151;margin:0 0 16px;line-height:1.6;">
                <strong>Highlights since your last visit:</strong>
              </p>

              <ul style="font-size:15px;color:#374151;line-height:2;padding-left:20px;margin:0 0 32px;">
                <li>{{highlight_1}}</li>
                <li>{{highlight_2}}</li>
                <li>{{highlight_3}}</li>
              </ul>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                The LLM landscape moves fast — come back and see what's new!
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://llmtrust.com/explore" style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">See What's New →</a>
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
👋 We Miss You! — LLM Trust

Hey {{first_name}},

It's been a while since you visited LLM Trust! Here's what you've been missing:

📈 Since your last visit:
- {{new_models_since}} new models added
- {{new_reviews_since}} new reviews written
- {{new_features_since}} new features launched

Highlights:
- {{highlight_1}}
- {{highlight_2}}
- {{highlight_3}}

The LLM landscape moves fast — come back and see what's new!

See what's new: https://llmtrust.com/explore

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Unsubscribe: {{unsubscribe_url}}
```
