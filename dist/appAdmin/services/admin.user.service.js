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
    clearNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                yield this.Model.UserAdminModel().removeNotification(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Notification Cleared',
                };
            }));
        });
    }
    createUserAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const _a = req.body, { email, phone, name, avatar, role, password } = _a, rest = __rest(_a, ["email", "phone", "name", "avatar", "role", "password"]);
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
                const hashedPass = yield lib_1.default.hashPass(password);
                yield model.insertUserAdmin(Object.assign({ password: hashedPass, email,
                    phone,
                    name,
                    avatar,
                    role,
                    organization_id }, rest));
                // send sms
                yield lib_1.default.sendEmail(email, constants_1.OTP_FOR_CREDENTIALS, (0, adminCredentials_1.newAdminAccount)(email, password));
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
                const storeRolePermissionIDs = [];
                // Insert role and permission group using a loop
                // Insert role and permission group using a loop
                for (const permission_group_id of permission_group) {
                    const rolePermissions = yield model.insertRolePermissionGroup(role_id, permission_group_id);
                    // Push the role_permission_group_id to the array
                    storeRolePermissionIDs.push(rolePermissions[0].role_permission_group_id);
                    // Get the permissions for the current permission group
                    const getpermission = yield model.getGroupWisePermissions(permission_group_id);
                    // Check if getpermission has any permissions before proceeding
                    if (getpermission && getpermission.length > 0) {
                        for (const permission of getpermission) {
                            yield model.insertPermissionGroupAndPermission({
                                role_permission_id: rolePermissions[0].role_permission_group_id,
                                permission_id: permission.id,
                                permission_type: ['create', 'read', 'delete', 'update'],
                            });
                        }
                    }
                }
                // for (const permission_group_id of permission_group) {
                //   const first_role_permission_id = [];
                //   const role_permission_group_id =
                //     await this.Model.UserAdminModel().insertRolePermissionGroup(
                //       role_id,
                //       permission_group_id
                //     );
                //   // role_permission_id: number;
                //   // permission_id: number;
                //   // permission_type: [];
                //   first_role_permission_id.push(
                //     role_permission_group_id[0].role_permission_group_id
                //   );
                // }
                const autoPass = lib_1.default.otpGenNumber(8);
                const hashedPass = yield lib_1.default.hashPass(autoPass);
                // send sms
                const user_email = 'superadmin' + '.' + organization[0].name + '@' + 'crm' + '.' + 'com';
                const user = {
                    name: 'Super Admin',
                    phone: organization[0].id,
                    role: role_id,
                    password: hashedPass,
                    email: user_email,
                    organization_id: organization_id,
                };
                yield model.insertUserAdmin(user);
                yield lib_1.default.sendEmail(user_email, constants_1.OTP_FOR_CREDENTIALS, (0, adminCredentials_1.newAdminAccount)(user_email, autoPass));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: storeRolePermissionIDs,
                    message: 'Admin created succefully',
                };
                //check user
                // const { checked } = await model.checkSingleAdmin(email);
                // if (checked.length) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Email already exists',
                //   };
                // }
                // const files = (req.files as Express.Multer.File[]) || [];
                // if (files.length) {
                //   rest['avatar'] = files[0].filename;
                // }
                // const autoPass = Lib.otpGenNumber(8);
                // return {
                //   success: true,
                //   code: this.StatusCode.HTTP_OK,
                //   message: 'Admin created succefully',
                // };
            }));
        });
    }
    // get all employee
    getAllAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const { organization_id } = req.admin;
            const model = this.Model.UserAdminModel();
            const { data, total } = yield model.getAllAdmin(organization_id, {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get single employee
    getSingleAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.UserAdminModel();
            const data = yield model.getSingleAdmin({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const _a = data[0], { password } = _a, rest = __rest(_a, ["password"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: rest,
            };
        });
    }
    // update single employee
    updateSingleAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.UserAdminModel();
            const body = req.body;
            const user_id = req.params.id;
            //check user
            const checkEmp = yield model.getSingleAdmin({
                id: parseInt(req.params.id),
            });
            if (!checkEmp.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            let current_email = checkEmp[0].email;
            let requested_email = req.body['email'];
            const check = yield model.checkRequestEmailExsists(current_email, requested_email);
            if (check.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: 'user has found with this email',
                };
            }
            const files = req.files || [];
            if (files.length) {
                body['avatar'] = files[0].filename;
            }
            yield model.updateSingleAdmin(Number(user_id), req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: 'Admin updated succefully',
            };
        });
    }
    //upsert shift
    upsertShift(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const employee_id = req.params.id;
                //check if shift user exsists
                const model = this.Model.employeeModel();
                yield model.updateUserIdShift(parseInt(employee_id), req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    updateOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                //check if shift user exsists
                const model = this.Model.employeeModel();
                const files = req.files || [];
                if (files.length) {
                    req.body['logo'] = files[0].filename;
                }
                yield model.updateOrganization(organization_id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    //create shift
    createShift(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                //check shift duplicacy
                const { organization_id } = req.admin;
                const shift_name = req.body['shift_name'];
                const shift_start = req.body['shift_start'];
                const shift_end = req.body['shift_end'];
                const { nameDuplicates, timeDuplicates } = yield this.Model.employeeModel().singleShiftCheck(organization_id, shift_name, shift_start, shift_end);
                if (!nameDuplicates.length) {
                    if (!timeDuplicates.length) {
                        req.body['organization_id'] = organization_id;
                        const createShift = yield this.Model.employeeModel().createShift(req.body);
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_OK,
                            message: 'Shift Created Successfully',
                        };
                    }
                    else {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_OK,
                            message: 'You Have Create A Shift At This Time',
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_OK,
                        message: 'Duplicate Shift Name Found',
                    };
                }
            }));
        });
    }
    // get all shifts
    getAllShifts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const { organization_id } = req.admin;
            const model = this.Model.employeeModel();
            const { data, total } = yield model.getAllShifts(organization_id, {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    getOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.employeeModel();
            const data = yield model.getOrganization(organization_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    //update shift
    updateShift(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const id = parseInt(req.params.id);
                const updateShift = yield this.Model.employeeModel().updateShift(id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Shift Updated Successfully',
                };
            }));
        });
    }
    getAllNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.commonModel();
            const { data, seen, unseen } = yield model.getAllAdminNotification(id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data,
                seen,
                unseen,
            };
        });
    }
    viewAllNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.commonModel();
            yield model.allNotificationView(id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
    updateNotificationStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.commonModel();
                const notification_id = Number(req.body.notification_id);
                const user_id = Number(req.body.user_id);
                yield model.adminNotificationSeen(notification_id, user_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
}
exports.default = AdminUserService;
