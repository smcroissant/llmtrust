# Model Approved — LLM Trust

**Subject (A):** 🎉 Your model "{{model_name}}" is now live on LLM Trust!
**Subject (B):** Approved! "{{model_name}}" is published and ready for reviews
**Preview text:** Your model passed review. See what happens next.

---

**Transactional — Triggered when admin approves a model submission**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Model Approved</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#10b981,#059669);padding:40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🎉</div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">Model Approved!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Great news! Your model submission has been reviewed and <strong>approved</strong>.
              </p>

              <!-- Model Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Model</p>
                          <p style="margin:0 0 16px;font-size:20px;font-weight:700;color:#111827;">{{model_name}}</p>

                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-right:24px;">
                                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">Provider</p>
                                <p style="margin:0;font-size:14px;color:#374151;font-weight:600;">{{provider}}</p>
                              </td>
                              <td style="padding-right:24px;">
                                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">Type</p>
                                <p style="margin:0;font-size:14px;color:#374151;font-weight:600;">{{model_type}}</p>
                              </td>
                              <td>
                                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">Status</p>
                                <p style="margin:0;font-size:14px;color:#10b981;font-weight:600;">✅ Live</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                Your model is now visible to the LLM Trust community. Users can discover it, compare it, and leave reviews.
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{model_url}}" style="display:inline-block;background-color:#10b981;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;margin-right:8px;">View Model Page →</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;color:#6b7280;margin:32px 0 0;line-height:1.6;text-align:center;">
                Share your model page on social media to attract more reviews and visibility!
              </p>

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
🎉 Model Approved — LLM Trust

Hey {{first_name}},

Great news! Your model submission has been reviewed and approved.

Model: {{model_name}}
Provider: {{provider}}
Type: {{model_type}}
Status: ✅ Live

Your model is now visible to the LLM Trust community. Users can discover it, compare it, and leave reviews.

View your model page: {{model_url}}

Share your model page on social media to attract more reviews and visibility!

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Unsubscribe: {{unsubscribe_url}}
```
