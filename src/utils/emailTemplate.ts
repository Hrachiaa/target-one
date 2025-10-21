import dedent from 'ts-dedent';

export default function emailTemplate(code: string) {
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
