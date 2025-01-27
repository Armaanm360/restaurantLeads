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
class UserAdminModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    // insert user admin
    insertUserAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
            return { checked };
        });
    }
    // remove notification
    removeNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('notification_admin')
                .withSchema(this.DBO_SCHEMA)
                .where({ user_id: id })
                .delete();
        });
    }
    //checkSingleAdmin
    checkSingleAdmin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .where('email', email)
                .select('*');
            return { checked };
        });
    }
    // get admin
    getSingleAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = payload;
            return yield this.db('user_admin AS ua')
                .withSchema(this.CRM_SCHEMA)
                .select('ua.id', 'ua.email', 'ua.password', 'ua.name', 'ua.avatar', 'ua.role', 'ua.phone', 'ua.status', 'ua.device_token', 'ua.created_at', 'ua.employee_id', 'ua.socket_id', 'o.id as organization_id', 'o.name as organization_name', 'o.logo as logo', 'o.leave_allowance', 'o.address', 'o.is_activate')
                .join('organization as o', 'o.id', '=', 'ua.organization_id')
                .where(function () {
                if (email) {
                    this.andWhere('ua.email', email);
                }
                if (id) {
                    this.andWhere('ua.id', id);
                }
            });
        });
    }
    getEnv(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('env_variable')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where(function () {
                if (key) {
                    this.where({ key });
                }
            });
        });
    }
    //get organization Info
    getOrganizationInfoEmployeeWise(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .where('email', email)
                .select('*');
        });
    }
    //get management password
    getMasterPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('management_users')
                .withSchema(this.MANAGEMENT_SCHEMA)
                .where('email', 'armaan.m360ict@gmail.com')
                .select('*');
            return data;
        });
    }
    //test
    adminTest(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('super_view')
                .withSchema(this.DBO_SCHEMA)
                .where({ role_id })
                .select('*');
            return data;
        });
    }
    checkRequestEmailExsists(current_email, requested_email) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .whereNot({ email: current_email })
                .andWhere({ email: requested_email })
                .select('*');
            return email;
        });
    }
    // get all admin
    // get all employee
    getAllAdmin(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, key, limit, skip } = payload;
            const dtbs = this.db('user_admin as e');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const spy_email = `spy_${organization_id}@gmail.com`;
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .select('e.id', 'e.name', 'e.phone', 'e.avatar', 'e.email', 'e.organization_id', 'rv.name as role_name')
                .where(function () {
                if (email) {
                    this.andWhere('e.email', email);
                }
            })
                .andWhereNot('email', spy_email)
                .leftJoin('roleview as rv', 'rv.id', '=', 'e.role')
                .andWhere(function () {
                if (key) {
                    this.andWhere('e.name', 'like', `%${key}%`).orWhere('e.name', 'like', `%${key}%`);
                    this.andWhere('e.email', 'like', `%${key}%`).orWhere('e.email', 'like', `%${key}%`);
                    this.andWhere('e.phone', 'like', `%${key}%`).orWhere('e.phone', 'like', `%${key}%`);
                }
            })
                .orderBy('id', 'desc');
            const total = yield this.db('user_admin as e')
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .count('e.id as total')
                .andWhereNot('email', spy_email)
                .leftJoin('roleview as rv', 'rv.id', '=', 'e.role')
                .where(function () {
                if (key) {
                    this.andWhere('e.name', 'like', `%${key}%`).orWhere('e.name', 'like', `%${key}%`);
                    this.andWhere('e.email', 'like', `%${key}%`).orWhere('e.email', 'like', `%${key}%`);
                    this.andWhere('e.phone', 'like', `%${key}%`).orWhere('e.phone', 'like', `%${key}%`);
                }
                if (email) {
                    this.andWhere('e.email', email);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    getAllAdminSocket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id: id })
                .select('*');
            return admin;
        });
    }
    // update admin model
    updateAdmin(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .where({ email: where.email })
                .update(payload);
        });
    }
    updateSingleAdmin(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where({ id: id });
        });
    }
    //creating organization
    createOrganization(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload)
                .returning('*');
            return organization;
        });
    }
    createRole(organization_id, role_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.db('role')
                .withSchema(this.DBO_SCHEMA)
                .insert({ organization_id: organization_id, name: role_name })
                .returning('*');
            return role;
        });
    }
    insertRolePermissionGroup(role_id, permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles_permissions = yield this.db('roles_permissions')
                .withSchema(this.DBO_SCHEMA)
                .insert({ role_id, permission_group_id })
                .returning('*');
            return roles_permissions;
        });
    }
    testInsert(role_permission_id, permission_id, permission_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles_permissions = yield this.db('roles_permissions_group')
                .withSchema(this.DBO_SCHEMA)
                .insert({ role_permission_id, permission_id, permission_type });
            return roles_permissions;
        });
    }
    insertPermissionGroupAndPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('role_permission_group')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    getGroupWisePermissions(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissions = yield this.db('permissions')
                .withSchema(this.DBO_SCHEMA)
                .where('permission_group_id', group_id)
                .select('id');
            return permissions;
        });
    }
    getSingleAdminInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('user_admin AS ua')
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .select('name', 'socket_id');
        });
    }
}
exports.default = UserAdminModel;
