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
exports.ManagementPermissionModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class ManagementPermissionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    getPermissionsGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('permission_with_permission_group as pwpg')
                .withSchema(this.DBO_SCHEMA)
                .select('*');
            const counting = yield this.db('permission_with_permission_group as pwpg')
                .withSchema(this.DBO_SCHEMA)
                .count('pwpg.permission_group_id as total');
            return { data, total: counting[0].total };
        });
    }
    deleteOrganizationGroups(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('organization_permission_groups')
                .withSchema(this.DBO_SCHEMA)
                .where('organization_id', organization_id)
                .delete();
            return data;
        });
    }
    getOrganizationGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('organization_permissions')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id: id })
                .select('*');
            const counting = yield this.db('organization_permissions')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id: id })
                .count('organization_permissions as total');
            return { data, total: counting[0].total };
        });
    }
    createPermissionGroup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('permission_group')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
            return data;
        });
    }
    insertOrganizationPermissionGroup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('organization_permission_groups')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
            return data;
        });
    }
    createPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('permissions')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
            return data;
        });
    }
    checkPermissionGroupExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db('permission_group')
                .withSchema(this.DBO_SCHEMA)
                .whereRaw('LOWER(TRIM(name)) = LOWER(TRIM(?))', [name])
                .select('*');
            return result;
        });
    }
    checkOrganizationPermissionGroupExists(organization_id, permission_group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db('organization_permission_groups')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id })
                .andWhere({ permission_group_id })
                .select('*');
            return result;
        });
    }
    checkPermissionExists(group_id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db('permissions')
                .withSchema(this.DBO_SCHEMA)
                .where('permission_group_id', group_id)
                .whereRaw('LOWER(TRIM(name)) = LOWER(TRIM(?))', [name])
                .select('*');
            return result;
        });
    }
}
exports.ManagementPermissionModel = ManagementPermissionModel;
