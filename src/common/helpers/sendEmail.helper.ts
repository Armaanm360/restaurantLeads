import nodemailer from 'nodemailer';
abstract class SendEmailHelper {
  public static sendEmail = async (message: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'trabilllead@gmail.com',
          pass: 'ibmgaqxpnblzhmdj',
        },
      });

      const info = await transporter.sendMail({
        from: `trabilllead@gmail.com`,
        ...message,
      });

      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };
}

export default SendEmailHelper;

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  attachments?: {
    filename: string;
    content: any;
    mimetype: string;
  }
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'trabilllead@gmail.com',
        pass: process.env.EMAIL_PASS || 'ibmgaqxpnblzhmdj',
      },
    });

    const mailOptions = {
      from: `"Trabill Support" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      ...(attachments && {
        attachments: [
          {
            filename: attachments?.filename,
            content: attachments?.content,
            contentType: attachments?.mimetype,
            encoding: 'base64',
          },
        ],
      }),
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! to ' + to);
  } catch (error) {
    console.error('Error sending email:', error);
    // throw error;
  }
};
