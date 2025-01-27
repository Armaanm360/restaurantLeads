"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentAcknowledgment2 = void 0;
const paymentAcknowledgment2 = (recipientName, amountPaid, paymentDateRange, totalDue, paymentRequest) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You For Being a Customer!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            border: 1px solid #ddd;
            padding: 20px;
        }
        h1 {
            font-size: 18px;
            margin-top: 0;
        }
        .info {
            margin-bottom: 20px;
        }
        .company-info {
            margin-bottom: 20px;
        }
        .charge-info {
            background-color: #F9F9F9;
            padding: 10px;
            border: 1px solid #eee;
            margin-bottom: 20px;
        }
        .instructions {
            font-size: 14px;
        }
        a {
            color: #0066CC;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thank You For Being a Customer!</h1>
        <div class="info">
            <p>Billing period: 2024-04-05 - 2024-05-04</p>
            <p>Invoice number: ••••••••</p>
        </div>
        <div class="company-info">
            <p>Litmus Software, Inc.<br>
            675 Massachusetts Ave., 10th Floor<br>
            Cambridge, MA 02139 - USA</p>
        </div>
        <div class="charge-info">
            <p>We've successfully charged $210.94 to card number •••• •••• •••• •••• on 04/05/2024.</p>
        </div>
        <p><a href="#">Log in and download invoice →</a></p>
        <p class="instructions">After you log in, click your company name and head to Settings, then Invoices and Billing. View previous invoices and download your most current one here.</p>
        <p>Thank you again for your business. If you <a href="#">need help</a> or have any questions, just respond to this email to reach our friendly support team.</p>
    </div>
</body>
</html>
  `;
};
exports.paymentAcknowledgment2 = paymentAcknowledgment2;
