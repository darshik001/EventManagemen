const jwt = require('jsonwebtoken')

const logoUrl = "https://trigontic.com/wp-content/uploads/2018/04/trigontic-227x60.png"
exports.ForgotgenerateJwtToken = (data) => {
    return jwt.sign({ id: data.id || data._id, role: data.role }, process.env.FORGOT_PASSWORD_JWT_SECRET,{ expiresIn: "10m" })

}






exports.ForgetPasswordMail = (email,name,resetLink) => {
return {
from:process.env.EMAIL_USER,
to:email,
subject:"Reset Your Password - Nehdo",
html:`
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Reset Your Password - TR Book</title>
<!--[if mso]>
<style type="text/css">
  table, td, div, p, a, span { font-family: Arial, sans-serif !important; }
</style>
<![endif]-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
 
  body, table, td, p, a, li, blockquote {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
 
  .btn-primary:hover {
    background: #1e293b !important;
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.45) !important;
  }
 
  .link-hover:hover {
    color: #4338ca !important;
    text-decoration: underline !important;
  }
 
  @media only screen and (max-width: 620px) {
    .email-container {
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 12px !important;
      margin: 0 auto !important;
    }
    .header-cell {
      padding: 32px 22px !important;
    }
    .body-cell {
      padding: 30px 20px !important;
    }
    .footer-cell {
      padding: 26px 20px !important;
    }
    .header-title {
      font-size: 24px !important;
      line-height: 32px !important;
    }
    .btn-block {
      display: block !important;
      width: 100% !important;
      text-align: center !important;
      padding: 15px 20px !important;
      box-sizing: border-box !important;
    }
    .footer-stack {
      display: block !important;
      width: 100% !important;
      text-align: left !important;
      margin-top: 14px !important;
    }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f1f4f9;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
 
<!-- PREHEADER HIDDEN TEXT -->
<div style="display:none;font-size:1px;color:#f1f4f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
  Reset your TR Book password safely and quickly. This link is valid for 10 minutes.
</div>
 
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f4f9;padding:40px 12px 50px 12px;">
<tr>
<td align="center" valign="top">
 
  <!-- MAIN CARD CONTAINER -->
  <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 45px -12px rgba(15,23,42,0.12),0 0 0 1px rgba(226,232,240,0.8);border:1px solid #e2e8f0;">
   
    <!-- ACCENT TOP GRADIENT BAR -->
    <tr>
      <td height="4" style="height:4px;background:linear-gradient(90deg,#3b82f6 0%,#6366f1 50%,#8b5cf6 100%);font-size:0;line-height:0;">&nbsp;</td>
    </tr>
 
    <!-- BRAND HEADER (PREMIUM OBSIDIAN SLATE) -->
    <tr>
      <td class="header-cell" style="background:#090d16;background-image:linear-gradient(150deg,#0a0e1a 0%,#111827 55%,#0f172a 100%);padding:42px 38px 38px 38px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle">
              <img src="${logoUrl}" alt="TR Book" width="118" style="display:block;width:118px;max-width:100%;height:auto;border:0;filter:brightness(0) invert(1);">
            </td>
            <td align="right" valign="middle">
              <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
                <tr>
                  <td style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:9999px;padding:5px 13px;">
                    <span style="display:inline-block;width:6px;height:6px;background:#10b981;border-radius:50%;margin-right:7px;vertical-align:middle;box-shadow:0 0 8px rgba(16,185,129,0.8);"></span>
                    <span style="color:#cbd5e1;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;vertical-align:middle;">Account Security</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
 
        <!-- SUB-BADGE -->
        <div style="margin-top:36px;">
          <span style="display:inline-block;background:rgba(99,102,241,0.16);border:1px solid rgba(129,140,248,0.28);color:#c7d2fe;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;border-radius:6px;">
            Secure Authentication
          </span>
        </div>
 
        <!-- TITLE -->
        <div class="header-title" style="margin-top:14px;color:#ffffff;font-size:28px;line-height:36px;font-weight:700;letter-spacing:-0.5px;">
          Reset your password.
        </div>
 
        <!-- SUBTITLE -->
        <div style="margin-top:10px;color:#94a3b8;font-size:14px;line-height:22px;font-weight:400;max-width:440px;">
          A simple and safe verification step to get you smoothly back into your TR Book account.
        </div>
      </td>
    </tr>
 
    <!-- BODY CONTENT -->
    <tr>
      <td class="body-cell" style="padding:42px 40px 36px 40px;background:#ffffff;">
 
        <!-- USER GREETING -->
        <div style="font-size:20px;line-height:28px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;margin-bottom:14px;">
          Hello, ${name}
        </div>
 
        <!-- INTRO TEXT -->
        <div style="font-size:14.5px;line-height:25px;color:#475569;margin-bottom:8px;">
          We received a verified request to reset the password associated with your <strong style="color:#0f172a;font-weight:600;">TR Book</strong> account.
        </div>
 
        <div style="font-size:14.5px;line-height:25px;color:#475569;">
          Click the secure button below to set a new password and immediately regain access.
        </div>
 
        <!-- PRIMARY CTA BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:34px 0 32px 0;">
          <tr>
            <td align="left">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius:12px;background:#0f172a;box-shadow:0 10px 22px -5px rgba(15,23,42,0.38),0 3px 6px -2px rgba(15,23,42,0.18);">
                    <a class="btn-primary btn-block" href="https://eventmanagemen-production.up.railway.app/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjNhMDI5NmRhYTMzZjYwNWE3MmM1ZSIsImlhdCI6MTc5MjA0NDI4MSwiZXhwIjoxNzkyMDQ0ODgxfQ.kKppxKld3mUWQigWXG6W_UStDlvUrxNAbJ2nCb8wtRA%22 target="_blank" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:600;padding:16px 36px;border-radius:12px;letter-spacing:0.2px;transition:all 0.2s ease;">
                      Reset Password &nbsp;&rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
 
        <!-- EXPIRY ALERT CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffbeb;border:1px solid #fef3c7;border-left:4px solid #f59e0b;border-radius:10px;margin-bottom:20px;">
          <tr>
            <td style="padding:15px 18px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="padding-right:12px;">
                    <div style="width:24px;height:24px;line-height:24px;text-align:center;background:#fef3c7;border-radius:50%;font-size:13px;">
                      &#x23F1;
                    </div>
                  </td>
                  <td valign="top">
                    <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:2px;letter-spacing:-0.1px;">
                      Link expires in 10 minutes
                    </div>
                    <div style="font-size:12.5px;line-height:19px;color:#b45309;">
                      For your protection, this temporary link will deactivate after 10 minutes. Please reset your password right away.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
 
        <!-- SECURITY NOTICE CARD -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:28px;">
          <tr>
            <td style="padding:14px 18px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="padding-right:12px;">
                    <div style="width:24px;height:24px;line-height:24px;text-align:center;background:#e2e8f0;border-radius:50%;font-size:13px;">
                      &#x1F6E1;
                    </div>
                  </td>
                  <td valign="top">
                    <div style="font-size:12.5px;font-weight:700;color:#334155;margin-bottom:2px;">
                      Didn't request this?
                    </div>
                    <div style="font-size:12px;line-height:18px;color:#64748b;">
                      If you did not initiate this request, you can safely ignore this email. Your current password remains secure and no account details have been changed.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
 
        <!-- FALLBACK LINK SECTION -->
        <div style="border-top:1px solid #f1f5f9;padding-top:22px;">
          <div style="font-size:12px;font-weight:600;color:#64748b;margin-bottom:8px;">
            If the button doesn't work, copy and paste this link into your browser:
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11.5px;line-height:18px;word-break:break-all;color:#4f46e5;">
                <a href="https://eventmanagemen-production.up.railway.app/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjNhMDI5NmRhYTMzZjYwNWE3MmM1ZSIsImlhdCI6MTc5MjA0NDI4MSwiZXhwIjoxNzkyMDQ0ODgxfQ.kKppxKld3mUWQigWXG6W_UStDlvUrxNAbJ2nCb8wtRA%22 target="_blank" style="color:#4f46e5;text-decoration:none;word-break:break-all;">https://eventmanagemen-production.up.railway.app/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjNhMDI5NmRhYTMzZjYwNWE3MmM1ZSIsImlhdCI6MTc5MjA0NDI4MSwiZXhwIjoxNzkyMDQ0ODgxfQ.kKppxKld3mUWQigWXG6W_UStDlvUrxNAbJ2nCb8wtRA</a>
              </td>
            </tr>
          </table>
        </div>
 
      </td>
    </tr>
 
    <!-- FOOTER -->
    <tr>
      <td class="footer-cell" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:32px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle">
              <img src="${logoUrl}" alt="TR Book" width="92" style="display:block;width:92px;max-width:100%;height:auto;border:0;">
            </td>
          </tr>
        </table>
 
        <div style="height:1px;background:#e2e8f0;margin:22px 0;"></div>
 
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="top" style="font-size:11px;line-height:18px;color:#94a3b8;">
              &copy; ${new Date().getFullYear()} TR Book. All Rights Reserved.<br>
              This is a secure automated notification. Please do not reply directly to this email.
            </td>
            <td class="footer-stack" align="right" valign="top" style="font-size:11px;color:#94a3b8;line-height:18px;">
              <span style="color:#cbd5e1;padding:0 6px;">&bull;</span>
              <a href="#" style="color:#64748b;text-decoration:none;font-weight:500;">Security Center</a>
              <span style="color:#cbd5e1;padding:0 6px;">&bull;</span>
              <a href="#" style="color:#64748b;text-decoration:none;font-weight:500;">Privacy Policy</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
 
  </table>
 
  <!-- EXTERNAL DISCLAIMER -->
  <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin-top:18px;">
    <tr>
      <td align="center" style="font-size:11px;line-height:18px;color:#94a3b8;">
        Protected by TR Book Multi-layer Fraud &amp; Identity Shield.
      </td>
    </tr>
  </table>
 
</td>
</tr>
</table>
 
</body>
</html>
`,
};
};