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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const config_1 = __importDefault(require("../../config/config"));
class CommonService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // send otp to email
    sendOtpToEmailService(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ o2222222222222bj: obj });
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // Check if an OTP can be sent
                const checkOtp = yield trx('email_otp')
                    .withSchema(this.schema.DBO)
                    .select('id', 'hashed_otp', 'tried')
                    .where('email', obj.email)
                    .andWhere('type', obj.type)
                    .andWhere('matched', 0)
                    .andWhere('tried', '<', 3)
                    .andWhere('create_date', '>', trx.raw("NOW() - INTERVAL '3 minutes'"));
                console.log({ checkOtp });
                if (checkOtp.length > 0) {
                    return {
                        success: false,
                        message: 'Cannot send another OTP within 3 minutes',
                    };
                }
                const otp = lib_1.default.otpGenNumber(6);
                const hashed_otp = yield lib_1.default.hashPass(otp);
                const otpCreds = {
                    hashed_otp: hashed_otp,
                    email: obj.email,
                    type: obj.type,
                };
                // Send the email
                const sended = yield lib_1.default.sendEmail(obj.email, `Your One Time OTP for Shanta Property ${obj.otpFor}`, lib_1.default.generateHtmlOtpPage(otp, obj.otpFor));
                console.log({ sended });
                // Insert the OTP credentials
                yield trx('email_otp').withSchema(this.schema.DBO).insert(otpCreds);
                // Return the result based on email sending success
                if (sended) {
                    return {
                        success: true,
                        message: 'OTP sent successfully',
                        data: {
                            email: obj.email,
                        },
                    };
                }
                else {
                    return { success: false, message: 'Cannot send OTP' };
                }
            }));
        });
    }
    // match email otp
    matchEmailOtpService(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = 'email_otp';
            const checkOtp = yield this.db(table)
                .withSchema(this.schema.DBO)
                .select('id', 'hashed_otp', 'tried')
                .where('email', obj.email)
                .where('type', obj.type)
                .where('matched', 0)
                .andWhere('create_date', '>', this.db.raw("NOW() - INTERVAL '3 minutes'"));
            if (!checkOtp.length) {
                return {
                    success: false,
                    message: 'OTP expired',
                };
            }
            const { id, hashed_otp, tried } = checkOtp[0];
            if (tried > 3) {
                return {
                    success: false,
                    message: 'You tried more then 3 time for this otp verification!',
                };
            }
            console.log({ obj, hashed_otp });
            const otpValidation = yield lib_1.default.compare(obj.otp, hashed_otp);
            if (otpValidation) {
                yield this.db(table)
                    .withSchema(this.schema.DBO)
                    .update({
                    tried: tried + 1,
                    matched: 1,
                })
                    .where('id', id);
                let secret = config_1.default.JWT_SECRET_ADMIN;
                switch (obj.type) {
                    case 'forget_admin':
                        secret = config_1.default.JWT_SECRET_ADMIN;
                        break;
                    case 'forget_agent':
                        secret = config_1.default.JWT_SECRET_AGENT;
                        break;
                    default:
                        break;
                }
                const token = lib_1.default.createToken({
                    email: obj.email,
                    type: obj.type,
                }, secret, '5m');
                return {
                    success: true,
                    message: 'OTP matched successfully!',
                    token,
                };
            }
            else {
                yield this.db(table)
                    .withSchema(this.schema.DBO)
                    .update({
                    tried: tried + 1,
                })
                    .where('id', id);
                return {
                    success: false,
                    message: 'Invalid OTP',
                };
            }
        });
    }
    // common change password
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password } = req.body;
            const { email, id } = req.agent;
            const checkUser = yield this.db('users')
                .withSchema(this.schema.USER_SCHEMA)
                .where({ email })
                .first();
            if (!checkUser) {
                return {
                    success: false,
                    code: 404,
                    message: 'User not found',
                };
            }
            const password = checkUser.password;
            const verify = yield lib_1.default.compare(old_password, password);
            if (!verify) {
                return {
                    success: false,
                    code: 400,
                    message: "Previous password doesn't match",
                };
            }
            const hashedPass = yield lib_1.default.hashPass(new_password);
            const updatePass = yield this.db('users')
                .withSchema(this.schema.USER_SCHEMA)
                .where({ id })
                .update({ password: hashedPass });
            if (!updatePass) {
                return {
                    success: false,
                    code: 500,
                };
            }
            return {
                success: true,
                data: updatePass,
                code: 200,
                message: 'password has been changed',
            };
        });
    }
    forgetPassword({ table, passField, password, userEmailField, userEmail, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPass = yield lib_1.default.hashPass(password);
            const updatePass = yield this.db(table)
                .withSchema(this.schema.USER_SCHEMA)
                .update(passField, hashedPass)
                .where(userEmailField, userEmail);
            if (updatePass) {
                return {
                    success: true,
                    message: 'Password changed successfully!',
                };
            }
            else {
                return {
                    success: true,
                    message: 'Cannot change password now!',
                };
            }
        });
    }
    // user password verify
    userPasswordVerify({ table, passField, oldPassword, userIdField, userId, schema, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: 'Password is verified!',
            };
            // const commonModel = this.Model.commonModel();
            // const user = await commonModel.getUserPassword({
            //   table,
            //   schema,
            //   passField,
            //   userIdField,
            //   userId,
            // });
            // if (!user.length) {
            //   return {
            //     success: false,
            //     code: this.StatusCode.HTTP_NOT_FOUND,
            //     message: 'No user found with this id',
            //   };
            // }
            // const checkOldPass = await Lib.compare(oldPassword, user[0][passField]);
            // if (!checkOldPass) {
            //   return {
            //     success: false,
            //     code: this.StatusCode.HTTP_UNAUTHORIZED,
            //     message: 'Old password is not correct!',
            //   };
            // } else {
            //   return {
            //     success: true,
            //     code: this.StatusCode.HTTP_OK,
            //     message: 'Password is verified!',
            //   };
            // }
        });
    }
    // check user
    checkUserByUniqueKey(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield this.db(obj.table)
                .withSchema(this.schema.USER_SCHEMA)
                .select('*')
                .where(obj.field, obj.value);
            if (check.length) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    restaurantLeads(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.propertyModel();
            const { data, total } = yield model.getAllRestaurants(req.query);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data,
                total,
            };
        });
    }
}
exports.default = CommonService;
