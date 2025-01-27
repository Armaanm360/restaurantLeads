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
class PermissionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create groups
    createGroups(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.managementPermissionModel();
                const getCheck = yield model.checkPermissionGroupExists(req.body.name);
                if (getCheck.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                        message: 'Group Already Exists',
                    };
                }
                else {
                    const data = yield model.createPermissionGroup(req.body);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: req.body,
                    message: 'Permission Group Created Successfully',
                };
            }));
        });
    }
    //update organization permissions
    updateOrganizationPermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.managementPermissionModel();
                const organization_id = Number(req.params.id);
                const { permission_group_id } = req.body;
                // console.log(req.body);
                // return;
                // First, delete all permission groups for the organization
                yield model.deleteOrganizationGroups(organization_id);
                // Prepare the payloads for insertion
                const payloads = permission_group_id.map((groupId) => ({
                    organization_id,
                    permission_group_id: groupId,
                }));
                // Insert the new permission groups using Promise.all for concurrent inserts
                yield Promise.all(payloads.map((payload) => __awaiter(this, void 0, void 0, function* () {
                    yield model.insertOrganizationPermissionGroup(payload);
                })));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Permission Groups Updated Successfully',
                };
            }));
        });
    }
    //create group wise permission
    createGroupWisePermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.managementPermissionModel();
                // Iterate over each permission in the payload
                for (const permission of req.body.permissions) {
                    const getCheck = yield model.checkPermissionExists(Number(req.body.permission_group_id), permission.name);
                    if (getCheck.length) {
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                            message: `Permission '${permission.name}' Already Exists`,
                        };
                    }
                    else {
                        // Create the permission entry
                        yield model.createPermission({
                            permission_group_id: req.body.permission_group_id,
                            name: permission.name,
                        });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: req.body,
                    message: 'Permission Group Created Successfully',
                };
            }));
        });
    }
    //get all permission groups
    getAllPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.managementPermissionModel();
            const { data, total } = yield model.getPermissionsGroup();
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    //get all permission groups with permissions
    getAllGroupWisePermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.managementPermissionModel();
            const { data, total } = yield model.getPermissionsGroup();
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    //get single organization wise permissions
    getSingleOrganizeWisePermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.managementPermissionModel();
            const organization_id = Number(req.params.id);
            const { data, total } = yield model.getOrganizationGroup(organization_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
}
exports.default = PermissionService;
