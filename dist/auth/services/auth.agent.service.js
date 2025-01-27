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
class AgentAuthService extends abstract_service_1.default {
    //new agent registration validator
    registrationService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { email, phone, name, password, commission_rate } = _a, rest = __rest(_a, ["email", "phone", "name", "password", "commission_rate"]);
                const model = this.Model.agentModel(trx);
                // //check user
                // Check if the email already exists
                const { data } = yield model.getSingleAgent({ email });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Email already exists',
                    };
                }
                // Handle file upload (avatar)
                const files = req.files || [];
                if (files.length) {
                    rest['avatar'] = files[0].filename;
                }
                rest['user_type'] = 'agent';
                // Hash the password
                const hashedPass = yield lib_1.default.hashPass(password);
                // Create the agent record
                const agentRes = yield model.createAgent(Object.assign({ password: hashedPass, email,
                    phone,
                    name,
                    commission_rate }, rest));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Agent registered successfully', // Adjusted message
                };
            }));
        });
    }
    //login service
    loginService({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentModel();
            // Fetch the user by email
            const { data } = yield model.getSingleAgent({ email });
            // If no user is found
            if (!data.length) {
                console.log('No User Found');
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            // Destructure password and the rest of the user details
            const _a = data[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            // Compare the provided password with the hashed password
            const checkPass = yield lib_1.default.compare(password, hashPass);
            console.log('hello checkpass', checkPass, password, hashPass);
            // If the password matches, generate a token and return a success response
            if (checkPass) {
                const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { type: 'agent' }), // Include user details and user type
                config_1.default.JWT_SECRET_AGENT, // Use the agent-specific secret
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
            const { id } = req.agent;
            const model = this.Model.agentModel();
            // Fetch the user by email
            const { data } = yield model.getSingleAgent({ id });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: data[0],
            };
        });
    }
    // update agent profile
    updateAgentProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.agent;
            const model = this.Model.agentModel();
            const body = req.body;
            // Fetch the user by email
            const { data } = yield model.getSingleAgent({ id });
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
            const res = yield model.updateAgentProfile({ id }, body);
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
    newupdateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { id } = req.employee;
            // const model = this.Model.employeeModel();
            // const checkEmployee = await model.getSingleEmployee({
            //   id,
            // });
            // if (!checkEmployee.length) {
            //   return {
            //     success: true,
            //     code: this.StatusCode.HTTP_NOT_FOUND,
            //     message: this.ResMsg.HTTP_NOT_FOUND,
            //   };
            // }
            // const files = (req.files as Express.Multer.File[]) || [];
            // if (files.length) {
            //   req.body[files[0].fieldname] = files[0].filename;
            // }
            // await model.updateNewSingleEmployee(id, req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: 'Profile updated successfully',
            };
        });
    }
    // forget password
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
}
exports.default = AgentAuthService;
