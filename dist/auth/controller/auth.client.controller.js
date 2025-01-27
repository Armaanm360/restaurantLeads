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
const common_service_1 = __importDefault(require("../../common/commonService/common.service"));
const auth_client_service_1 = __importDefault(require("../services/auth.client.service"));
const client_users_validator_1 = __importDefault(require("../utils/validator/client.users.validator"));
class ClientAuthController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new auth_client_service_1.default();
        this.commonService = new common_service_1.default();
        this.clientValidator = new client_users_validator_1.default();
        // login
        this.login = this.asyncWrapper.wrap({ bodySchema: this.clientValidator.clientLoginValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const _a = yield this.service.loginService({
                email,
                password,
                device_token: req.headers.devicetoken,
            }), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // register
        this.register = this.asyncWrapper.wrap({ bodySchema: this.clientValidator.clientLoginValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const _b = yield this.service.loginService({
                email,
                password,
                device_token: req.headers.devicetoken,
            }), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get profile
        this.getProfile = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getProfile(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // update profile
        this.updateProfile = this.asyncWrapper.wrap({ bodySchema: this.clientValidator.clientProfileUpdateValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.newupdateProfile(req), { code } = _d, data = __rest(_d, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        // forget password
        this.forgetPassword = this.asyncWrapper.wrap({ bodySchema: this.clientValidator.clientForgetPasswordValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, email, password } = req.body;
            const _e = yield this.service.forgetService({
                token,
                email,
                password,
            }), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // change password
        this.changeClientPassword = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.changePasswordValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password } = req.body;
            const { id } = req.employee;
            const table = "users";
            const passField = "password";
            const userIdField = "id";
            const schema = "crm";
            const _f = yield this.commonService.userPasswordVerify({
                table,
                oldPassword: old_password,
                passField,
                userId: id,
                userIdField,
                schema,
            }), { code } = _f, data = __rest(_f, ["code"]);
            if (data.success) {
                const _g = yield this.commonService.changePassword(req), { code } = _g, data = __rest(_g, ["code"]);
                res.status(code).json(data);
            }
            else {
                res.status(code).json(data);
            }
        }));
    }
}
exports.default = ClientAuthController;
