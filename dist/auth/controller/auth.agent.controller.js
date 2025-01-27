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
const agent_users_validator_1 = __importDefault(require("../utils/validator/agent.users.validator"));
const config_1 = __importDefault(require("../../config/config"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const auth_agent_service_1 = __importDefault(require("./../services/auth.agent.service"));
class AgentAuthController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new auth_agent_service_1.default();
        this.commonService = new common_service_1.default();
        this.validator = new agent_users_validator_1.default();
        // new agent registration
        this.register = this.asyncWrapper.wrap({ bodySchema: this.validator.agentRegistrationValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.registrationService(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        // login
        this.login = this.asyncWrapper.wrap({ bodySchema: this.validator.agentLoginValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const _b = yield this.service.loginService({
                email,
                password,
            }), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get profile
        this.getProfile = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getProfile(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // update profile
        this.updateProfile = this.asyncWrapper.wrap({ bodySchema: this.validator.agentProfileUpdateValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.updateAgentProfile(req), { code } = _d, data = __rest(_d, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        // forget password
        this.forgetPassword = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, email, password } = req.body;
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_AGENT);
            console.log({ tokenVerify });
            if (tokenVerify) {
                const { email: verifyEmail, type } = tokenVerify;
                if (email === verifyEmail && type === "forget_agent") {
                    const data = yield this.service.forgetPassword({
                        password,
                        passField: "password",
                        table: "users",
                        userEmailField: "email",
                        userEmail: email,
                    });
                    if (data.success) {
                        res.status(200).json(data);
                    }
                    else {
                        res.status(400).json(data);
                    }
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: "Unauthorized token, It doesn't match with your email or type",
                    });
                }
            }
            else {
                res
                    .status(400)
                    .json({ success: false, message: "Invalid token or token expired" });
            }
        }));
        // change password
        this.changePassword = this.asyncWrapper.wrap({ bodySchema: this.validator.changePassword }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.commonService.changePassword(req), { code } = _e, data = __rest(_e, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
    }
}
exports.default = AgentAuthController;
