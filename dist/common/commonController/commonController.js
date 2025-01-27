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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controller_1 = __importDefault(require("../../abstract/abstract.controller"));
const common_service_1 = __importDefault(require("../commonService/common.service"));
class commonController extends abstract_controller_1.default {
    constructor() {
        super();
        this.commonService = new common_service_1.default();
        // send email otp
        this.sendEmailOtpController = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, type } = req.body;
            let table = '';
            let field = '';
            let otpFor = '';
            switch (type) {
                case 'forget_admin':
                    table = 'admin_user';
                    field = 'au_email';
                    otpFor = 'Admin Reset Password';
                    break;
                case 'forget_agent':
                    table = 'users';
                    field = 'email';
                    otpFor = 'agent Reset Password';
                default:
                    break;
            }
            const obj = { email, type, otpFor };
            console.log({ obj });
            let data = {
                success: false,
                message: 'Something is wrong',
            };
            if (type.startsWith('forget')) {
                const checkUser = yield this.commonService.checkUserByUniqueKey({
                    table,
                    field,
                    value: email,
                });
                console.log(checkUser);
                if (checkUser) {
                    console.log('error start from.............................');
                    data = yield this.commonService.sendOtpToEmailService(obj);
                    console.log({ data });
                }
                else {
                    data = {
                        success: false,
                        message: 'No user found with this email.',
                    };
                }
            }
            else if (type.startsWith('register')) {
                const checkUser = yield this.commonService.checkUserByUniqueKey({
                    table,
                    field,
                    value: email,
                });
                if (!checkUser) {
                    data = yield this.commonService.sendOtpToEmailService(obj);
                }
                else {
                    data = {
                        success: false,
                        message: 'User already exist with this email.',
                    };
                }
            }
            else {
                data = yield this.commonService.sendOtpToEmailService(obj);
            }
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message || 'Something went wrong', 400);
            }
        }));
        // match email otp
        this.matchEmailOtpController = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp, type } = req.body;
            const data = yield this.commonService.matchEmailOtpService({
                email,
                otp,
                type,
            });
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json(data);
            }
        }));
        this.restaurantLeads = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.commonService.restaurantLeads(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = commonController;
