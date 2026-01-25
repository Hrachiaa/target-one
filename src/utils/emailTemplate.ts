import dedent from 'ts-dedent';

export function emailTemplateResetCode(code: string): string {
    return dedent(
        `
        <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color:#2c3e50;">Target One</h2>
        <p>Here is your password reset code:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2c3e50;">
          ${code}
        </p>
        <p>This code will expire in 15 minutes.</p>
        <hr>
        <p style="font-size: 12px; color:#888;">
          If you did not request this, please ignore this email.<br>
          For support, contact us at <a href="mailto:targetone.app@gmail.com">targetone.app@gmail.com</a>
        </p>
      </body>
    </html>
        `
    );
}

export function emailTemplateConfirmCode(code: string): string {
    return dedent(
        `
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
      <style>
          body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background-color: #f4f6f8;
              color: #333;
              margin: 0;
              padding: 40px 0;
          }
          .container {
              max-width: 480px;
              margin: 0 auto;
              background: #fff;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          h1 {
              text-align: center;
              color: #111;
              font-size: 22px;
              margin-bottom: 24px;
          }
          .code-box {
              background: #f0f2f5;
              border-radius: 8px;
              text-align: center;
              padding: 16px 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 4px;
              color: #007bff;
          }
          p {
              text-align: center;
              font-size: 15px;
              color: #555;
          }
          .footer {
              margin-top: 32px;
              text-align: center;
              font-size: 13px;
              color: #999;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Email Verification</h1>
          <p>Use the code below to verify your email address:</p>
          <div class="code-box">${code}</div>
          <p>This code is valid for 10 minutes.</p>
          <div class="footer">
              If you didn’t request this verification, you can safely ignore this email.
          </div>
      </div>
  </body>
  </html>
        `
    );
}
