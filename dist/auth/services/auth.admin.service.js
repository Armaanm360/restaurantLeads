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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const config_1 = __importDefault(require("../../config/config"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
class AdminAuthService extends abstract_service_1.default {
    //new agent registration validator
    //login service
    loginService({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.adminModel();
            // Fetch the user by email
            const checkUser = yield model.getSingleAdmin({ email });
            // If no user is found
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            // Destructure password and the rest of the user details
            const _a = checkUser[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            // Compare the provided password with the hashed password
            const checkPass = yield lib_1.default.compare(password, hashPass);
            console.log('hello checkpass', checkPass, password, hashPass);
            // If the password matches, generate a token and return a success response
            if (checkPass) {
                const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { type: 'admin' }), // Include user details and user type
                config_1.default.JWT_SECRET_ADMIN, // Use the agent-specific secret
                '240h' // Token valid for 240 hours
                );
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.LOGIN_SUCCESSFUL,
                    data: Object.assign({ token }, rest),
                };
            }
            // If the password doesn't match
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.WRONG_CREDENTIALS,
            };
        });
    }
    // get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.adminModel();
            // Fetch the user by email
            const data = yield model.getSingleAdmin({ id });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: data[0],
            };
        });
    }
    updateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.adminModel();
            const body = req.body;
            // Fetch the user by email
            const data = yield model.getSingleAdmin({ id });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const files = req.files || [];
            if (files.length) {
                body['avatar'] = files[0].filename;
            }
            console.log('the body portion', body);
            const res = yield model.updateAdminProfile({ id }, body);
            if (files.length && data[0].avatar) {
                yield this.manageFile.deleteFromCloud([data[0].avatar]);
            }
            if (res.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'profile updated successfully',
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: 'profile does not updated',
                };
            }
        });
    }
    // forget
    forgetService({ token, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_EMPLOYEE);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_EMPLOYEE) {
                // const hashPass = await Lib.hashPass(password);
                // const model = this.Model.employeeModel();
                // await model.updateSingleEmployee({ password: hashPass }, { email });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_FULFILLED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }
        });
    }
}
exports.default = AdminAuthService;
