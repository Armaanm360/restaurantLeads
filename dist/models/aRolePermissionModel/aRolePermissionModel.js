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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class ARolePermissionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create role
    createRole(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload, "id");
        });
    }
    // update role
    updateRole(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role")
                .withSchema(this.DBO_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    //insert Permission Group
    insertPermissionGroup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("roles_permissions")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload, "role_permission_group_id");
        });
    }
    //insert Permission Group Employee
    insertPermissionGroupEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("roles_permissions_employee")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload, "role_permission_group_id");
        });
    }
    //insert Permission Group
    insertPermissionGroupAndPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permission_group")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    //insert Permission Group employee
    insertPermissionGroupAndPermissionEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permission_group_employee")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    // check role exsists
    checkRole(role_name, org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role")
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id: org_id })
                .andWhere("name", role_name)
                .select("*");
        });
    }
    getRoleWithPermission(org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield this.db("role as r")
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id: org_id })
                .select("*");
            const total = yield this.db("role as r")
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id: org_id })
                .count("id as total");
            return { roles, total: parseInt(total[0].total) };
        });
    }
    getPermissionGroupIdWise(organization_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await this.db('roles_permissions as r')
            //   .withSchema(this.DBO_SCHEMA)
            //   .where('r.role_id', role_id)
            //   .leftJoin('permission_group as pg', 'r.permission_group_id', '=', 'pg.id')
            //   .select('*');
            return yield this.db("organization_permission_groups as opg")
                .withSchema(this.DBO_SCHEMA)
                .where("opg.organization_id", organization_id)
                .andWhere("r.role_id", role_id)
                .join("roles_permissions as r", "opg.permission_group_id", "=", "r.permission_group_id")
                .join("permission_group as pg", "opg.permission_group_id", "=", "pg.id")
                .select("r.role_permission_group_id", "r.role_id", "opg.permission_group_id", "pg.id", "pg.name");
        });
    }
    getPermissionGroupIdWiseEmployee(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("roles_permissions_employee as r")
                .withSchema(this.DBO_SCHEMA)
                .where("r.employee", employee)
                .leftJoin("permission_group_employee as pg", "r.permission_group_id", "=", "pg.id")
                .select("*");
        });
    }
    getGroupIdWisePermission(role_permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("role_permission_group as rpg")
                .withSchema(this.DBO_SCHEMA)
                .where("rpg.role_permission_id", role_permission_id)
                .join("permissions as p", "rpg.permission_id", "=", "p.id")
                .select("p.id as permission_id", "p.name as permission_name", "rpg.permission_type");
            return data;
        });
    }
    getGroupIdWisePermissionEmployee(role_permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("role_permission_group_employee as rpg")
                .withSchema(this.DBO_SCHEMA)
                .where("rpg.employee_permission_id", role_permission_id)
                .join("permissions_employee as p", "rpg.permission_id", "=", "p.id")
                .select("p.id as permission_id", "p.name as permission_name", "rpg.permission_type");
            return data;
        });
    }
    getPermissionFromPermissionGroup(permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permissions as rpg")
                .withSchema(this.DBO_SCHEMA)
                .where("rpg.permission_group_id", permission_group_id)
                .select("*");
        });
    }
    //permission group
    //insert Permission Group
    insertPermissionGroups(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permission_group")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    //insert Permissions
    insertPermissions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permissions")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    //get permission groups
    //create
    getPermissionGroups(org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("permission_group as pg")
                .withSchema(this.DBO_SCHEMA)
                .andWhere("organization_id", org_id)
                .select("*");
            const total = yield this.db("permission_group as pg")
                .withSchema(this.DBO_SCHEMA)
                .andWhere("organization_id", org_id)
                .count("id as total");
            return { data, total };
        });
    }
    //create
    getPermissions(org_id, permission_group) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("permission_with_permission_group as pwpg")
                .withSchema(this.DBO_SCHEMA)
                .whereIn("pwpg.permission_group_id", permission_group)
                .select("*");
            const counting = yield this.db("permission_with_permission_group as pwpg")
                .withSchema(this.DBO_SCHEMA)
                .count("pwpg.permission_group_id as total")
                .whereIn("pwpg.permission_group_id", permission_group);
            return { data, total: counting[0].total };
        });
    }
    getPermissionsEmployee(org_id, permission_group) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("permission_with_permission_group_employee as pwpg")
                .withSchema(this.DBO_SCHEMA)
                .whereIn("pwpg.permission_group_id", permission_group)
                .select("*");
            const counting = yield this.db("permission_with_permission_group_employee as pwpg")
                .withSchema(this.DBO_SCHEMA)
                .count("pwpg.permission_group_id as total")
                .whereIn("pwpg.permission_group_id", permission_group);
            return { data, total: counting[0].total };
        });
    }
    getPermissionsOrganizationWise(org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("organization_permission_groups as pwpg")
                .withSchema(this.DBO_SCHEMA)
                .where("organization_id", org_id)
                .select("*");
            return data;
        });
    }
    getPermissionsOrganizationWiseEmployee(org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("organization_employee_permission_groups as pwpg")
                .withSchema(this.DBO_SCHEMA)
                .where("organization_id", org_id)
                .select("*");
            return data;
        });
    }
    // check permission group exsists
    checkPermissionGroupExsists(name, org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permission_group")
                .withSchema(this.DBO_SCHEMA)
                .where("name", name)
                .andWhere({ organization_id: org_id })
                .select("*");
        });
    }
    // check permission under permission group exsists
    checkPermissionExsists(permission_group_id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permissions")
                .withSchema(this.DBO_SCHEMA)
                .where("permission_group_id", permission_group_id)
                .andWhere("name", name)
                .select("*");
        });
    }
    //deleteRoleWithPermissionGroupId
    deleteRoleWithPermissionGroupId(role_permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("roles_permissions")
                .withSchema(this.DBO_SCHEMA)
                .whereIn("role_permission_group_id", role_permission_group_id)
                .delete("*");
        });
    }
    //deleteRoleWithPermissionGroupId Employee
    deleteRoleWithPermissionGroupIdEmployee(role_permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("roles_permissions_employee")
                .withSchema(this.DBO_SCHEMA)
                .whereIn("role_permission_group_id", role_permission_group_id)
                .delete("*");
        });
    }
}
exports.default = ARolePermissionModel;
