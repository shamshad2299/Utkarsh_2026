export const emailVerificationTemplate = ({
  name = "User",
  otp,
  expiryMinutes = 10,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(135deg, #4f46e5, #6366f1);
        padding: 24px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        letter-spacing: 1px;
      }
      .content {
        padding: 30px;
        color: #333333;
      }
      .content p {
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 16px;
      }
      .otp-box {
        margin: 24px 0;
        text-align: center;
      }
      .otp {
        display: inline-block;
        padding: 14px 28px;
        font-size: 26px;
        letter-spacing: 6px;
        font-weight: 600;
        color: #4f46e5;
        background: #eef2ff;
        border-radius: 10px;
      }
      .note {
        font-size: 13px;
        color: #6b7280;
      }
      .divider {
        height: 1px;
        background: #e5e7eb;
        margin: 28px 0;
      }
      .cta {
        text-align: center;
        margin: 20px 0;
      }
      .cta a {
        display: inline-block;
        padding: 12px 22px;
        background: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
      }
      .link-section {
        text-align: center;
        font-size: 13px;
        margin-top: 10px;
      }
      .link-section a {
        color: #4f46e5;
        text-decoration: none;
        font-weight: 500;
      }
      .about {
        font-size: 13px;
        color: #4b5563;
        line-height: 1.6;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        background: #f9fafb;
      }
      .icon {
        text-align: center;
        margin-bottom: 20px;
      }
      .icon svg {
        width: 60px;
        height: 60px;
        color: #4f46e5;
      }
      .warning {
        background: #fff7ed;
        border-left: 4px solid #f97316;
        padding: 12px;
        border-radius: 6px;
        font-size: 13px;
        color: #7b341e;
        margin: 20px 0;
      }
      .warning strong {
        color: #c2410c;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>BBD UTKARSH 2026</h1>
      </div>

      <div class="content">
        <!-- Email Icon -->
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          Thank you for registering for <strong>BBD UTKARSH 2026</strong>! 
          Please verify your email address to complete your registration and access your Utkarsh ID.
        </p>

        <div class="otp-box">
          <span class="otp">${otp}</span>
        </div>

        <p class="note">
          This verification code is valid for <strong>${expiryMinutes} minutes</strong>.
          Please do not share this code with anyone for security reasons.
        </p>

        <!-- Warning Box -->
        <div class="warning">
          <strong>⚠️ Important:</strong> Your registration is not complete until you verify your email. 
          You will not be able to log in or receive your Utkarsh ID without verification.
        </div>

        <p>
          If you did not create an account with BBD UTKARSH 2026, you can safely ignore this email.
        </p>

        <div class="divider"></div>

        <!-- UTKARSH Website -->
        <div class="cta">
          <a href="https://bbd-utkarsh.org" target="_blank">
            Visit UTKARSH Website
          </a>
        </div>

        <div class="divider"></div>

        <!-- What is UTKARSH? -->
        <div class="about">
          <strong>What is UTKARSH?</strong><br />
          UTKARSH is the annual techno-cultural fest of Babu Banarasi Das University (BBDU), 
          bringing together students from across the nation to showcase their talents in 
          technology, culture, and innovation. Get ready for an unforgettable experience!
        </div>

        <!-- Need Help? -->
        <div class="divider"></div>

        <div class="link-section">
          Need assistance? Contact us at  
          <a href="mailto:support@bbd-utkarsh.org">
            support@bbd-utkarsh.org
          </a>
        </div>

        <!-- BBDU Official Website -->
        <div class="link-section" style="margin-top: 10px;">
          Visit BBDU Official Website:  
          <a href="https://bbdu.ac.in" target="_blank">
            bbdu.ac.in
          </a>
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} BBD UTKARSH · Babu Banarasi Das University, Lucknow<br/>
        <span style="font-size: 10px;">This is an automated message, please do not reply to this email.</span>
      </div>
    </div>
  </body>
  </html>
  `;
};