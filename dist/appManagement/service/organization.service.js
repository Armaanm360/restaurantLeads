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
const adminCredentials_1 = require("../../utils/templates/adminCredentials");
const constants_1 = require("../../utils/miscellaneous/constants");
class OrganizationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create employee
    createOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                //first create organization
                const model = this.Model.managementModel(trx);
                const _a = req.body, { email, phone, name, address, postal_code, leave_allowance, sale_date, expiry_date, sale_by, sale_amount, sale_type } = _a, rest = __rest(_a, ["email", "phone", "name", "address", "postal_code", "leave_allowance", "sale_date", "expiry_date", "sale_by", "sale_amount", "sale_type"]);
                //checkEmail
                const checkEmail = yield model.checkOrganizationEmail(req.body["email"]);
                if (checkEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Organization Already Exists",
                    };
                }
                const checkSingleEmail = yield model.checkSingleMainAdmin(rest["user_email"]);
                if (checkSingleEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "User Already Exists",
                    };
                }
                // req.body['country_id'] = Number(req.body['country_id']);
                // req.body['city_id'] = Number(req.body['city_id']);
                const files = req.files || [];
                console.log({ files });
                if (files.length) {
                    req.body["logo"] = files[0].filename;
                }
                const organization = yield model.createOrganization({
                    email,
                    phone,
                    name,
                    address,
                    leave_allowance,
                    logo: req.body.logo,
                    postal_code,
                    sale_date,
                    expiry_date,
                    sale_by,
                    sale_amount,
                    sale_type,
                });
                const organization_id = organization[0].id;
                const role_name = "super-admin";
                const role = yield model.createRole(organization_id, role_name);
                const role_id = role[0].id;
                //static permission group
                const permission_group = JSON.parse(rest["permission_group"]);
                // const permission_group_employee = JSON.parse(
                //   rest['permission_group_employee']
                // );
                //permission group admin
                for (const pg of permission_group) {
                    yield model.createPermissionOrganization(organization_id, pg);
                }
                const storeRolePermissionIDs = [];
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
                                permission_type: ["create", "read", "delete", "update"],
                            });
                        }
                    }
                }
                //permission group employee
                // for (const pgof of permission_group_employee) {
                //   await model.createPermissionOrganizationEmployee(organization_id, pgof);
                // }
                const autoPass = lib_1.default.otpGenNumber(8);
                const myPass = rest["password"];
                const hashedPass = yield lib_1.default.hashPass(myPass);
                // send sms
                const user = {
                    name: rest["user_name"],
                    phone: req.body["phone"],
                    role: role_id,
                    password: hashedPass,
                    email: rest["user_email"],
                    organization_id: organization_id,
                };
                yield model.insertMainUserAdmin(user);
                yield lib_1.default.sendEmail(rest["user_email"], constants_1.OTP_FOR_CREDENTIALS, (0, adminCredentials_1.newAdminAccount)(rest["user_email"], rest["password"]));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: storeRolePermissionIDs,
                    message: "Admin created successfully",
                };
            }));
        });
    }
    // get all employee
    getAllOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const model = this.Model.organizationModel();
            const { data, total } = yield model.getAllOrganization({
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
    /* update organization status */
    updateOrganizationStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let changed_status = "";
            const status = req.body.is_activate;
            const organization_id = Number(req.body.organization_id);
            yield this.Model.managementModel().updateOrganization(organization_id, status);
            if (status == true) {
                changed_status = "Activated";
            }
            else {
                changed_status = "InActivated";
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: `The Organization Has Been ${changed_status}`,
            };
        });
    }
    /**
     * Retrieves dashboard data and returns a structured response.
     *
     * @param req - The request object from the client.
     * @returns An object containing the dashboard data and response status.
     */
    getDashboardData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const orgModel = this.Model.managementUserModel();
            // Destructure dashboard data from the model
            const { totalOrganizations, totalLeadsCreated, totalAdminUsers, totalEmployeeUsers, totalProductsCreated, totalSales, totalInactiveOrganizations, totalActiveOrganizations, totalLeaveApplications, totalMeetingsCreated, totalProjectsCreated, } = yield orgModel.getDashboardData();
            // Return a structured response with the data
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: {
                    totalOrganizations: Number(totalOrganizations[0].totalOrganizations),
                    totalLeadsCreated: Number(totalLeadsCreated[0].totalLeadsCreated),
                    totalAdminUsers: Number(totalAdminUsers[0].totalAdminUsers),
                    totalEmployeeUsers: Number(totalEmployeeUsers[0].totalEmployeeUsers),
                    totalProductsCreated: Number(totalProductsCreated[0].totalProductsCreated),
                    totalSales: totalSales[0].totalSales,
                    totalInactiveOrganizations: Number(totalInactiveOrganizations[0].totalInactiveOrganizations),
                    totalActiveOrganizations: Number(totalActiveOrganizations[0].totalActiveOrganizations),
                    totalLeaveApplications: Number(totalLeaveApplications[0].totalLeaveApplications),
                    totalMeetingsCreated: Number(totalMeetingsCreated[0].totalMeetingsCreated),
                    totalProjectsCreated: Number(totalProjectsCreated[0].totalProjectsCreated),
                },
            };
        });
    }
    //create management employee
    createManagementEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Model.managementModel().createManagementEmployee(req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Management Employee Created Successfully",
            };
        });
    }
    //get all management employee
    getAllManagementEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { key, limit, skip } = req.query;
                const model = this.Model.managementModel();
                const { data, total } = yield model.getAllManagementEmployee({
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
            }));
        });
    }
    //create management admin
    createManagementAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, name, password } = req.body;
                const model = this.Model.managementModel(trx);
                //check user
                const checked = yield model.checkSingleAdmin(email);
                if (checked.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Email already exists",
                    };
                }
                //password hashing
                const hashedPass = yield lib_1.default.hashPass(password);
                const datBody = {
                    name: name,
                    email: email,
                    password: hashedPass,
                };
                yield model.insertUserAdmin(datBody);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Management User Created Successfully",
                };
            }));
        });
    }
    //get all management admin
    getManagementAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const model = this.Model.managementModel();
            const { data, total } = yield model.getAllManagementAdmin({
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
    //added something
    getAllOrganizationUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const org_id = Number(req.params.id);
            const model = this.Model.organizationModel();
            const { data, total } = yield model.getAllUserOrgWise(org_id, {
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
    getAllPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.organizationModel();
            const { data, total } = yield model.getPermissionsGroup();
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
}
exports.default = OrganizationService;
