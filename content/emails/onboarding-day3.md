# Onboarding Day 3 — LLM Trust

**Subject (A):** Still exploring? These 3 models are trending right now 🔥
**Subject (B):** 3 days in — here's what you're missing on LLM Trust
**Preview text:** Featured models picked for you based on developer trends.

---

**Marketing — Sent 3 days after sign-up (if user hasn't explored much)**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Featured Models for You</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center;">
              <img src="https://llmtrust.com/logo-white.png" alt="LLM Trust" width="40" height="40" style="margin-bottom:12px;" />
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Trending This Week 🔥</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Hand-picked models for you</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                You signed up 3 days ago and we wanted to make sure you didn't miss these <strong>top-trending models</strong> that developers are loving right now:
              </p>

              <!-- Featured Model 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                            <tr>
                              <td style="background-color:#6366f1;color:#ffffff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:4px;text-transform:uppercase;">🔥 Trending</td>
                              <td style="padding-left:8px;font-size:20px;color:#f59e0b;">⭐ {{rating_1}}/5</td>
                            </tr>
                          </table>
                          <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">{{model_1_name}}</p>
                          <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">{{model_1_provider}} · {{model_1_type}} · {{model_1_downloads}} downloads</p>
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;">{{model_1_description}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Featured Model 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                            <tr>
                              <td style="background-color:#10b981;color:#ffffff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:4px;text-transform:uppercase;">⚡ Fast</td>
                              <td style="padding-left:8px;font-size:20px;color:#f59e0b;">⭐ {{rating_2}}/5</td>
                            </tr>
                          </table>
                          <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">{{model_2_name}}</p>
                          <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">{{model_2_provider}} · {{model_2_type}} · {{model_2_downloads}} downloads</p>
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;">{{model_2_description}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Featured Model 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                            <tr>
                              <td style="background-color:#ec4899;color:#ffffff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:4px;text-transform:uppercase;">💎 Best Value</td>
                              <td style="padding-left:8px;font-size:20px;color:#f59e0b;">⭐ {{rating_3}}/5</td>
                            </tr>
                          </table>
                          <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">{{model_3_name}}</p>
                          <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">{{model_3_provider}} · {{model_3_type}} · {{model_3_downloads}} downloads</p>
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;">{{model_3_description}}</p>
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
                    <a href="https://llmtrust.com/explore" style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">Explore All Models →</a>
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
🔥 Trending This Week — LLM Trust

Hey {{first_name}},

You signed up 3 days ago and we wanted to make sure you didn't miss these top-trending models:

1. 🔥 {{model_1_name}} — {{model_1_provider}} · {{model_1_type}}
   ⭐ {{rating_1}}/5 · {{model_1_downloads}} downloads
   {{model_1_description}}
   → https://llmtrust.com/models/{{model_1_slug}}

2. ⚡ {{model_2_name}} — {{model_2_provider}} · {{model_2_type}}
   ⭐ {{rating_2}}/5 · {{model_2_downloads}} downloads
   {{model_2_description}}
   → https://llmtrust.com/models/{{model_2_slug}}

3. 💎 {{model_3_name}} — {{model_3_provider}} · {{model_3_type}}
   ⭐ {{rating_3}}/5 · {{model_3_downloads}} downloads
   {{model_3_description}}
   → https://llmtrust.com/models/{{model_3_slug}}

Explore all models: https://llmtrust.com/explore

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Unsubscribe: {{unsubscribe_url}}
```
