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
class MemberprofileService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // change password
    // change password
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password } = req.body;
            const { email, id } = req.employee;
            const model = this.Model.memberModel();
            const checkUser = yield model.checkUser({ email });
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const password = checkUser[0].password;
            const verify = yield lib_1.default.compare(old_password, password);
            if (!verify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: 'Previous password does not match!',
                };
            }
            const hashedPass = yield lib_1.default.hashPass(new_password);
            yield model.updateUserMember({ password: hashedPass }, { user_id: id });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const user_id = req.employee.id;
                const level = req.employee.level;
                const model = this.Model.memberModel();
                if (level <= 2) {
                    const checkUser = yield model.getProfile(user_id);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: checkUser[0],
                    };
                }
                if (level >= 3) {
                    const checkUser = yield model.getProfileTeamWise(user_id);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: checkUser[0],
                    };
                }
                const checkUser = yield model.getProfileTeamWise(user_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: checkUser[0],
                };
            }));
        });
    }
    updateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const user_id = req.employee.id;
                const files = req.files || [];
                if (files === null || files === void 0 ? void 0 : files.length) {
                    req.body[files[0].fieldname] = files[0].filename;
                }
                const model = this.Model.memberModel();
                const updateProfile = yield model.updateProfile(user_id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
}
exports.default = MemberprofileService;
