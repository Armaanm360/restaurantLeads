import { projectName } from './templateConstants';

export const welcomeMessage = (
  customerName: string,
  propertyAddress: string
) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to ${projectName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f9fd;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-top: 6px solid #0066cc;
        }
        .header {
          text-align: center;
          color: #0066cc;
        }
        .header h2 {
          margin: 0;
          font-size: 28px;
          color: #333333;
        }
        .header p {
          font-size: 18px;
          color: #666666;
        }
        .content {
          color: #333333;
          line-height: 1.6;
          font-size: 16px;
        }
        .content p {
          margin: 10px 0;
        }
        .highlight {
          color: #0066cc;
          font-weight: bold;
        }
        .cta-button {
          display: block;
          width: fit-content;
          margin: 20px auto;
          padding: 12px 20px;
          background-color: #0066cc;
          color: #ffffff;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;
        }
        .cta-button:hover {
          background-color: #004a99;
        }
        .footer {
          text-align: center;
          color: #999999;
          font-size: 14px;
          margin-top: 20px;
          border-top: 1px solid #eeeeee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Listing with ${projectName}!</h2>
          <p>We're thrilled to help you with your property listing.</p>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>
            Thank you for submitting your property located at 
            <span class="highlight">${propertyAddress}</span>. 
            We appreciate your trust in us to manage your listing.
          </p>
          <p>
            Our dedicated executive will soon reach out to discuss your listing details and answer any questions you may have. We’re here to ensure a smooth and successful experience for you.
          </p>
          <p>
            Meanwhile, feel free to reach out to us if you need immediate assistance. We're always happy to help!
          </p>
          <a href="mailto:${`
devproperty360@gmail.com`}" class="cta-button">Contact Support</a>
          <p>Or call us at <span class="highlight">${`01401033440`}</span> for direct assistance.</p>
          <p>Thank you again for choosing ${projectName}. We look forward to working together!</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ${projectName}. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
