
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
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Reset Your Password - Nehdo</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:Arial,Helvetica,sans-serif;color:#171717">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f3;padding:35px 15px">
<tr><td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#fff;border-radius:16px;overflow:hidden">

<!-- BRAND HEADER -->
<tr>
<td style="background:#171717;padding:38px 30px">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<img src="${logoUrl}" alt="Nehdo" width="115" style="display:block;width:115px;max-width:100%;height:auto;border:0;filter:brightness(0) invert(1)">
</td>
<td align="right" style="color:#aaa;font-size:11px;letter-spacing:1.5px;text-transform:uppercase">
Account Security
</td>
</tr>
</table>

<div style="margin-top:42px;color:#aaa;font-size:11px;letter-spacing:2.5px;text-transform:uppercase">
Secure Access
</div>

<div style="margin-top:10px;color:#fff;font-size:28px;line-height:36px;font-weight:500">
Reset your password.
</div>

<div style="margin-top:9px;color:#aaa;font-size:13px;line-height:21px">
A simple and secure way to get back into your account.
</div>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:40px 42px">

<div style="font-size:22px;line-height:30px;font-weight:600;color:#171717;margin-bottom:16px">
Hello, ${name}
</div>

<div style="font-size:14px;line-height:24px;color:#666">
We received a request to reset the password for your
<strong style="color:#171717">Nehdo</strong> account.
</div>

<div style="font-size:14px;line-height:24px;color:#666;margin-top:8px">
Click the button below to securely create a new password.
</div>

<!-- BUTTON -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px">
<tr><td>
<a href="${resetLink}" target="_blank" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:15px 32px;border-radius:8px">
Reset Password
</a>
</td></tr>
</table>

<!-- EXPIRY -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;background:#f7f7f5;border:1px solid #e5e5e2;border-radius:9px">
<tr>
<td style="padding:15px 16px">
<div style="font-size:12px;line-height:20px;color:#555">
<strong style="color:#171717">Link expires in 10 minutes.</strong><br>
For your security, please complete the password reset before the link expires.
</div>
</td>
</tr>
</table>

<!-- SECURITY -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px">
<tr>
<td style="border-top:1px solid #e8e8e8;padding-top:24px">
<div style="font-size:12px;line-height:20px;color:#999">
If you didn't request this password reset, you can safely ignore this email. Your account will remain secure.
</div>
</td>
</tr>
</table>

<!-- FALLBACK -->
<div style="margin-top:25px;font-size:11px;line-height:18px;color:#aaa">
If the button doesn't work, copy and paste this link into your browser:
</div>

<div style="margin-top:7px;font-size:11px;line-height:18px;word-break:break-all;color:#555">
${resetLink}
</div>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fafafa;border-top:1px solid #e8e8e8;padding:28px 30px">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<img src="${logoUrl}" alt="Nehdo" width="90" style="display:block;width:90px;max-width:100%;height:auto;border:0">
</td>
<td align="right" style="font-size:11px;color:#999;line-height:18px">
Connecting Buyers &amp; Sellers<br>with Trust.
</td>
</tr>
</table>

<div style="height:1px;background:#e5e5e5;margin:22px 0"></div>

<div style="font-size:10px;line-height:17px;color:#aaa">
© ${new Date().getFullYear()} Nehdo. All Rights Reserved.
</div>
</td>
</tr>

</table>

<div style="max-width:600px;margin:15px auto 0;text-align:center;font-size:10px;line-height:17px;color:#aaa">
This is an automated email. Please do not reply to this message.
</div>

</td></tr>
</table>
</body>
</html>
`,
};
};