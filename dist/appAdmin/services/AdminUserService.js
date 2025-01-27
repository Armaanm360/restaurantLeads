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
exports.AdminUserService = void 0;
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
const adminCredentials_1 = require("../../utils/templates/adminCredentials");
class AdminUserService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create employee
    // public async createUserAdmin(req: Request) {
    //   return this.db.transaction(async (trx) => {
    //     const { association_id } = req.a_admin;
    //     const { email, phone, name, avatar, role, ...rest } = req.body;
    //     const model = this.Model.UserAdminModel(trx);
    //     //check user
    //     const { email: checkEmail } = await model.getSingleAdmin({
    //       email,
    //     });
    //     if (checkEmail.length) {
    //       return {
    //         success: false,
    //         code: this.StatusCode.HTTP_BAD_REQUEST,
    //         message: 'Email already exists',
    //       };
    //     }
    //     const files = (req.files as Express.Multer.File[]) || [];
    //     if (files.length) {
    //       rest['photo'] = files[0].filename;
    //     }
    //     const { data } = await model.getAllAdmin({});
    //     const lastNumber = data.length ? data[0].id : 1;
    //     const autoPass = Lib.otpGenNumber(8);
    //     const firstName = name.split(' ');
    //     const uniqueName = `@${firstName}${lastNumber}`;
    //     const hashedPass = await Lib.hashPass(autoPass);
    //     await model.createEmployee({
    //       password: hashedPass,
    //       username: uniqueName,
    //       email,
    //       phone,
    //       name,
    //       association_id,
    //       ...rest,
    //     });
    //     // send sms
    //     await Lib.sendEmail(
    //       email,
    //       OTP_FOR_CREDENTIALS,
    //       newEmployeeAccount(email, autoPass)
    //     );
    //     return {
    //       success: true,
    //       code: this.StatusCode.HTTP_OK,
    //       message: 'Employee inserted succefully',
    //     };
    //   });
    // }
    createUserAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const _a = req.body, { email, phone, name, avatar, role } = _a, rest = __rest(_a, ["email", "phone", "name", "avatar", "role"]);
                req.body['organization_id'] = organization_id;
                const model = this.Model.UserAdminModel(trx);
                //check user
                const { checked } = yield model.checkSingleAdmin(email);
                if (checked.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Email already exists',
                    };
                }
                const files = req.files || [];
                if (files.length) {
                    rest['avatar'] = files[0].filename;
                }
                const autoPass = lib_1.default.otpGenNumber(8);
                const hashedPass = yield lib_1.default.hashPass(autoPass);
                yield model.insertUserAdmin(Object.assign({ password: hashedPass, email,
                    phone,
                    name,
                    avatar,
                    role,
                    organization_id }, rest));
                // send sms
                yield lib_1.default.sendEmail(email, constants_1.OTP_FOR_CREDENTIALS, (0, adminCredentials_1.newAdminAccount)(email, autoPass));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Admin created succefully',
                };
            }));
        });
    }
    //dummyOrganizationCreate
    dummyOrganizationCreate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                //first create organization
                const model = this.Model.UserAdminModel(trx);
                const organization = yield model.createOrganization(req.body);
                const organization_id = organization[0].id;
                const role_name = 'super-admin';
                const role = yield model.createRole(organization_id, role_name);
                const role_id = role[0].id;
                //static permission group
                const permission_group = [17, 18, 19, 20, 21, 22, 23, 24, 25];
                // Insert role and permission group using a loop
                const storeRolePermissionIDs = [
                    398, 399, 400, 401, 402, 403, 404, 405, 406,
                ];
                // Insert role and permission group using a loop
                // Insert role and permission group using a loop
                for (const permission_group_id of permission_group) {
                    const rolePermissions = yield model.insertRolePermissionGroup(role_id, permission_group_id);
                    storeRolePermissionIDs.push(rolePermissions[0].role_permission_group_id);
                }
                for (const permission_group_id of permission_group) {
                    const first_role_permission_id = [];
                    const role_permission_group_id = yield this.Model.UserAdminModel().insertRolePermissionGroup(role_id, permission_group_id);
                    // role_permission_id: number;
                    // permission_id: number;
                    // permission_type: [];
                    first_role_permission_id.push(role_permission_group_id[0].role_permission_group_id);
                    for (const permission of first_role_permission_id) {
                        const justPermits = yield this.Model.UserAdminModel().getGroupWisePermissions(role_permission_group_id[0].role_permission_group_id);
                        const arrs = justPermits.map((item) => item.id);
                        for (const lasting of arrs) {
                            yield this.Model.UserAdminModel().insertPermissionGroupAndPermission({
                                role_permission_id: role_permission_group_id[0].role_permission_group_id,
                                permission_id: lasting.permission_id,
                                permission_type: permission.permission_type,
                            });
                        }
                    }
                }
            }));
        });
    }
}
exports.AdminUserService = AdminUserService;
