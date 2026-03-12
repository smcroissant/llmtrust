# Model Rejected — LLM Trust

**Subject (A):** Your model "{{model_name}}" needs some changes before publication
**Subject (B):** Submission update — "{{model_name}}" was not approved
**Preview text:** Here's why and how to fix it.

---

**Transactional — Triggered when admin rejects a model submission**

---

## HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Model Submission Update</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">📋</div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">Submission Needs Changes</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Hey <strong>{{first_name}}</strong>,
              </p>

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                Thanks for submitting <strong>"{{model_name}}"</strong> to LLM Trust. After review, we're unable to publish it in its current form.
              </p>

              <!-- Rejection Reason -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:24px;">
                    <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#92400e;">📌 Reason for rejection:</p>
                    <p style="margin:0;font-size:15px;color:#78350f;line-height:1.6;">{{rejection_reason}}</p>
                  </td>
                </tr>
              </table>

              <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
                <strong>Common issues include:</strong>
              </p>

              <ul style="font-size:15px;color:#6b7280;line-height:1.8;padding-left:20px;margin:0 0 32px;">
                <li>Incomplete model documentation or missing benchmarks</li>
                <li>Duplicate submission (model already listed)</li>
                <li>Inaccurate or unverifiable performance claims</li>
                <li>Missing license or usage terms information</li>
              </ul>

              <p style="font-size:16px;color:#374151;margin:0 0 32px;line-height:1.6;">
                You can edit your submission and resubmit it for review. We're here to help — just reply to this email if you have questions.
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{edit_submission_url}}" style="display:inline-block;background-color:#f59e0b;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;">Edit & Resubmit →</a>
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
📋 Submission Needs Changes — LLM Trust

Hey {{first_name}},

Thanks for submitting "{{model_name}}" to LLM Trust. After review, we're unable to publish it in its current form.

📌 Reason for rejection:
{{rejection_reason}}

Common issues include:
- Incomplete model documentation or missing benchmarks
- Duplicate submission (model already listed)
- Inaccurate or unverifiable performance claims
- Missing license or usage terms information

You can edit your submission and resubmit it for review. Reply to this email if you have questions.

Edit & Resubmit: {{edit_submission_url}}

— The LLM Trust Team

---
LLM Trust — The developer's platform for LLM discovery
Unsubscribe: {{unsubscribe_url}}
```
