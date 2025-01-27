import { allStrings } from '../miscellaneous/constants';
import config from '../../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

class Lib {
  // make hashed password
  public static async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * verify password
   */
  public static async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // create token
  public static createToken(
    creds: object,
    secret: string,
    maxAge: number | string
  ) {
    return jwt.sign(creds, secret, { expiresIn: maxAge });
  }

  // verify token
  public static verifyToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // generate random Number
  public static otpGenNumber(length: number) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * 10);

      otp += numbers[randomNumber];
    }

    return otp;
  }

  // generate random Number and alphabet
  public static otpGenNumberAndAlphabet(length: number) {
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * allStrings.length);

      otp += allStrings[randomNumber];
    }

    return otp;
  }

  // send email by nodemailer
  public static async sendEmail(
    email: string,
    emailSub: string,
    emailBody: string
  ) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.EMAIL_SEND_EMAIL_ID,
          pass: config.EMAIL_SEND_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: config.EMAIL_SEND_EMAIL_ID,
        to: email,
        subject: emailSub,
        html: emailBody,
      });

      console.log('Message send: %s', info);

      return true;
    } catch (err: any) {
      console.log({ err });
      return false;
    }
  }

  // getnerate email otp html
  public static generateHtmlOtpPage(otp: string, otpFor: string) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shanta Property OTP Verification</title>
</head>
<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
            <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%">
                    <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                        <tbody>
                            <tr>
                                <td style="padding: 40px 0px 0px">
                                    <div style="text-align: left">
                                        <div style="padding-bottom: 20px">
                                            <img src="https://i.ibb.co/w7H1LR2/m360-icon.jpg" alt="Shanta Property" style="width: 100px" />
                                        </div>
                                    </div>
                                    <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                        <div style="color: rgb(0, 0, 0); text-align: left">
                                            <h1 style="margin: 1rem 0">Verification Code</h1>
                                            <p style="padding-bottom: 16px">Please use the verification code below to ${otpFor}.</p>
                                            <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                                            <p style="padding-bottom: 16px">Validity for OTP is 3 minutes</p>
                                            <p style="padding-bottom: 16px">Thanks,<br /><b>Shanta Property</b></p>
                                        </div>
                                    </div>
                                    <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                                        <a href="https://www.shanta-property.online" style="padding-bottom: 16px; text-decoration: none; font-weight: bold;">www.shanta-property.online</a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
  }
}
export default Lib;
