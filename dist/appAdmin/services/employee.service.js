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
const employeeCredentials_template_1 = require("../../utils/templates/employeeCredentials.template");
class AdminEmployeeService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create employee
    createEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const _a = req.body, { email, phone, name, shift_id, product_lead_permission, permission_auth, password } = _a, rest = __rest(_a, ["email", "phone", "name", "shift_id", "product_lead_permission", "permission_auth", "password"]);
                req.body['organization_id'] = organization_id;
                const model = this.Model.employeeModel(trx);
                //check user
                const { data: checkEmail } = yield model.getAllEmploye({
                    email,
                });
                if (checkEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Email already exists',
                    };
                }
                const files = req.files || [];
                if (files.length) {
                    rest['photo'] = files[0].filename;
                }
                const data = yield model.getAllEmpLasId(organization_id);
                const lastNumber = data.length ? data[0].id : 1;
                const autoPass = lib_1.default.otpGenNumber(8);
                const split_name = name.split(' ').join('');
                const uniqueName = `@${split_name.toLowerCase()}${lastNumber}`;
                const hashedPass = yield lib_1.default.hashPass(password);
                const empRes = yield model.createEmployee(Object.assign({ password: hashedPass, username: uniqueName, email,
                    organization_id,
                    phone,
                    name,
                    shift_id }, rest));
                // permission
                if (product_lead_permission === null || product_lead_permission === void 0 ? void 0 : product_lead_permission.length) {
                    const parsedPermission = JSON.parse(product_lead_permission);
                    const permissionPayload = parsedPermission.map((item) => {
                        return {
                            org_id: organization_id,
                            emp_id: empRes[0].id,
                            product_id: item,
                        };
                    });
                    yield model.insertEmployeeProductPermission(permissionPayload);
                }
                if (permission_auth) {
                    //group permission
                    const jsonParse = JSON.parse(permission_auth);
                    // Iterate through authority array and insert each permission group
                    for (const auths of jsonParse.authority) {
                        const role_permission_group_id = yield this.Model.RolePermissionModel().insertPermissionGroupEmployee({
                            employee: empRes[0].id,
                            permission_group_id: auths.permission_group_id,
                        });
                        for (const permission of auths.permissions) {
                            yield this.Model.RolePermissionModel().insertPermissionGroupAndPermissionEmployee({
                                employee_permission_id: role_permission_group_id[0].role_permission_group_id,
                                permission_id: permission.permission_id,
                                permission_type: permission.permission_type,
                            });
                        }
                    }
                }
                // send sms
                yield lib_1.default.sendEmail(email, constants_1.OTP_FOR_CREDENTIALS, (0, employeeCredentials_template_1.newEmployeeAccount)(email, password));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Employee inserted successfully',
                };
            }));
        });
    }
    // get all employee
    getAllEployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip, type, status } = req.query;
            const { organization_id } = req.admin;
            const model = this.Model.employeeModel();
            const { data, total } = yield model.getAllEmploye({
                organization_id,
                key: key,
                limit: limit,
                skip: skip,
                type: type,
                status: status,
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
    getSingleEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.employeeModel();
            const { organization_id } = req.admin;
            const data = yield model.getSingleEmployee({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const roles = yield this.Model.employeeModel().getOrganizationEmployees(organization_id);
            const _a = data[0], { password } = _a, rest = __rest(_a, ["password"]);
            // Extracting unique role IDs
            const uniqueRoleIds = [parseInt(req.params.id)];
            // Array to store modified response
            const modifiedResponse = [];
            // Loop through unique role IDs
            for (const roleId of uniqueRoleIds) {
                // Fetch permission for the current role ID
                const group_permission = yield this.Model.RolePermissionModel().getPermissionGroupIdWiseEmployee(roleId);
                // Find the role object with the current role ID
                const role = roles.find((role) => role.id === roleId);
                const uniquePermission = [
                    //role_permission_group_id
                    ...new Set(group_permission.map((up) => up.role_permission_group_id)),
                ];
                // Array to store subModule objects for this role
                const subModules = [];
                if (role && group_permission) {
                    // Fetch subModules for each permission group
                    for (const permission of uniquePermission) {
                        // Use your method to fetch subModules based on permission
                        const subModuleData = yield this.Model.RolePermissionModel().getGroupIdWisePermissionEmployee(permission); // Implement this method
                        subModules.push(subModuleData); // Push fetched subModuleData into subModules array
                    }
                    const authorization = group_permission.map((permission, index) => {
                        return {
                            permission_group_id: permission.id,
                            permission_group_name: permission.name,
                            subModule: subModules[index], // Use the fetched subModules data
                        };
                    });
                    modifiedResponse.push({
                        id: role.id,
                        name: role.name,
                        authorization: authorization,
                    });
                }
            }
            const responseData = Object.assign(Object.assign({}, rest), { authorization: modifiedResponse[0].authorization });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: responseData,
                // Remove roles from here since authorization is now part of data
            };
        });
    }
    // update single employee
    updateSingleEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.employeeModel();
            const _a = req.body, { product_lead_permission, permission_auth } = _a, rest = __rest(_a, ["product_lead_permission", "permission_auth"]);
            //check user
            const checkEmp = yield model.getSingleEmployee({
                id: parseInt(req.params.id),
            });
            if (!checkEmp.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const files = req.files || [];
            if (files.length) {
                rest['photo'] = files[0].filename;
            }
            if (Object.keys(rest).length) {
                yield model.updateSingleEmployee(rest, { id: parseInt(req.params.id) });
            }
            if (product_lead_permission === null || product_lead_permission === void 0 ? void 0 : product_lead_permission.length) {
                // delete all product permission
                yield model.deleteEmployeeProductPermission(organization_id, parseInt(req.params.id));
                // insert permission
                const parsedPermission = JSON.parse(product_lead_permission);
                const permissionPayload = parsedPermission.map((item) => {
                    return {
                        org_id: organization_id,
                        emp_id: parseInt(req.params.id),
                        product_id: item,
                    };
                });
                yield model.insertEmployeeProductPermission(permissionPayload);
            }
            if (permission_auth === null || permission_auth === void 0 ? void 0 : permission_auth.length) {
                const jsonParse = JSON.parse(req.body['permission_auth']);
                const employee_id = Number(req.params.id);
                const getRolePermissionGroupIDS = yield this.Model.RolePermissionModel().getPermissionGroupIdWiseEmployee(employee_id);
                const groupIDSarray = getRolePermissionGroupIDS.map((id) => id.role_permission_group_id);
                yield this.Model.RolePermissionModel().deleteRoleWithPermissionGroupIdEmployee(groupIDSarray);
                const { authority } = jsonParse;
                //create a role
                // const role = await this.Model.RolePermissionModel().createRole({
                //   name: role_name,
                // });
                //store role from here
                const employee = employee_id;
                // Iterate through authority array and insert each permission group
                for (const auths of authority) {
                    const role_permission_group_id = yield this.Model.RolePermissionModel().insertPermissionGroupEmployee({
                        employee: employee,
                        permission_group_id: auths.permission_group_id,
                    });
                    for (const permission of auths.permissions) {
                        yield this.Model.RolePermissionModel().insertPermissionGroupAndPermissionEmployee({
                            employee_permission_id: role_permission_group_id[0].role_permission_group_id,
                            permission_id: permission.permission_id,
                            permission_type: permission.permission_type,
                        });
                    }
                }
            }
            /* update employee */
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: 'Employee updated succefully',
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
    //create shift
    createShift(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                req.body['organization_id'] = organization_id;
                //check shift duplicacy
                const shift_name = req.body['shift_name'];
                const shift_start = req.body['shift_start'];
                const shift_end = req.body['shift_end'];
                const { nameDuplicates, timeDuplicates } = yield this.Model.employeeModel().singleShiftCheck(organization_id, shift_name, shift_start, shift_end);
                if (!nameDuplicates.length) {
                    if (!timeDuplicates.length) {
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
}
exports.default = AdminEmployeeService;
