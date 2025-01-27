"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../miscellaneous/constants");
const config_1 = __importDefault(require("../../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class Lib {
    // make hashed password
    static hashPass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            return yield bcryptjs_1.default.hash(password, salt);
        });
    }
    /**
     * verify password
     */
    static compare(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hashedPassword);
        });
    }
    // create token
    static createToken(creds, secret, maxAge) {
        return jsonwebtoken_1.default.sign(creds, secret, { expiresIn: maxAge });
    }
    // verify token
    static verifyToken(token, secret) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
    // generate random Number
    static otpGenNumber(length) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let otp = '';
        for (let i = 0; i < length; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            otp += numbers[randomNumber];
        }
        return otp;
    }
    // generate random Number and alphabet
    static otpGenNumberAndAlphabet(length) {
        let otp = '';
        for (let i = 0; i < length; i++) {
            const randomNumber = Math.floor(Math.random() * constants_1.allStrings.length);
            otp += constants_1.allStrings[randomNumber];
        }
        return otp;
    }
    // send email by nodemailer
    static sendEmail(email, emailSub, emailBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: config_1.default.EMAIL_SEND_EMAIL_ID,
                        pass: config_1.default.EMAIL_SEND_PASSWORD,
                    },
                });
                const info = yield transporter.sendMail({
                    from: config_1.default.EMAIL_SEND_EMAIL_ID,
                    to: email,
                    subject: emailSub,
                    html: emailBody,
                });
                console.log('Message send: %s', info);
                return true;
            }
            catch (err) {
                console.log({ err });
                return false;
            }
        });
    }
    // getnerate email otp html
    static generateHtmlOtpPage(otp, otpFor) {
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
exports.default = Lib;
