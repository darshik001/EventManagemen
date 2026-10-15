const jwt = require('jsonwebtoken')

const logoUrl = "https://trigontic.com/wp-content/uploads/2018/04/trigontic-227x60.png"
exports.ForgotgenerateJwtToken = (data) => {
    return jwt.sign({ id: data.id || data._id, role: data.role }, process.env.FORGOT_PASSWORD_JWT_SECRET,{ expiresIn: "10m" })

}







exports.ForgetPasswordMail = (email, name, resetLink) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - TR Book",
    html: `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Reset Your Password - TR Book</title>

<style>
  body, table, td, p, a {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #f1f4f9;
    font-family: Arial, Helvetica, sans-serif;
    color: #1e293b;
  }

  .btn-primary:hover {
    background: #1e293b !important;
  }

  @media only screen and (max-width: 620px) {
    .email-container {
      width: 100% !important;
      max-width: 100% !important;
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

    .btn-block {
      display: block !important;
      text-align: center !important;
    }
  }
</style>
</head>

<body style="margin:0;padding:0;background-color:#f1f4f9;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">

<div style="display:none;font-size:1px;color:#f1f4f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  Reset your TR Book password. This link is valid for 10 minutes.
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f4f9;padding:40px 12px 50px;">
<tr>
<td align="center" valign="top">

  <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

    <tr>
      <td height="4" style="height:4px;background:#6366f1;font-size:0;line-height:0;">&nbsp;</td>
    </tr>

    <tr>
      <td class="header-cell" style="background:#0f172a;padding:42px 38px 38px;">

        <img
          src="${logoUrl}"
          alt="TR Book"
          width="118"
          style="display:block;width:118px;max-width:100%;height:auto;border:0;"
        >

        <div style="margin-top:30px;">
          <span style="display:inline-block;background:#312e81;color:#c7d2fe;font-size:10px;font-weight:700;letter-spacing:2px;padding:6px 10px;border-radius:6px;">
            SECURE AUTHENTICATION
          </span>
        </div>

        <div style="margin-top:14px;color:#ffffff;font-size:28px;line-height:36px;font-weight:700;">
          Reset your password.
        </div>

        <div style="margin-top:10px;color:#cbd5e1;font-size:14px;line-height:22px;">
          A simple and secure way to regain access to your TR Book account.
        </div>

      </td>
    </tr>

    <tr>
      <td class="body-cell" style="padding:42px 40px 36px;background:#ffffff;">

        <div style="font-size:20px;line-height:28px;font-weight:700;color:#0f172a;margin-bottom:14px;">
          Hello, ${name || "User"}
        </div>

        <div style="font-size:14px;line-height:25px;color:#475569;margin-bottom:12px;">
          We received a request to reset the password associated with your
          <strong style="color:#0f172a;">TR Book</strong> account.
        </div>

        <div style="font-size:14px;line-height:25px;color:#475569;">
          Click the button below to securely set a new password.
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:34px 0;">
          <tr>
            <td align="left">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius:10px;background:#0f172a;">

                    <a
                      class="btn-primary btn-block"
                      href="${resetLink}"
                      target="_blank"
                      style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:16px 36px;border-radius:10px;"
                    >
                      Reset Password &rarr;
                    </a>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffbeb;border:1px solid #fef3c7;border-left:4px solid #f59e0b;border-radius:10px;margin-bottom:20px;">
          <tr>
            <td style="padding:15px 18px;">

              <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:5px;">
                Link expires in 10 minutes
              </div>

              <div style="font-size:12px;line-height:19px;color:#b45309;">
                For your security, this password reset link will expire after 10 minutes.
              </div>

            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:28px;">
          <tr>
            <td style="padding:14px 18px;">

              <div style="font-size:12px;font-weight:700;color:#334155;margin-bottom:5px;">
                Didn't request this?
              </div>

              <div style="font-size:12px;line-height:18px;color:#64748b;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </div>

            </td>
          </tr>
        </table>

        <div style="border-top:1px solid #f1f5f9;padding-top:22px;">

          <div style="font-size:12px;font-weight:600;color:#64748b;margin-bottom:10px;">
            If the button doesn't work, copy and paste this link into your browser:
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:12px;line-height:20px;word-break:break-all;">

                <a
                  href="${resetLink}"
                  target="_blank"
                  style="color:#4f46e5;text-decoration:none;word-break:break-all;"
                >${resetLink}</a>

              </td>
            </tr>
          </table>

        </div>

      </td>
    </tr>

    <tr>
      <td class="footer-cell" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:32px 40px;">

        <img
          src="${logoUrl}"
          alt="TR Book"
          width="92"
          style="display:block;width:92px;max-width:100%;height:auto;border:0;"
        >

        <div style="height:1px;background:#e2e8f0;margin:22px 0;"></div>

        <div style="font-size:11px;line-height:18px;color:#94a3b8;">
          &copy; ${new Date().getFullYear()} TR Book. All Rights Reserved.<br>
          This is an automated security notification. Please do not reply directly to this email.
        </div>

      </td>
    </tr>

  </table>

  <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin-top:18px;">
    <tr>
      <td align="center" style="font-size:11px;line-height:18px;color:#94a3b8;">
        Protected by TR Book Account Security.
      </td>
    </tr>
  </table>

</td>
</tr>
</table>

</body>
</html>
`
  };
};
