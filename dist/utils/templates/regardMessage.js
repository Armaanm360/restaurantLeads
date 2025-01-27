"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regardMessage = void 0;
const regardMessage = (customerName, propertyAddress, agentName) => {
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Property Inquiry</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-top: 4px solid #007bff;
        }
        .header {
          text-align: center;
          color: #007bff;
        }
        .header h2 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          color: #333;
        }
        .content h3 {
          color: #007bff;
          margin-bottom: 10px;
        }
        .content p {
          line-height: 1.6;
          font-size: 16px;
          color: #555;
        }
        .content a {
          color: #007bff;
          text-decoration: none;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 14px;
          padding-top: 20px;
          border-top: 1px solid #eeeeee;
        }
        .signature {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eeeeee;
          color: #333;
        }
        .signature p {
          margin: 5px 0;
        }
        .agent-title {
          color: #ff6f61;
          font-size: 16px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Your Interest in Our Property</h2>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>Thank you for expressing interest in the property located at <strong>${propertyAddress}</strong>. We’re excited to help you explore this opportunity further.</p>
          
          <p>As your assigned agent, I’ll be here to assist with any questions you may have and to arrange a convenient time for you to visit the property. Here’s what you can expect as next steps:</p>
          
          <h3>Property Details and Viewing</h3>
          <p>I’ll send over detailed information about the property and will follow up to schedule a viewing at your preferred time.</p>
          
          <h3>Financing and Documentation</h3>
          <p>If needed, I can provide resources and contacts to assist with financing options and answer any questions about the paperwork involved.</p>
          
          <h3>Ongoing Support</h3>
          <p>I’ll be your point of contact throughout the process to ensure a smooth and enjoyable experience.</p>
          
          <p>Please feel free to reach out if you have any immediate questions. I’ll be in touch shortly to coordinate our next steps.</p>

          <div class="signature">
            <p>Warm regards,</p>
            <p><strong>${agentName}</strong></p>
            <p class="agent-title">Verified Agent, Expert Level</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${'shanta property management'}. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
exports.regardMessage = regardMessage;
