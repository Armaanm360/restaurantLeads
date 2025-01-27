"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const rolepermission_controller_1 = __importDefault(require("../controllers/rolepermission.controller"));
class RolePermissionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.rolePermissionController = new rolepermission_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //role with permissions
        this.router
            .route("/")
            .post(this.rolePermissionController.createRoleWithPermission)
            .get(this.rolePermissionController.getRoleWithPermission);
        //permission groups
        this.router
            .route("/permission-group")
            .post(this.rolePermissionController.createPermissionGroup)
            .get(this.rolePermissionController.getPermissionGroups);
        //permissions group employee
        //pg
        this.router
            .route("/permission-group/permissions-employee")
            .get(this.rolePermissionController.getPermissionsEmployee);
        //permissions group
        //pg
        this.router
            .route("/permission-group/permissions")
            .post(this.rolePermissionController.createPermission)
            .get(this.rolePermissionController.getPermission);
        //single role and permission && update
        this.router
            .route("/employee/:id")
            .patch(this.rolePermissionController.updateRolePermissionEmployee)
            .get(this.rolePermissionController.getSingleRoleWithPermissionEmployee);
        this.router
            .route("/:id")
            .patch(this.rolePermissionController.updateRolePermission)
            .get(this.rolePermissionController.getSingleRoleWithPermission);
    }
}
exports.default = RolePermissionRouter;
