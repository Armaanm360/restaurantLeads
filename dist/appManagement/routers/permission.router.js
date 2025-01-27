"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const permission_controlle_1 = __importDefault(require("../controller/permission.controlle"));
class PermissionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.permissionController = new permission_controlle_1.default();
        this.callRouter();
    }
    callRouter() {
        //permission group
        this.router
            .route('/groups')
            .post(this.permissionController.createGroup)
            .get(this.permissionController.getAllPermissionGroup);
        //group wise permissions
        this.router
            .route('/group-wise-permissions')
            .get(this.permissionController.getAllGroupWisePermissions)
            .post(this.permissionController.createPermissions);
        //organization wise group with permissions
        this.router
            .route('/organization-permissions/:id')
            .get(this.permissionController.getSingleOrganizeWisePermissions)
            .patch(this.permissionController.updateOrganizationPermission);
    }
}
exports.default = PermissionRouter;
