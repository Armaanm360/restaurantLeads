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
class RolePermissionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create role permission
    createRoleWithPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { role_name, authority } = req.body;
                const org_id = req.admin.organization_id;
                //check if role_name exsists
                const checkExistence = yield this.Model.RolePermissionModel().checkRole(role_name, org_id);
                if (checkExistence.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "A Role Has Already Been Created With This Name",
                    };
                }
                else {
                    //create a role
                    const role = yield this.Model.RolePermissionModel().createRole({
                        name: role_name,
                        organization_id: org_id,
                    });
                    //store role from here
                    const role_id = role[0].id;
                    // Iterate through authority array and insert each permission group
                    for (const auths of authority) {
                        const role_permission_group_id = yield this.Model.RolePermissionModel().insertPermissionGroup({
                            role_id: role_id,
                            permission_group_id: auths.permission_group_id,
                        });
                        for (const permission of auths.permissions) {
                            yield this.Model.RolePermissionModel().insertPermissionGroupAndPermission({
                                role_permission_id: role_permission_group_id[0].role_permission_group_id,
                                permission_id: permission.permission_id,
                                permission_type: permission.permission_type,
                            });
                        }
                    }
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Role Has Been Created Successfully",
                        data: role,
                    };
                }
            }));
        });
    }
    //update role permission
    updateRolePermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const updated_role_id = Number(req.params.id);
                const getRolePermissionGroupIDS = yield this.Model.RolePermissionModel().getPermissionGroupIdWise(organization_id, updated_role_id);
                const groupIDSarray = getRolePermissionGroupIDS.map((id) => id.role_permission_group_id);
                yield this.Model.RolePermissionModel().deleteRoleWithPermissionGroupId(groupIDSarray);
                const { role_name, authority } = req.body;
                if (role_name) {
                    //check if role_name exsists
                    const checkExistence = yield this.Model.RolePermissionModel().checkRole(role_name, organization_id);
                    if (!checkExistence.length) {
                        yield this.Model.RolePermissionModel().updateRole({ name: role_name }, updated_role_id);
                    }
                }
                //store role from here
                const role_id = updated_role_id;
                // Iterate through authority array and insert each permission group
                for (const auths of authority) {
                    const role_permission_group_id = yield this.Model.RolePermissionModel().insertPermissionGroup({
                        role_id: role_id,
                        permission_group_id: auths.permission_group_id,
                    });
                    for (const permission of auths.permissions) {
                        yield this.Model.RolePermissionModel().insertPermissionGroupAndPermission({
                            role_permission_id: role_permission_group_id[0].role_permission_group_id,
                            permission_id: permission.permission_id,
                            permission_type: permission.permission_type,
                        });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Role Has Been Updated Successfully",
                };
            }));
        });
    }
    //update role permission
    updateRolePermissionEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const employee_id = Number(req.params.id);
                const getRolePermissionGroupIDS = yield this.Model.RolePermissionModel().getPermissionGroupIdWiseEmployee(employee_id);
                const groupIDSarray = getRolePermissionGroupIDS.map((id) => id.role_permission_group_id);
                yield this.Model.RolePermissionModel().deleteRoleWithPermissionGroupIdEmployee(groupIDSarray);
                const { authority } = req.body;
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
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Role Has Been Updated Successfully",
                };
            }));
        });
    }
    getRolesWithPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const org_id = req.admin.organization_id;
            const { roles, total } = yield this.Model.RolePermissionModel().getRoleWithPermission(org_id);
            // Extracting unique role IDs
            const uniqueRoleIds = [...new Set(roles.map((role) => role.id))];
            // Array to store modified response
            const modifiedResponse = [];
            // Loop through unique role IDs
            // Loop through unique role IDs
            for (const roleId of uniqueRoleIds) {
                // Fetch permission for the current role ID
                const group_permission = yield this.Model.RolePermissionModel().getPermissionGroupIdWise(org_id, roleId);
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
                        const subModuleData = yield this.Model.RolePermissionModel().getGroupIdWisePermission(permission); // Implement this method
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
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Roles With Permissions",
                data: modifiedResponse,
                total: total,
            };
        });
    }
    getSingleRoleWithPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const required_role = Number(req.params.id);
            const org_id = req.admin.organization_id;
            const { roles, total } = yield this.Model.RolePermissionModel().getRoleWithPermission(org_id);
            // Extracting unique role IDs
            const uniqueRoleIds = [required_role];
            // Array to store modified response
            const modifiedResponse = [];
            // Loop through unique role IDs
            for (const roleId of uniqueRoleIds) {
                // Fetch permission for the current role ID
                const group_permission = yield this.Model.RolePermissionModel().getPermissionGroupIdWise(org_id, roleId);
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
                        const subModuleData = yield this.Model.RolePermissionModel().getGroupIdWisePermission(permission); // Implement this method
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
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Roles With Permissions",
                data: modifiedResponse[0],
            };
        });
    }
    getSingleRoleWithPermissionEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const required_employee = Number(req.params.id);
            const org_id = req.admin.organization_id;
            const roles = yield this.Model.employeeModel().getOrganizationEmployees(org_id);
            // Extracting unique role IDs
            const employee = [required_employee];
            // Array to store modified response
            const modifiedResponse = [];
            // Loop through unique role IDs
            for (const employeeId of employee) {
                // Fetch permission for the current role ID
                const group_permission = yield this.Model.RolePermissionModel().getPermissionGroupIdWiseEmployee(employeeId);
                // Find the role object with the current role ID
                const role = roles.find((role) => role.id === employeeId);
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
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Roles With Permissions",
                data: modifiedResponse[0],
            };
        });
    }
    //create permission group
    createPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const org_id = req.admin.organization_id;
                const permission_group_name = req.body["name"];
                //check if role_name exsists
                const checkExistence = yield this.Model.RolePermissionModel().checkPermissionGroupExsists(permission_group_name, org_id);
                if (checkExistence.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Permission Group Already Created",
                    };
                }
                yield this.Model.RolePermissionModel().insertPermissionGroups({
                    name: permission_group_name,
                    organization_id: org_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Permission Group Has Been Created Successfully",
                    data: req.body,
                };
            }));
        });
    }
    //get permission group
    getPermissionGroups(req) {
        return __awaiter(this, void 0, void 0, function* () {
            //data
            const org_id = req.admin.organization_id;
            const { data, total } = yield this.Model.RolePermissionModel().getPermissionGroups(org_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Permission Groups",
                data: data,
                total,
            };
        });
    }
    //create permissions
    createPermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const permissions = []; // Array to collect created permissions
                // Iterate through each permission in the request body
                for (const permissionData of req.body) {
                    const permission_group_id = Number(permissionData["permission_group_id"]);
                    const permission_name = permissionData["name"];
                    // Check if permission already exists
                    const checkExistence = yield this.Model.RolePermissionModel().checkPermissionExsists(permission_group_id, permission_name);
                    if (checkExistence.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "Permission Already Created Under The Permission Group",
                        };
                    }
                    // Insert new permission
                    yield this.Model.RolePermissionModel().insertPermissions({
                        permission_group_id: permission_group_id,
                        name: permission_name,
                    });
                    // Add created permission to the permissions array
                    permissions.push({
                        permission_group_id: permission_group_id,
                        name: permission_name,
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Permissions Have Been Created Successfully",
                    data: permissions, // Return array of created permissions
                };
            }));
        });
    }
    //get permission group
    getPermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            //data
            const org_id = req.admin.organization_id;
            const permission_group = yield this.Model.RolePermissionModel().getPermissionsOrganizationWise(org_id);
            const permission_group_array = permission_group.map((item) => item.permission_group_id);
            const { data, total } = yield this.Model.RolePermissionModel().getPermissions(org_id, permission_group_array);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Permissions",
                data: data,
                total,
            };
        });
    }
    //get permissions
    getPermissionsEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            //data
            const { organization_id } = req.admin;
            const permission_group = yield this.Model.RolePermissionModel().getPermissionsOrganizationWiseEmployee(organization_id);
            const permission_group_array = permission_group.map((item) => item.permission_group_id);
            const { data, total } = yield this.Model.RolePermissionModel().getPermissionsEmployee(organization_id, permission_group_array);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Permissions",
                data: data,
                total,
            };
        });
    }
}
exports.default = RolePermissionService;
