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
class ServiceCenterAuthService extends abstract_service_1.default {
    //login service
    loginService({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.upcServiceCenterModel();
            const checkUser = yield model.getSingleAdmin({ email });
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const _a = checkUser[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { type: 'upc_service_center' }), config_1.default.JWT_SECRET_SERVICE_CENTER, '24h');
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: rest,
                token,
            };
        });
    }
    // get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin_id } = req.service_center;
            const checkAdmin = yield this.Model.upcServiceCenterModel().getSingleAdmin({
                id: admin_id,
            });
            const _a = checkAdmin[0], { password } = _a, rest = __rest(_a, ["password"]);
            if (checkAdmin.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: Object.assign({}, rest),
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
        });
    }
    // update profile
    updateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { service_center_id, admin_id } = req.service_center;
            const { name, phone, service_center_name, location, type } = req.body;
            const model = this.Model.upcServiceCenterModel();
            const checkUser = yield model.getSingleServiceCenter({
                id: service_center_id,
            });
            if (!checkUser.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const files = req.files || [];
            if (files.length) {
                files.forEach((item) => {
                    req.body[item.fieldname] = item.filename;
                });
            }
            if (service_center_name || location || type || req.body.logo) {
                yield model.updateServiceCenter({ name: service_center_name, location, type, logo: req.body.logo }, {
                    id: service_center_id,
                });
            }
            // admin
            const admin_pld = {
                name,
                phone,
            };
            if (req.body.avatar) {
                admin_pld.avatar = req.body.avatar;
            }
            if (name || phone || req.body.avatar) {
                yield model.updateSingleAdmin({ name, phone, avatar: req.body.avatar }, {
                    id: admin_id,
                });
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: 'Profile updated successfully',
            };
        });
    }
    // forget
    forgetService({ token, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_SERVICE_CENTER);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_SERVICE_CENTER) {
                const hashPass = yield lib_1.default.hashPass(password);
                const model = this.Model.upcServiceCenterModel();
                yield model.updateSingleAdmin({ password: hashPass }, { email: verifyEmail });
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
exports.default = ServiceCenterAuthService;
