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
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const config_1 = __importDefault(require("../../config/config"));
class AdminService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create question
    createAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
                const user_level = req.employee.level;
                const memberModel = this.Model.memberModel(trx);
                //check user
                const checkUser = yield memberModel.checkUser({
                    email: rest.email,
                });
                if (checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Email already exists",
                    };
                }
                //check phone
                const checkPhone = yield memberModel.checkPhone({
                    phone: rest.phone,
                });
                if (checkPhone.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Phone Number Already exists",
                    };
                }
                //check phone
                const checkUsername = yield memberModel.checkUsername({
                    username: rest.username,
                });
                if (checkUsername.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Username Already exists",
                    };
                }
                //creating member
                rest["association_id"] = req.employee.association_id;
                rest["level"] = 2;
                const hashedPass = yield lib_1.default.hashPass("12345678");
                const registration = yield memberModel.insertUserMember(Object.assign({ password: hashedPass }, rest));
                const tokenData = {
                    id: registration[0].user_id,
                    name: rest.name,
                    username: rest.username,
                    designation: rest.designation,
                    level: rest.level,
                    association_id: rest.association_id,
                    email: rest.email,
                    phone: rest.phone,
                };
                const token = lib_1.default.createToken(tokenData, config_1.default.JWT_SECRET_EMPLOYEE, "800h");
                if (registration.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: this.ResMsg.HTTP_OK,
                        data: Object.assign({}, tokenData),
                        token,
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.HTTP_BAD_REQUEST,
                    };
                }
            }));
        });
    }
    //create permissions
    createPermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const model = this.Model.userModel();
                const { association_id } = req.employee;
                //
                body["invoice_created_by"] = association_id;
                const _a = req.body, { toevaluateteams } = _a, rest = __rest(_a, ["toevaluateteams"]);
                // const inserted = await model.updateUserLevel(
                //   association_id,
                //   parseInt(req.body.level)
                // );
                const checklength = yield model.getPermission(req.body.user_id);
                if (checklength.length) {
                    const users = checklength.map((item) => item.teamID);
                    const deleteUser = yield model.deletePermission(users);
                    const generateDataToInsert = (user_id) => {
                        return toevaluateteams.map((stallNumber) => ({
                            user_id: user_id,
                            team_id: stallNumber.team_id,
                        }));
                    };
                    const dataToInsert = generateDataToInsert(req.body.user_id);
                    yield model.createPermissions(dataToInsert);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: body,
                    };
                }
                const generateDataToInsert = (user_id) => {
                    return toevaluateteams.map((stallNumber) => ({
                        user_id: user_id,
                        team_id: stallNumber.team_id,
                    }));
                };
                const dataToInsert = generateDataToInsert(req.body.user_id);
                yield model.createPermissions(dataToInsert);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: body,
                };
            }));
        });
    }
    //get permissions
    getPermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const userid = parseInt(req.params.userid);
                const model = this.Model.userModel();
                const permission = yield model.getPermission(userid);
                const getLevel = yield model.getUserInfo(userid);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: permission,
                    level: getLevel[0].level,
                };
            }));
        });
    }
    //get admins
    getAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { association_id } = req.employee;
                const model = this.Model.userModel();
                if (req.employee.level === 1) {
                    const getTeams = yield model.getAllAdmins(association_id);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: getTeams,
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }));
        });
    }
}
exports.default = AdminService;
