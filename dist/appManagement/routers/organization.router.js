"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const organization_controller_1 = __importDefault(require("../controller/organization.controller"));
class OrganizationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.organizationController = new organization_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create restaurant
        this.router
            .route('/')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ORGANIZATION), this.organizationController.createOrganization)
            .get(this.organizationController.getAllOrganization);
        //create restaurant
        this.router
            .route('/activation')
            .patch(this.organizationController.updateOrganizationStatus);
        //dashboard
        this.router
            .route('/dashboard')
            .get(this.organizationController.getDashboard);
        //management employee
        this.router
            .route('/users/:id')
            .get(this.organizationController.getAllOrganizationUser);
        //employee
        this.router
            .route('/employee')
            .post(this.organizationController.createManagementEmployee)
            .get(this.organizationController.getManagementEmployee);
        this.router
            .route('/admin')
            .post(this.organizationController.createManagementAdmin)
            .get(this.organizationController.getManagementAdmin);
        this.router
            .route('/permission-group-list')
            .get(this.organizationController.getAllPermissionGroup);
    }
}
exports.default = OrganizationRouter;
