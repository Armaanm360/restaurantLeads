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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class SendEmailHelper {
}
_a = SendEmailHelper;
SendEmailHelper.sendEmail = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'trabilllead@gmail.com',
                pass: 'ibmgaqxpnblzhmdj',
            },
        });
        const info = yield transporter.sendMail(Object.assign({ from: `trabilllead@gmail.com` }, message));
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.default = SendEmailHelper;
const sendEmail = (to, subject, htmlContent, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'trabilllead@gmail.com',
                pass: process.env.EMAIL_PASS || 'ibmgaqxpnblzhmdj',
            },
        });
        const mailOptions = Object.assign({ from: `"Trabill Support" <${process.env.EMAIL_USER}>`, to: to, subject: subject, html: htmlContent }, (attachments && {
            attachments: [
                {
                    filename: attachments === null || attachments === void 0 ? void 0 : attachments.filename,
                    content: attachments === null || attachments === void 0 ? void 0 : attachments.content,
                    contentType: attachments === null || attachments === void 0 ? void 0 : attachments.mimetype,
                    encoding: 'base64',
                },
            ],
        }));
        yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully! to ' + to);
    }
    catch (error) {
        console.error('Error sending email:', error);
        // throw error;
    }
});
exports.sendEmail = sendEmail;
