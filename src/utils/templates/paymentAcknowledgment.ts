import { projectLogo, projectName, projectURL } from './templateConstants';

export const paymentAcknowledgment = (
  recipientName: string,
  amountPaid: number,
  paymentDateRange: string,
  totalDue: number,
  paymentRequest: string
) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Confirmation - ${projectName}</title>
      <style>
        /* Reset default styles */
        body, p {
          margin: 0;
          padding: 0;
        }

        /* Container */
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
        }

        /* Header */
        .header {
          text-align: center;
          padding: 20px;
          background-color: #004085;
          color: #fff;
        }

        .header img {
          max-width: 150px;
        }

        /* Content */
        .content {
          padding: 20px;
          background-color: #ffffff;
          border: 1px solid #ddd;
        }

        /* Highlight */
        .highlight {
          color: #007bff;
          font-weight: bold;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #777;
        }

        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <img src="${projectLogo}" alt="${projectName} Logo" />
          <h1>Payment Confirmation</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p>Dear ${recipientName},</p>
          <br />
          <p>We would like to extend our gratitude for your recent payment. Your payment of <span class="highlight">$${amountPaid}</span> has been successfully processed.</p>
          <p>This payment covers the period from <span class="highlight">${paymentDateRange}</span>.</p>
          <br />
          <p>Currently, your outstanding balance is <span class="highlight">$${totalDue}</span>.</p>
          <p>You have requested to settle this amount by the end of the month. If any changes need to be made or you require further assistance, please do not hesitate to contact our support team.</p>
          <br />
          <p>For detailed information about your payment, you can log in to your account at:</p>
          <p><a href="${projectURL}" class="highlight">Your Account Portal</a></p>
          <br />
          <p>Thank you for your continued trust in ${projectName}.</p>
          <br />
          <p>Best regards,</p>
          <p>The ${projectName} Team</p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:${``}">${``}</a>.</p>
          <p>&copy; ${new Date().getFullYear()} ${projectName}. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
