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
exports.ManagementModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class ManagementModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //checkSingleAdmin
    checkSingleAdmin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db("management_users")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .where("email", email)
                .select("*");
            return checked;
        });
    }
    //checkSingleAdmin main
    checkSingleMainAdmin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db("user_admin")
                .withSchema(this.CRM_SCHEMA)
                .where("email", email)
                .select("*");
            return checked;
        });
    }
    // get admin
    getSingleAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = payload;
            return yield this.db("management_users AS mu")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .select("*")
                .where(function () {
                if (email) {
                    this.andWhere("mu.email", email);
                }
                if (id) {
                    this.andWhere("mu.id", id);
                }
            });
        });
    }
    createOrganization(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield this.db("organization")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload)
                .returning("*");
            return organization;
        });
    }
    createManagementEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield this.db("employee")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .insert(payload)
                .returning("*");
            return organization;
        });
    }
    getAllManagementEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, key, limit, skip } = payload;
            const baseQuery = this.db("employee as ua").withSchema(this.MANAGEMENT_SCHEMA);
            if (key) {
                baseQuery.where("ua.name", "ILIKE", `%${key}%`);
            }
            if (email) {
                baseQuery.where("ua.email", "ILIKE", `%${email}%`);
            }
            // Query for data
            const dataQuery = baseQuery
                .clone()
                .select("ua.id", "ua.name", "ua.phone", "ua.designation", "ua.email")
                .orderBy("ua.id", "desc");
            if (limit && skip) {
                dataQuery.limit(parseInt(limit)).offset(parseInt(skip));
            }
            // Query for total count
            const totalQuery = baseQuery.clone().count("ua.id as total").first();
            const [data, totalResult] = yield Promise.all([dataQuery, totalQuery]);
            return {
                data,
                total: parseInt((totalResult === null || totalResult === void 0 ? void 0 : totalResult.total) || "0"),
            };
        });
    }
    getAllManagementAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, key, limit, skip } = payload;
            const baseQuery = this.db("management_users as ua").withSchema(this.MANAGEMENT_SCHEMA);
            if (key) {
                baseQuery.where("ua.name", "ILIKE", `%${key}%`);
            }
            if (email) {
                baseQuery.where("ua.email", "ILIKE", `%${email}%`);
            }
            // Query for data
            const dataQuery = baseQuery
                .clone()
                .select("ua.id", "ua.name", "ua.email")
                .orderBy("ua.id", "desc");
            if (limit && skip) {
                dataQuery.limit(parseInt(limit)).offset(parseInt(skip));
            }
            // Query for total count
            const totalQuery = baseQuery.clone().count("ua.id as total").first();
            const [data, totalResult] = yield Promise.all([dataQuery, totalQuery]);
            return {
                data,
                total: parseInt((totalResult === null || totalResult === void 0 ? void 0 : totalResult.total) || "0"),
            };
        });
    }
    checkOrganizationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield this.db("organization")
                .withSchema(this.CRM_SCHEMA)
                .where({ email: email })
                .select("id");
            return organization;
        });
    }
    createRole(organization_id, role_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.db("role")
                .withSchema(this.DBO_SCHEMA)
                .insert({ organization_id: organization_id, name: role_name })
                .returning("*");
            return role;
        });
    }
    createPermissionOrganization(organization_id, permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.db("organization_permission_groups")
                .withSchema(this.DBO_SCHEMA)
                .insert({
                organization_id: organization_id,
                permission_group_id: permission_group_id,
            });
            return role;
        });
    }
    createPermissionOrganizationEmployee(organization_id, permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.db("organization_employee_permission_groups")
                .withSchema(this.DBO_SCHEMA)
                .insert({
                organization_id: organization_id,
                permission_group_id: permission_group_id,
            });
            return role;
        });
    }
    insertRolePermissionGroup(role_id, permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles_permissions = yield this.db("roles_permissions")
                .withSchema(this.DBO_SCHEMA)
                .insert({ role_id, permission_group_id })
                .returning("*");
            return roles_permissions;
        });
    }
    getGroupWisePermissions(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissions = yield this.db("permissions")
                .withSchema(this.DBO_SCHEMA)
                .where("permission_group_id", group_id)
                .select("id");
            return permissions;
        });
    }
    insertPermissionGroupAndPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permission_group")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    insertUserAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db("management_users")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .insert(payload);
            return { checked };
        });
    }
    insertMainUserAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db("user_admin")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
            return { checked };
        });
    }
    //update organization info
    updateOrganization(organization_id, is_activate) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db("organization")
                .withSchema(this.CRM_SCHEMA)
                .where({ id: organization_id })
                .update({ is_activate: is_activate });
            return { checked };
        });
    }
}
exports.ManagementModel = ManagementModel;
